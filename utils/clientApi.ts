// 客户端API调用工具 - 用于静态页面部署（GitHub Pages / Cloudflare Pages）
// 此文件提供客户端直接调用AI API的功能，无需服务端支持

import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

// 简单的Token计数函数（近似值）
function estimateTokens(text: string): number {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars / 1.5 + otherChars / 4);
}

// API适配器接口
interface APIAdapter {
  name: string;
  transformEndpoint: (baseURL: string, model: string) => string;
  transformHeaders: (apiKey: string) => Record<string, string>;
  transformPayload: (payload: any) => any;
  transformResponse: (response: any) => string;
}

// 获取API适配器
function getAPIAdapter(baseURL: string): APIAdapter {
  const url = baseURL.toLowerCase();
  
  if (url.includes('deepseek.com')) {
    return {
      name: 'DeepSeek',
      transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
      transformHeaders: (apiKey: string) => ({
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }),
      transformPayload: (payload: any) => payload,
      transformResponse: (response: any) => response.choices?.[0]?.delta?.content || ''
    };
  } else if (url.includes('moonshot.cn')) {
    return {
      name: 'Moonshot',
      transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
      transformHeaders: (apiKey: string) => ({
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }),
      transformPayload: (payload: any) => payload,
      transformResponse: (response: any) => response.choices?.[0]?.delta?.content || ''
    };
  } else if (url.includes('bigmodel.cn')) {
    return {
      name: 'ZhipuAI',
      transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
      transformHeaders: (apiKey: string) => ({
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }),
      transformPayload: (payload: any) => payload,
      transformResponse: (response: any) => response.choices?.[0]?.delta?.content || ''
    };
  } else {
    return {
      name: 'OpenAI',
      transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
      transformHeaders: (apiKey: string) => ({
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }),
      transformPayload: (payload: any) => payload,
      transformResponse: (response: any) => response.choices?.[0]?.delta?.content || ''
    };
  }
}

// 系统提示词配置
const SYSTEM_PROMPTS = {
  default: `你是周报生成专家。根据输入生成专业周报。
格式：
## 本周工作
- 按类别的具体工作
## 工作成果
- 主要产出
## 下周计划
- 后续安排
直接输出Markdown，无需说明。`,
  
  openai: `你是周报生成专家。整理工作内容为周报。
结构：
## 本周工作内容
（分点列出）
## 工作成果
（产出总结）
## 遇到的问题
（如有）
## 下周工作计划
（后续安排）
Markdown格式，直接输出。`,
  
  deepseek: `你是周报生成助手。
任务：根据输入生成周报。
格式：
## 本周工作
- 工作项1
- 工作项2
## 工作成果
## 下周计划
Markdown，直接输出。`,
  
  moonshot: `周报生成专家。
输入→输出周报。
结构：
### 本周工作
### 成果
### 问题
### 计划
Markdown格式。`,
  
  zhipu: `周报生成助手。
将工作内容转为周报。
格式：
### 本周工作
### 成果
### 计划
Markdown，无需前缀。`
};

// 获取系统提示词
function getSystemPrompt(baseURL: string): string {
  if (baseURL.includes('deepseek.com')) {
    return SYSTEM_PROMPTS.deepseek;
  } else if (baseURL.includes('moonshot.cn')) {
    return SYSTEM_PROMPTS.moonshot;
  } else if (baseURL.includes('bigmodel.cn')) {
    return SYSTEM_PROMPTS.zhipu;
  }
  return SYSTEM_PROMPTS.default;
}

// 验证API密钥格式
function validateAPIKey(apiKey: string, baseURL: string): boolean {
  const cleanKey = apiKey.trim();
  if (!cleanKey || cleanKey.length < 10) return false;
  
  // 根据不同的API提供商验证格式
  if (baseURL.includes('openai.com') || baseURL.includes('deepseek.com') || baseURL.includes('moonshot.cn')) {
    return /^sk-[A-Za-z0-9_-]{20,}$/.test(cleanKey);
  } else if (baseURL.includes('bigmodel.cn')) {
    return /^[A-Za-z0-9._-]{16,}$/.test(cleanKey);
  }
  return true;
}

