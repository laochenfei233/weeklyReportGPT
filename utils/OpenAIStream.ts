import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { validateAPIKey, getDefaultModel } from "./apiConfig";

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

export async function OpenAIStream(payload: OpenAIStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let counter = 0;

  const useUserKey = process.env.NEXT_PUBLIC_USE_USER_KEY === "true";
  const config = getAPIConfig();
  
  // Use user-provided key if enabled, otherwise use environment key
  const apiKey = useUserKey ? (payload.api_key || "") : config.apiKey;
  const baseURL = config.baseURL;
  const model = payload.model || config.model;

  if (!apiKey) {
    throw new Error("API key is required");
  }

  if (!validateAPIKey(apiKey, baseURL)) {
    throw new Error("Invalid API key format");
  }

  // Clean payload
  const cleanPayload = { ...payload, model };
  delete cleanPayload.api_key;

  const endpoint = `${baseURL}/chat/completions`;
  const timeout = parseInt(process.env.REQUEST_TIMEOUT || "30000");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "User-Agent": "Weekly-Report/1.0.0",
      },
      method: "POST",
      body: JSON.stringify(cleanPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API request failed: ${res.status} ${res.statusText} - ${errorText}`);
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
              const text = json.choices?.[0]?.delta?.content || "";
              
              if (counter < 2 && (text.match(/\n/) || []).length) {
                // Skip prefix characters like "\n\n"
                return;
              }
              
              if (text) {
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