import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, createUser } from '../../../lib/db';
import { hashPassword, generateToken, isValidEmail, isValidPassword } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, confirmPassword } = req.body;

    // 验证输入
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: '所有字段都不能为空' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: '两次输入的密码不一致' });
    }

    // 检查用户是否已存在
    const existingUser = await getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: '该邮箱已被注册' });
    }

    // 创建用户
    const passwordHash = await hashPassword(password);
    const user = await createUser(email.toLowerCase(), passwordHash);

    if (!user) {
      return res.status(500).json({ error: '注册失败，请稍后重试' });
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

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin
      },
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: '注册失败，请稍后重试' });
  }
}