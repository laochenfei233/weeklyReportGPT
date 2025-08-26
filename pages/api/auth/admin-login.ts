import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken } from '../../../lib/auth';

// 简单的内存存储验证码（生产环境建议使用Redis或数据库）
const verificationCodes = new Map<string, { code: string; expires: number }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { action, code } = req.body;

    if (action === 'generate') {
      return handleGenerateCode(req, res);
    } else if (action === 'verify') {
      return handleVerifyCode(req, res, code);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// 生成验证码
async function handleGenerateCode(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 生成6位随机验证码
    const code = Math.random().toString().slice(2, 8).padStart(6, '0');
    const expires = Date.now() + 10 * 60 * 1000; // 10分钟过期
    
    // 存储验证码
    verificationCodes.set('admin', { code, expires });
    
    // 在服务器日志中输出验证码
    console.log('============================================================');
    console.log('🔐 管理员验证码 - ADMIN VERIFICATION CODE');
    console.log('============================================================');
    console.log(`🔢 验证码: ${code}`);
    console.log(`⏰ 生成时间: ${new Date().toLocaleString('zh-CN')}`);
    console.log(`⏳ 有效期: 10分钟`);
    console.log('🔍 请在服务器日志中查看此验证码');
    console.log('============================================================');
    
    return res.status(200).json({ 
      success: true, 
      message: '验证码已生成，请查看服务器日志' 
    });
  } catch (error) {
    console.error('Generate code error:', error);
    return res.status(500).json({ error: '生成验证码失败' });
  }
}

// 验证验证码并登录
async function handleVerifyCode(req: NextApiRequest, res: NextApiResponse, code: string) {
  try {
    if (!code) {
      return res.status(400).json({ error: '请输入验证码' });
    }

    const stored = verificationCodes.get('admin');
    
    if (!stored) {
      return res.status(400).json({ error: '请先生成验证码' });
    }

    if (Date.now() > stored.expires) {
      verificationCodes.delete('admin');
      return res.status(400).json({ error: '验证码已过期，请重新生成' });
    }

    if (stored.code !== code) {
      return res.status(400).json({ error: '验证码错误' });
    }

    // 验证成功，删除验证码
    verificationCodes.delete('admin');

    // 生成管理员token
    const token = generateToken({
      id: 'admin',
      email: 'admin@system.local',
      isAdmin: true
    });

    // 设置cookie - 使用环境变量配置的会话持续时间，默认14天
    const sessionDurationDays = parseInt(process.env.SESSION_DURATION_DAYS || '14');
    const maxAge = sessionDurationDays * 24 * 60 * 60; // 转换为秒
    
    res.setHeader('Set-Cookie', [
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    ]);

    console.log('✅ 管理员登录成功');

    return res.status(200).json({
      success: true,
      message: '登录成功',
      user: {
        id: 'admin',
        email: 'admin@system.local',
        username: 'admin',
        isAdmin: true
      },
      token
    });

  } catch (error) {
    console.error('Verify code error:', error);
    return res.status(500).json({ error: '验证失败' });
  }
}