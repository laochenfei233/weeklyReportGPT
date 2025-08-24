import { NextApiRequest, NextApiResponse } from 'next';
import { isValidEmail } from '../../../lib/auth';
import { getUserByEmail, generateVerificationCode, saveEmailVerification } from '../../../lib/db';
import { sendVerificationEmail } from '../../../lib/email';

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
    const code = generateVerificationCode();

    // 保存验证码到数据库
    const saved = await saveEmailVerification(email.toLowerCase(), code);
    if (!saved) {
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