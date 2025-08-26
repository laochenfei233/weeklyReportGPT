import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, getUserByUsername } from '../../../lib/db';
import { verifyPassword, generateToken, isValidEmail } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identifier, password } = req.body; // identifier 可以是邮箱或用户名

    // 验证输入
    if (!identifier || !password) {
      return res.status(400).json({ error: '用户名/邮箱和密码不能为空' });
    }

    // 查找用户（支持邮箱或用户名）
    let user;
    if (isValidEmail(identifier)) {
      // 如果是邮箱格式，按邮箱查找
      user = await getUserByEmail(identifier.toLowerCase());
    } else {
      // 否则按用户名查找
      user = await getUserByUsername(identifier);
    }

    if (!user) {
      return res.status(401).json({ error: '用户名/邮箱或密码错误' });
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: '用户名/邮箱或密码错误' });
    }

    // 生成token
    const token = generateToken({
      id: user.id,
      email: user.email,
      isAdmin: user.is_admin
    });

    // 设置cookie - 使用环境变量配置的会话持续时间，默认14天
    const sessionDurationDays = parseInt(process.env.SESSION_DURATION_DAYS || '14');
    const maxAge = sessionDurationDays * 24 * 60 * 60; // 转换为秒
    
    res.setHeader('Set-Cookie', [
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    ]);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.is_admin,
        emailVerified: user.email_verified
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '登录失败，请稍后重试' });
  }
}