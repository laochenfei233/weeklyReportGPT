import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken, generateVerificationCode, User } from '../../../lib/auth';

// 存储验证码的临时对象（生产环境应使用Redis等）
const verificationCodes = new Map<string, { code: string; expires: number }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { action, code } = req.body;

    if (action === 'request_code') {
      // 生成验证码
      const verificationCode = generateVerificationCode();
      const expires = Date.now() + 10 * 60 * 1000; // 10分钟过期
      
      verificationCodes.set('admin', { code: verificationCode, expires });
      
      // 在生产环境中，这个验证码会出现在Vercel Function日志中
      console.log(`管理员登录验证码: ${verificationCode}`);
      
      return res.status(200).json({ 
        message: '验证码已生成，请查看Vercel Function日志',
        hint: '在Vercel Dashboard的Functions页面查看此API的日志'
      });
    }

    if (action === 'verify_code') {
      const stored = verificationCodes.get('admin');
      
      if (!stored) {
        return res.status(400).json({ error: '请先请求验证码' });
      }
      
      if (Date.now() > stored.expires) {
        verificationCodes.delete('admin');
        return res.status(400).json({ error: '验证码已过期' });
      }
      
      if (code !== stored.code) {
        return res.status(400).json({ error: '验证码错误' });
      }
      
      // 验证成功，删除验证码
      verificationCodes.delete('admin');
      
      // 创建管理员用户
      const user: User = {
        id: 'admin',
        email: 'admin@weeklyreport.local',
        isAdmin: true
      };
      
      // 生成JWT token
      const token = generateToken(user);
      
      // 设置HttpOnly cookie
      res.setHeader('Set-Cookie', [
        `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
      ]);
      
      return res.status(200).json({ user });
    }
  }

  if (req.method === 'DELETE') {
    // 登出
    res.setHeader('Set-Cookie', [
      'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
    ]);
    
    return res.status(200).json({ message: '已登出' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}