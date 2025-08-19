import { NextApiRequest, NextApiResponse } from 'next';
import { initDatabase } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 简单的安全检查 - 只允许在开发环境或通过特定密钥访问
  const initKey = req.headers['x-init-key'] || req.body.initKey;
  const expectedKey = process.env.DB_INIT_KEY || 'dev-init-key';
  
  if (initKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await initDatabase();
    return res.status(200).json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return res.status(500).json({ 
      error: 'Database initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}