// 获取默认模型
function getDefaultModel(baseURL: string): string {
  if (baseURL.includes('deepseek.com')) {
    return 'deepseek-chat';
  } else if (baseURL.includes('moonshot.cn')) {
    return 'moonshot-v1-8k';
  } else if (baseURL.includes('bigmodel.cn')) {
    return 'glm-4';
  }
  return 'gpt-3.5-turbo';
}

// 客户端API调用选项
export interface ClientApiOptions {
  apiKey: string;
  baseURL?: string;
  model?: string;
  customSystemPrompt?: string;
  timeout?: number;
}

// 客户端API响应流回调
export type StreamCallback = (chunk: string) => void;
export type ErrorCallback = (error: Error) => void;
export type CompleteCallback = () => void;

// 客户端API调用函数
export async function clientApiCall(
  prompt: string,
  options: ClientApiOptions,
  onStream: StreamCallback,
  onError: ErrorCallback,
  onComplete: CompleteCallback
): Promise<void> {
  const {
    apiKey,
    baseURL = "https://api.openai.com/v1",
    model,
    customSystemPrompt,
    timeout = 30000
  } = options;

  // 验证API密钥
  if (!validateAPIKey(apiKey, baseURL)) {
    onError(new Error(`API密钥格式无效，请检查API密钥是否正确`));
    return;
  }

  const effectiveModel = model || getDefaultModel(baseURL);
  const systemPrompt = customSystemPrompt || getSystemPrompt(baseURL);
  
  // 根据API提供商调整超时
  let effectiveTimeout = timeout;
  if (baseURL.includes('deepseek.com')) {
    effectiveTimeout = 45000;
  } else if (baseURL.includes('moonshot.cn')) {
    effectiveTimeout = 40000;
  }

  // 获取适配器
  const adapter = getAPIAdapter(baseURL);
  
  // 构建请求体
  const payload = {
    model: effectiveModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1
  };

  // 转换请求
  const endpoint = adapter.transformEndpoint(baseURL, effectiveModel);
  const headers = adapter.transformHeaders(apiKey);
  const transformedPayload = adapter.transformPayload(payload);

  console.log(`[Client API] Calling ${adapter.name} API: ${endpoint}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(transformedPayload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `API请求失败: ${res.status} ${res.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        if (errorText) errorMessage = errorText;
      }
      
      onError(new Error(errorMessage));
      return;
    }

    // 处理流式响应
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let counter = 0;

    if (!reader) {
      onError(new Error("无法读取响应流"));
      return;
    }

    function onParse(event: ParsedEvent | ReconnectInterval) {
      if (event.type === "event") {
        const data = event.data;
        
        if (data === "[DONE]") {
          onComplete();
          return;
        }
        
        try {
          const json = JSON.parse(data);
          const text = adapter.transformResponse(json);
          
          if (counter < 2 && (text.match(/\n/) || []).length) {
            return;
          }
          
          if (text) {
            onStream(text);
            counter++;
          }
        } catch (e) {
          console.error("Parse error:", e);
        }
      }
    }

    const parser = createParser(onParse);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      parser.feed(decoder.decode(value));
    }

    onComplete();

  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        onError(new Error("请求超时，请检查网络连接或API密钥"));
      } else {
        onError(error);
      }
    } else {
      onError(new Error("发生未知错误"));
    }
  }
}

// 检查是否在静态部署模式下运行
export function isStaticDeployment(): boolean {
  // 通过检查是否是静态导出环境来判断
  return typeof window !== 'undefined' && 
         (window.location.protocol === 'file:' || 
          document.title === '' || 
          false); // 简化的检测
}
