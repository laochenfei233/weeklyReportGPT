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



export function getAPIAdapter(baseURL: string): APIAdapter {
  // 默认使用OpenAI格式
  return openaiAdapter;
}