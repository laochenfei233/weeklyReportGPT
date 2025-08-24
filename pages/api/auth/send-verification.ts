import { NextApiRequest, NextApiResponse } from 'next';
import { isValidEmail } from '../../../lib/auth';
import { getUserByEmail } from '../../../lib/db';
import { sendVerificationEmail } from '../../../lib/email';
import { sql } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // 验证输入
    if (!email) {
      return res.status(400).json({ error: '邮箱地址不能为空' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: '邮箱格式不正确' });
    }

    // 检查邮箱是否已被注册
    const existingUser = await getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: '该邮箱已被注册' });
    }

    // 生成验证码
    const code = Math.random().toString().slice(2, 8).padStart(6, '0');

    // 保存验证码到数据库
    try {
      // 删除旧的验证码
      await sql`DELETE FROM email_verifications WHERE email = ${email.toLowerCase()}`;
      
      // 设置过期时间（10分钟后）
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      
      await sql`
        INSERT INTO email_verifications (email, code, expires_at)
        VALUES (${email.toLowerCase()}, ${code}, ${expiresAt})
      `;
    } catch (error) {
      console.error('Save verification code error:', error);
      return res.status(500).json({ error: '验证码保存失败，请稍后重试' });
    }

    // 发送验证码邮件
    const sent = await sendVerificationEmail(email.toLowerCase(), code);
    if (!sent) {
      return res.status(500).json({ error: '验证码发送失败，请稍后重试' });
    }

    return res.status(200).json({
      success: true,
      message: '验证码已发送到您的邮箱，请查收'
    });

  } catch (error) {
    console.error('Send verification error:', error);
    return res.status(500).json({ error: '发送验证码失败，请稍后重试' });
  }
}