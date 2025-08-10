// API适配器 - 支持不同的AI服务提供商

interface APIAdapter {
  name: string;
  transformEndpoint: (baseURL: string, model: string) => string;
  transformHeaders: (apiKey: string) => Record<string, string>;
  transformPayload: (payload: any) => any;
  transformResponse: (response: any) => string;
}

// OpenAI 适配器
const openaiAdapter: APIAdapter = {
  name: 'OpenAI',
  transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
  transformHeaders: (apiKey: string) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }),
  transformPayload: (payload: any) => payload,
  transformResponse: (response: any) => {
    return response.choices?.[0]?.delta?.content || '';
  }
};

// DeepSeek 适配器
const deepseekAdapter: APIAdapter = {
  name: 'DeepSeek',
  transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
  transformHeaders: (apiKey: string) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }),
  transformPayload: (payload: any) => payload,
  transformResponse: (response: any) => {
    return response.choices?.[0]?.delta?.content || '';
  }
};

// Moonshot 适配器
const moonshotAdapter: APIAdapter = {
  name: 'Moonshot',
  transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
  transformHeaders: (apiKey: string) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }),
  transformPayload: (payload: any) => payload,
  transformResponse: (response: any) => {
    return response.choices?.[0]?.delta?.content || '';
  }
};

// 智谱AI 适配器
const zhipuAdapter: APIAdapter = {
  name: 'ZhipuAI',
  transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
  transformHeaders: (apiKey: string) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }),
  transformPayload: (payload: any) => payload,
  transformResponse: (response: any) => {
    return response.choices?.[0]?.delta?.content || '';
  }
};

// 默认适配器（兼容OpenAI格式）
const defaultAdapter: APIAdapter = {
  name: 'Default',
  transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
  transformHeaders: (apiKey: string) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }),
  transformPayload: (payload: any) => payload,
  transformResponse: (response: any) => {
    return response.choices?.[0]?.delta?.content || '';
  }
};

export function getAPIAdapter(baseURL: string): APIAdapter {
  const url = baseURL.toLowerCase();
  
  if (url.includes('deepseek.com')) {
    return deepseekAdapter;
  } else if (url.includes('moonshot.cn')) {
    return moonshotAdapter;
  } else if (url.includes('bigmodel.cn')) {
    return zhipuAdapter;
  } else if (url.includes('openai.com')) {
    return openaiAdapter;
  } else {
    return defaultAdapter;
  }
}