import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail } from '../../../lib/db';
import { verifyPassword, generateToken, isValidEmail } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // 验证输入
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 查找用户
    const user = await getUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 生成token
    const token = generateToken({
      id: user.id,
      email: user.email,
      isAdmin: user.is_admin
    });

    // 设置cookie
    res.setHeader('Set-Cookie', [
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    ]);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '登录失败，请稍后重试' });
  }
}