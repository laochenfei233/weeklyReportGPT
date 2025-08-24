import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, getUserByUsername, createUser, verifyEmailCode, markEmailAsVerified } from '../../../lib/db';
import { hashPassword, generateToken, isValidEmail, isValidPassword } from '../../../lib/auth';
import { sendWelcomeEmail } from '../../../lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, username, password, confirmPassword, verificationCode } = req.body;

    // 验证输入
    if (!email || !username || !password || !confirmPassword || !verificationCode) {
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

    // 验证邮箱验证码
    const isValidCode = await verifyEmailCode(email.toLowerCase(), verificationCode);
    if (!isValidCode) {
      return res.status(400).json({ error: '验证码无效或已过期' });
    }

    // 检查邮箱是否已存在
    const existingEmailUser = await getUserByEmail(email.toLowerCase());
    if (existingEmailUser) {
      return res.status(409).json({ error: '该邮箱已被注册' });
    }
    
    // 检查用户名是否已存在
    const existingUsernameUser = await getUserByUsername(username);
    if (existingUsernameUser) {
      return res.status(409).json({ error: '该用户名已被注册' });
    }

    // 创建用户
    const passwordHash = await hashPassword(password);
    
    // 创建用户（包含用户名）
    const user = await createUser(email.toLowerCase(), username, passwordHash);

    if (!user) {
      return res.status(500).json({ error: '注册失败，请稍后重试' });
    }

    // 标记邮箱为已验证
    await markEmailAsVerified(email.toLowerCase());

    // 发送欢迎邮件
    await sendWelcomeEmail(email.toLowerCase(), username);

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
        username: user.username,
        isAdmin: user.is_admin
      },
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: '注册失败，请稍后重试' });
  }
}