import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

/**
 * 自动初始化API
 * 在首次部署时自动生成必要的配置
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const initResults = {
      jwtSecret: null as string | null,
      status: 'success',
      message: '初始化完成',
      warnings: [] as string[]
    };

    // 检查JWT_SECRET
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
      const generatedSecret = crypto.randomBytes(64).toString('hex');
      initResults.jwtSecret = generatedSecret;
      initResults.warnings.push('JWT_SECRET未配置，已生成临时密钥');
      
      // 在运行时设置环境变量（仅对当前进程有效）
      process.env.JWT_SECRET = generatedSecret;
    }

    // 检查其他必要的环境变量
    const requiredEnvVars = ['OPENAI_API_KEY'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      initResults.warnings.push(`缺少环境变量: ${missingEnvVars.join(', ')}`);
    }

    // 返回初始化结果
    res.status(200).json({
      success: true,
      data: initResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Auto-init error:', error);
    res.status(500).json({
      success: false,
      error: '自动初始化失败',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}