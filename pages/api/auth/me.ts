import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '../../../lib/auth';
import { getUserStats } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: '未登录' });
    }

    // 获取用户统计信息
    const stats = await getUserStats(user.id);

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      },
      stats
    });

  } catch (error) {
    console.error('Get user info error:', error);
    return res.status(500).json({ error: '获取用户信息失败' });
  }
}