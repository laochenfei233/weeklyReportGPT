import { NextApiRequest, NextApiResponse } from 'next';
import { isValidEmail } from '../../../lib/auth';
import { getUserByEmail } from '../../../lib/db';
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

    // 发送验证码邮件 (暂时禁用以解决编译问题)
    // const sent = await sendVerificationEmail(email.toLowerCase(), code);
    // if (!sent) {
    //   return res.status(500).json({ error: '验证码发送失败，请稍后重试' });
    // }
    
    // 管理员验证码 - 在控制台显示（用于2FA或服务器日志查看）
    const timestamp = new Date().toLocaleString('zh-CN');
    console.log('\n' + '='.repeat(60));
    console.log('🔐 管理员验证码 - ADMIN VERIFICATION CODE');
    console.log('='.repeat(60));
    console.log(`📧 邮箱: ${email.toLowerCase()}`);
    console.log(`🔢 验证码: ${code}`);
    console.log(`⏰ 生成时间: ${timestamp}`);
    console.log(`⏳ 有效期: 10分钟`);
    console.log(`🔍 请在 Vercel Functions 日志中查看此验证码`);
    console.log('='.repeat(60) + '\n');

    return res.status(200).json({
      success: true,
      message: '管理员验证码已生成，请在服务器控制台日志中查看'
    });

  } catch (error) {
    console.error('Send verification error:', error);
    return res.status(500).json({ error: '发送验证码失败，请稍后重试' });
  }
}