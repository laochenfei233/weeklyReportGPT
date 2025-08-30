import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 生成64字节的随机密钥
    const secret = crypto.randomBytes(64).toString('hex');
    
    return res.status(200).json({
      success: true,
      jwt_secret: secret,
      message: '请将此密钥复制到 Vercel 环境变量中',
      instructions: [
        '1. 复制上面的 jwt_secret 值',
        '2. 进入 Vercel Dashboard → Settings → Environment Variables',
        '3. 添加变量名: JWT_SECRET',
        '4. 粘贴密钥值',
        '5. 重新部署项目'
      ]
    });
  } catch (error) {
    console.error('Generate JWT secret error:', error);
    return res.status(500).json({ error: '生成JWT密钥失败' });
  }
}