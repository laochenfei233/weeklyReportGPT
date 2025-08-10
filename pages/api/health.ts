import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      config: {
        hasApiKey: !!process.env.OPENAI_API_KEY,
        apiBase: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        useUserKey: process.env.NEXT_PUBLIC_USE_USER_KEY === 'true'
      }
    };

    // 检查关键配置
    const issues: string[] = [];
    if (!process.env.OPENAI_API_KEY && process.env.NEXT_PUBLIC_USE_USER_KEY !== 'true') {
      issues.push('API key not configured');
    }

    if (issues.length > 0) {
      return res.status(503).json({
        ...health,
        status: 'unhealthy',
        issues
      });
    }

    return res.status(200).json(health);
    
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}