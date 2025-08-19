import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

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

    const stream = await OpenAIStream(payload);
    
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
