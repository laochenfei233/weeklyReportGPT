import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  try {
    switch (action) {
      case 'check-env':
        return handleEnvCheck(req, res);
      
      case 'test-api':
        return handleApiTest(req, res);
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Debug API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleEnvCheck(req: NextApiRequest, res: NextApiResponse) {
  const envVars = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '已设置' : '未设置',
    OPENAI_API_BASE: process.env.OPENAI_API_BASE || '使用默认值',
    OPENAI_MODEL: process.env.OPENAI_MODEL || '使用默认值',
    NEXT_PUBLIC_USE_USER_KEY: process.env.NEXT_PUBLIC_USE_USER_KEY || 'false',
    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT || '30000',
    MAX_TOKENS: process.env.MAX_TOKENS || '2000'
  };

  const issues = [];
  
  if (!process.env.OPENAI_API_KEY) {
    issues.push('OPENAI_API_KEY 未设置');
  } else if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    issues.push('OPENAI_API_KEY 格式可能不正确');
  }

  if (issues.length > 0) {
    return res.status(400).json({
      error: '环境变量配置有问题',
      issues,
      envVars
    });
  }

  return res.status(200).json({
    message: '环境变量配置正常',
    envVars
  });
}

async function handleApiTest(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

  if (!apiKey) {
    return res.status(400).json({ error: 'API密钥未设置' });
  }

  try {
    const response = await fetch(`${apiBase}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10秒超时
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({
        error: `API请求失败 (${response.status})`,
        details: errorData,
        apiBase,
        model
      });
    }

    const data = await response.json();
    const availableModels = data.data?.map((m: any) => m.id) || [];
    
    return res.status(200).json({
      message: 'API连接正常',
      apiBase,
      model,
      modelsCount: availableModels.length,
      modelAvailable: availableModels.includes(model)
    });

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'API请求超时',
        apiBase,
        model
      });
    }

    return res.status(500).json({
      error: 'API连接失败',
      details: error instanceof Error ? error.message : 'Unknown error',
      apiBase,
      model
    });
  }
}