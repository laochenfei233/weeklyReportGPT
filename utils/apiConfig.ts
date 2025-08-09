export interface APIProvider {
  name: string;
  baseURL: string;
  models: string[];
  keyFormat: RegExp;
  description: string;
}

export const API_PROVIDERS: Record<string, APIProvider> = {
  openai: {
    name: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    models: ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo-preview"],
    keyFormat: /^sk-[A-Za-z0-9_-]{20,}$/,
    description: "Official OpenAI API"
  },
  deepseek: {
    name: "DeepSeek",
    baseURL: "https://api.deepseek.com/v1",
    models: ["deepseek-chat", "deepseek-coder"],
    keyFormat: /^sk-[A-Za-z0-9_-]{20,}$/,
    description: "DeepSeek AI API"
  },
  moonshot: {
    name: "Moonshot AI",
    baseURL: "https://api.moonshot.cn/v1",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    keyFormat: /^sk-[A-Za-z0-9_-]{20,}$/,
    description: "Moonshot AI API"
  },
  zhipu: {
    name: "Zhipu AI",
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    models: ["glm-4", "glm-3-turbo"],
    keyFormat: /^[A-Za-z0-9._-]{16,}$/,
    description: "Zhipu AI GLM API"
  },
  volcengine: {
    name: "Volcengine (ByteDance)",
    baseURL: "https://ark.cn-beijing.volces.com/api/v3",
    models: ["bot-*"],
    keyFormat: /^[A-Za-z0-9._-]{16,}$/,
    description: "Volcengine Ark API"
  },
  custom: {
    name: "Custom",
    baseURL: "",
    models: [],
    keyFormat: /.+/,
    description: "Custom OpenAI-compatible API"
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