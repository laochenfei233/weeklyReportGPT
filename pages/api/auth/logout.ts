import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 清除cookie
    res.setHeader('Set-Cookie', [
      `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    ]);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: '登出失败' });
  }
}