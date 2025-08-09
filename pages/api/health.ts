import { NextApiRequest, NextApiResponse } from 'next';
import { checkEnvironment } from '../../utils/envCheck';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const envCheck = checkEnvironment();
    const status = envCheck.isValid ? 'healthy' : 'warning';
    
    const apiKey = process.env.OPENAI_API_KEY || '';
    const maskedApiKey = apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'Not set';
    
    res.status(200).json({
      status,
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: {
        nodeVersion: process.version,
        useUserKey: process.env.NEXT_PUBLIC_USE_USER_KEY === 'true',
        apiBase: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        hasApiKey: !!process.env.OPENAI_API_KEY,
        maskedApiKey,
        timeout: process.env.REQUEST_TIMEOUT || '30000',
        maxTokens: process.env.MAX_TOKENS || '2000',
      },
      checks: {
        isValid: envCheck.isValid,
        errors: envCheck.errors,
        warnings: envCheck.warnings,
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}