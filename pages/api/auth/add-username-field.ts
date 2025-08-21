import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';

export default async function addUsernameField(req: NextApiRequest, res: NextApiResponse) {
  // 检查请求方法
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // 检查认证密钥
  const authKey = req.headers.authorization;
  const expectedKey = process.env.AUTH_KEY;
  
  if (!expectedKey) {
    return res.status(500).json({ error: '服务器配置错误' });
  }
  
  if (authKey !== `Bearer ${expectedKey}`) {
    return res.status(401).json({ error: '未授权' });
  }
  
  try {
    // 添加用户名字段到用户表（如果不存在）
    await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE
    `;
    
    // 为现有用户生成用户名（基于邮箱前缀）
    await sql`
      UPDATE users 
      SET username = SUBSTRING(email, 1, POSITION('@' IN email) - 1)
      WHERE username IS NULL
    `;
    
    // 创建索引以提高查询性能
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
    `;
    
    console.log('Username field added successfully');
    return res.status(200).json({ success: true, message: '用户名字段已成功添加' });
  } catch (error) {
    console.error('Error adding username field:', error);
    return res.status(500).json({ success: false, error: '添加用户名字段时发生错误' });
  }
}