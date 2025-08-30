import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
import { getUserFromRequest } from "../../lib/auth";

// Validate environment variables
if (process.env.NEXT_PUBLIC_USE_USER_KEY !== "true") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }
}

export const config = {
  runtime: "edge",
};

interface CustomConfig {
  apiKey?: string;
  apiBase?: string;
  model?: string;
}

interface OpenAIStreamResult {
  stream: ReadableStream;
  inputTokens: number;
  outputTokens: number;
}

interface RequestBody {
  prompt?: string;
  api_key?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  customConfig?: CustomConfig;
}

const handler = async (req: Request): Promise<Response> => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { 
      prompt, 
      api_key, 
      model,
      temperature = 0.7,
      max_tokens,
      customConfig
    } = (await req.json()) as RequestBody;

    if (!prompt || prompt.trim().length === 0) {
      return new Response("Prompt is required", { status: 400 });
    }

    // 在 Edge Runtime 中跳过用户认证，避免 crypto 模块问题
    const user = null;
    
    // 检查API密钥配置
    const useUserKey = process.env.NEXT_PUBLIC_USE_USER_KEY === "true";
    const hasSystemKey = !!process.env.OPENAI_API_KEY;
    const hasUserKey = !!(customConfig?.apiKey || api_key);
    
    // 如果启用了用户密钥模式但没有提供密钥，且系统也没有密钥，则报错
    if (useUserKey && !hasUserKey && !hasSystemKey) {
      return new Response(JSON.stringify({
        error: "请配置API密钥",
        code: 'API_KEY_REQUIRED',
        details: "系统未配置默认API密钥，请在设置中配置您的API密钥"
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 如果没有用户密钥但有系统密钥，使用系统密钥
    if (!hasUserKey && hasSystemKey) {
      console.log('使用系统配置的API密钥');
    }

    // System prompt for weekly report generation
    const systemPrompt = "你是一个专业的周报生成助手。请帮我把以下的工作内容填充为一篇完整的周报，请直接用markdown格式以分点叙述的形式输出，内容要专业、详细且条理清晰。";
    
    const payload: OpenAIStreamPayload = {
      model: model || customConfig?.model || process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: max_tokens || parseInt(process.env.MAX_TOKENS || "2000"),
      stream: true,
      n: 1,
      api_key: customConfig?.apiKey || api_key,
      customApiBase: customConfig?.apiBase,
    };

    const stream = await OpenAIStream(payload, user);
    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    
    let errorMessage = "Internal server error";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific error types
      if (error.message.includes("API key")) {
        statusCode = 401;
        errorMessage = "API密钥无效或未配置";
      } else if (error.message.includes("timeout")) {
        statusCode = 408;
        errorMessage = "请求超时，请稍后重试";
      } else if (error.message.includes("API request failed")) {
        statusCode = 502;
        errorMessage = "API服务暂时不可用，请稍后重试";
      }
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export default handler;
