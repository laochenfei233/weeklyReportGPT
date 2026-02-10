export interface APIProvider {
  name: string;
  baseURL: string;
  models: string[];
  keyFormat: RegExp;
  description: string;
  systemPrompt?: string; // 平台特定的系统提示词
}

export const SYSTEM_PROMPTS = {
  // 默认提示词
  default: `你是周报生成专家。根据输入生成专业周报。
格式：
## 本周工作
- 按类别的具体工作
## 工作成果
- 主要产出
## 下周计划
- 后续安排
直接输出Markdown，无需说明。`,

  // OpenAI 专用提示词
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

  // DeepSeek 专用提示词
  deepseek: `你是周报生成助手。
任务：根据输入生成周报。
格式：
## 本周工作
- 工作项1
- 工作项2
## 工作成果
## 下周计划
Markdown，直接输出。`,

  // Moonshot AI 专用提示词
  moonshot: `周报生成专家。
输入→输出周报。
结构：
### 本周工作
### 成果
### 问题
### 计划
Markdown格式。`,

  // 智谱AI 专用提示词
  zhipu: `周报生成助手。
将工作内容转为周报。
格式：
### 本周工作
### 成果
### 计划
Markdown，无需前缀。`
};

export const API_PROVIDERS: Record<string, APIProvider> = {
  openai: {
    name: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    models: ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo-preview"],
    keyFormat: /^sk-[A-Za-z0-9_-]{20,}$/,
    description: "Official OpenAI API",
    systemPrompt: SYSTEM_PROMPTS.openai
  },
  deepseek: {
    name: "DeepSeek",
    baseURL: "https://api.deepseek.com/v1",
    models: ["deepseek-chat", "deepseek-coder"],
    keyFormat: /^sk-[A-Za-z0-9_-]{20,}$/,
    description: "DeepSeek AI API",
    systemPrompt: SYSTEM_PROMPTS.deepseek
  },
  moonshot: {
    name: "Moonshot AI",
    baseURL: "https://api.moonshot.cn/v1",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    keyFormat: /^sk-[A-Za-z0-9_-]{20,}$/,
    description: "Moonshot AI API",
    systemPrompt: SYSTEM_PROMPTS.moonshot
  },
  zhipu: {
    name: "Zhipu AI",
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    models: ["glm-4", "glm-3-turbo"],
    keyFormat: /^[A-Za-z0-9._-]{16,}$/,
    description: "Zhipu AI GLM API",
    systemPrompt: SYSTEM_PROMPTS.zhipu
  },

  custom: {
    name: "Custom",
    baseURL: "",
    models: [],
    keyFormat: /.+/,
    description: "Custom OpenAI-compatible API",
    systemPrompt: SYSTEM_PROMPTS.default
  }
};

export function detectProvider(baseURL: string): APIProvider | null {
  for (const provider of Object.values(API_PROVIDERS)) {
    if (provider.baseURL && baseURL.includes(new URL(provider.baseURL).hostname)) {
      return provider;
    }
  }
  return null;
}

export function validateAPIKey(apiKey: string, baseURL: string): boolean {
  // Clean the API key (remove whitespace)
  const cleanKey = apiKey.trim();
  
  if (!cleanKey) {
    return false;
  }
  
  const provider = detectProvider(baseURL);
  if (provider) {
    return provider.keyFormat.test(cleanKey);
  }
  
  // For unknown providers, just check it's not empty and has reasonable length
  return cleanKey.length >= 10;
}

export function getAPIKeyInfo(apiKey: string, baseURL: string): { isValid: boolean; provider: string; format: string } {
  const cleanKey = apiKey.trim();
  const provider = detectProvider(baseURL);
  
  return {
    isValid: validateAPIKey(apiKey, baseURL),
    provider: provider?.name || "Unknown",
    format: provider ? `Expected: ${provider.keyFormat.source}` : "No specific format required"
  };
}

export function getDefaultModel(baseURL: string): string {
  const provider = detectProvider(baseURL);
  return provider?.models[0] || "gpt-3.5-turbo";
}

// 获取指定baseURL对应的系统提示词
export function getSystemPrompt(baseURL: string): string {
  const provider = detectProvider(baseURL);
  return provider?.systemPrompt || SYSTEM_PROMPTS.default;
}

// 根据baseURL和配置确定使用的系统提示词
export function getEffectiveSystemPrompt(
   baseURL: string,
   customSystemPrompt?: string
): string {
  // 如果有自定义提示词，使用自定义提示词
  if (customSystemPrompt && customSystemPrompt.trim().length > 0) {
    return customSystemPrompt;
  }
  // 否则根据平台返回对应的提示词
  return getSystemPrompt(baseURL);
}