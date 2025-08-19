import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, apiBase, model } = req.body;

  if (!apiKey || !apiBase) {
    return res.status(400).json({ error: 'API密钥和基础URL是必需的' });
  }

  try {
    // 测试API连接
    const response = await fetch(`${apiBase}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10秒超时
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API请求失败 (${response.status})`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      return res.status(response.status).json({
        error: errorMessage,
        details: errorText
      });
    }

    const data = await response.json();
    const availableModels = data.data?.map((m: any) => m.id) || [];
    const modelAvailable = availableModels.includes(model);

    return res.status(200).json({
      message: 'API配置测试成功',
      apiBase,
      model,
      modelAvailable,
      availableModelsCount: availableModels.length,
      // 不返回完整的模型列表以避免响应过大
      sampleModels: availableModels.slice(0, 5)
    });

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'API请求超时，请检查网络连接和API地址'
      });
    }

    return res.status(500).json({
      error: 'API连接失败',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}