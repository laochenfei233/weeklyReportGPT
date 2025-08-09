import { ChatGPTMessage } from './OpenAIStream';

export interface APIAdapter {
  name: string;
  transformEndpoint: (baseURL: string, model: string) => string;
  transformHeaders: (apiKey: string) => Record<string, string>;
  transformPayload: (payload: any) => any;
  transformResponse: (chunk: any) => string;
}

// OpenAI标准格式适配器
export const openaiAdapter: APIAdapter = {
  name: 'OpenAI',
  transformEndpoint: (baseURL: string) => `${baseURL}/chat/completions`,
  transformHeaders: (apiKey: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'User-Agent': 'Weekly-Report/1.0.0',
  }),
  transformPayload: (payload: any) => payload,
  transformResponse: (chunk: any) => chunk.choices?.[0]?.delta?.content || '',
};

// 火山引擎适配器
export const volcengineAdapter: APIAdapter = {
  name: 'Volcengine',
  transformEndpoint: (baseURL: string, model: string) => {
    // 火山引擎的端点格式: /api/v3/bots/{bot_id}/chat/completions
    
    // 移除末尾的斜杠以便统一处理
    const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    
    if (cleanBaseURL.endsWith('/bots')) {
      // 如果baseURL以/bots结尾，添加bot_id和chat/completions
      return `${cleanBaseURL}/${model}/chat/completions`;
    } else if (cleanBaseURL.includes('/bots/')) {
      // 如果baseURL包含/bots/但不以它结尾，直接添加bot_id和chat/completions
      return `${cleanBaseURL}${model}/chat/completions`;
    } else {
      // 如果baseURL不包含/bots，需要添加完整路径
      return `${cleanBaseURL}/bots/${model}/chat/completions`;
    }
  },
  transformHeaders: (apiKey: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'User-Agent': 'Weekly-Report/1.0.0',
  }),
  transformPayload: (payload: any) => {
    // 火山引擎的payload格式 - 移除model字段，因为它已经在URL中了
    const { model, ...cleanPayload } = payload;
    return cleanPayload;
  },
  transformResponse: (chunk: any) => {
    // 火山引擎的响应格式可能略有不同
    return chunk.choices?.[0]?.delta?.content || 
           chunk.choices?.[0]?.message?.content || 
           '';
  },
};

export function getAPIAdapter(baseURL: string): APIAdapter {
  if (baseURL.includes('volces.com') || baseURL.includes('volcengine')) {
    return volcengineAdapter;
  }
  
  // 默认使用OpenAI格式
  return openaiAdapter;
}