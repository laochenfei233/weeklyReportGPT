import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { validateAPIKey, getDefaultModel } from "./apiConfig";
import { getAPIAdapter } from "./apiAdapters";

export type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
  api_key?: string;
  customApiBase?: string;
}

interface APIConfig {
  baseURL: string;
  apiKey: string;
  model: string;
}

function getAPIConfig(): APIConfig {
  const baseURL = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || getDefaultModel(baseURL);
  
  let apiKey = process.env.OPENAI_API_KEY || "";
  
  // Support multiple API keys (comma-separated)
  if (apiKey.includes(",")) {
    const apiKeys = apiKey.split(",").map(key => key.trim());
    const randomIndex = Math.floor(Math.random() * apiKeys.length);
    apiKey = apiKeys[randomIndex];
  }
  
  return { baseURL, apiKey, model };
}

// 简单的Token计数函数（近似值）
function estimateTokens(text: string): number {
  // 粗略估算：1个token约等于4个字符（英文）或1.5个字符（中文）
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars / 1.5 + otherChars / 4);
}

export async function OpenAIStream(payload: OpenAIStreamPayload, user?: any | null) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let counter = 0;
  let outputText = '';
  
  // 计算输入Token数
  const inputText = payload.messages.map(m => m.content).join(' ');
  const inputTokens = estimateTokens(inputText);

  const useUserKey = process.env.NEXT_PUBLIC_USE_USER_KEY === "true";
  const config = getAPIConfig();
  
  // Use custom config if provided, otherwise use user key or environment config
  const apiKey = payload.api_key || config.apiKey;
  const baseURL = payload.customApiBase || config.baseURL;
  const model = payload.model || config.model;

  if (!apiKey) {
    throw new Error("API key is required. Please check your environment variables.");
  }

  if (!validateAPIKey(apiKey, baseURL)) {
    throw new Error(`Invalid API key format for ${baseURL}. Please check your API key.`);
  }

  console.log(`Using API: ${baseURL} with model: ${model}`);

  // Get the appropriate adapter for this API
  const adapter = getAPIAdapter(baseURL);
  console.log(`Using adapter: ${adapter.name}`);

  // Clean payload
  const cleanPayload = { ...payload, model };
  delete cleanPayload.api_key;

  // Transform using adapter
  const endpoint = adapter.transformEndpoint(baseURL, model);
  const headers = adapter.transformHeaders(apiKey);
  const transformedPayload = adapter.transformPayload(cleanPayload);

  const timeout = parseInt(process.env.REQUEST_TIMEOUT || "30000");
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  console.log(`Endpoint: ${endpoint}`);
  console.log(`Payload:`, JSON.stringify(transformedPayload, null, 2));

  try {
    const res = await fetch(endpoint, {
      headers,
      method: "POST",
      body: JSON.stringify(transformedPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error: ${res.status} ${res.statusText}`, errorText);
      
      let errorMessage = `API request failed: ${res.status} ${res.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        // If not JSON, use the raw text
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      throw new Error(errorMessage);
    }

    const stream = new ReadableStream({
      async start(controller) {
        function onParse(event: ParsedEvent | ReconnectInterval) {
          if (event.type === "event") {
            const data = event.data;
            
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            
            try {
              const json = JSON.parse(data);
              const text = adapter.transformResponse(json);
              
              if (counter < 2 && (text.match(/\n/) || []).length) {
                // Skip prefix characters like "\n\n"
                return;
              }
              
              if (text) {
                outputText += text;
                const queue = encoder.encode(text);
                controller.enqueue(queue);
                counter++;
              }
            } catch (e) {
              console.error("Parse error:", e);
              controller.error(e);
            }
          }
        }

        const parser = createParser(onParse);
        
        try {
          if (!res.body) {
            throw new Error("Response body is null");
          }
          
          for await (const chunk of res.body as any) {
            parser.feed(decoder.decode(chunk));
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          // Token使用量记录在Edge Runtime中跳过，避免数据库依赖
          if (user && !user.isAdmin && !payload.customApiBase) {
            const outputTokens = estimateTokens(outputText);
            console.log(`Token usage (not recorded in Edge Runtime): ${inputTokens} input + ${outputTokens} output = ${inputTokens + outputTokens} total`);
          }
        }
      },
    });

    return stream;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("OpenAI Stream error:", error);
    throw error;
  }
}