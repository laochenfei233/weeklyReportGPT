import { sql } from '@vercel/postgres';
import { hashPassword } from './auth';

export interface User {
  id: string;
  email: string;
  username?: string;
  password_hash: string;
  is_admin: boolean;
  email_verified: boolean;
  daily_token_usage: number;
  last_usage_date: string;
  created_at: string;
  updated_at: string;
}

export interface EmailVerification {
  id: string;
  email: string;
  code: string;
  expires_at: string;
  created_at: string;
}

export interface TokenUsage {
  id: string;
  user_id: string;
  date: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  created_at: string;
}

// 初始化数据库表
export async function initDatabase() {
  try {
    // 创建用户表
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        daily_token_usage INTEGER DEFAULT 0,
        last_usage_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 创建邮箱验证表
    await sql`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 创建token使用记录表
    await sql`
      CREATE TABLE IF NOT EXISTS token_usage (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        date DATE DEFAULT CURRENT_DATE,
        input_tokens INTEGER DEFAULT 0,
        output_tokens INTEGER DEFAULT 0,
        total_tokens INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 创建索引
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_token_usage_user_date ON token_usage(user_id, date)`;

    // 创建默认管理员账户
    try {
      const adminEmail = 'admin@example.com';
      const adminUsername = 'admin';
      const adminPassword = 'admin123';
      
      // 检查是否已存在管理员账户
      const existingAdmin = await sql`
        SELECT * FROM users WHERE email = ${adminEmail} LIMIT 1
      `;
      
      if (existingAdmin.rows.length === 0) {
        // 创建管理员账户
        const passwordHash = await hashPassword(adminPassword);
        await sql`
          INSERT INTO users (email, username, password_hash, is_admin, email_verified)
          VALUES (${adminEmail}, ${adminUsername}, ${passwordHash}, true, true)
        `;
        console.log('Default admin user created successfully');
        console.log('Admin credentials: admin@example.com / admin123');
      } else {
        console.log('Admin user already exists');
      }
    } catch (adminError) {
      console.error('Admin user creation error:', adminError);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// 获取用户
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;
    return result.rows[0] as User || null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// 通过用户名获取用户
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE username = ${username} LIMIT 1
    `;
    return result.rows[0] as User || null;
  } catch (error) {
    console.error('Get user by username error:', error);
    return null;
  }
}

// 创建用户
export async function createUser(email: string, username: string, passwordHash: string): Promise<User | null> {
  try {
    const result = await sql`
      INSERT INTO users (email, username, password_hash)
      VALUES (${email}, ${username}, ${passwordHash})
      RETURNING *
    `;
    return result.rows[0] as User;
  } catch (error) {
    console.error('Create user error:', error);
    return null;
  }
}

// 获取用户今日token使用量
export async function getUserDailyTokenUsage(userId: string): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await sql`
      SELECT COALESCE(SUM(total_tokens), 0) as total
      FROM token_usage 
      WHERE user_id = ${userId} AND date = ${today}
    `;
    return parseInt(result.rows[0]?.total || '0');
  } catch (error) {
    console.error('Get daily token usage error:', error);
    return 0;
  }
}

// 记录token使用
export async function recordTokenUsage(
  userId: string, 
  inputTokens: number, 
  outputTokens: number
): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalTokens = inputTokens + outputTokens;

    await sql`
      INSERT INTO token_usage (user_id, date, input_tokens, output_tokens, total_tokens)
      VALUES (${userId}, ${today}, ${inputTokens}, ${outputTokens}, ${totalTokens})
    `;

    return true;
  } catch (error) {
    console.error('Record token usage error:', error);
    return false;
  }
}

// 检查用户是否超过每日限制
export async function checkDailyLimit(userId: string): Promise<{ allowed: boolean; usage: number; limit: number }> {
  const DAILY_LIMIT = 10000; // 1万token限制
  
  try {
    const usage = await getUserDailyTokenUsage(userId);
    return {
      allowed: usage < DAILY_LIMIT,
      usage,
      limit: DAILY_LIMIT
    };
  } catch (error) {
    console.error('Check daily limit error:', error);
    return { allowed: false, usage: 0, limit: DAILY_LIMIT };
  }
}

// 获取用户统计信息
export async function getUserStats(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 今日使用量
    const todayUsage = await getUserDailyTokenUsage(userId);
    
    // 总使用量
    const totalResult = await sql`
      SELECT COALESCE(SUM(total_tokens), 0) as total
      FROM token_usage 
      WHERE user_id = ${userId}
    `;
    
    // 最近7天使用量
    const weekResult = await sql`
      SELECT date, SUM(total_tokens) as daily_total
      FROM token_usage 
      WHERE user_id = ${userId} 
        AND date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date DESC
    `;

    return {
      todayUsage,
      totalUsage: parseInt(totalResult.rows[0]?.total || '0'),
      weeklyUsage: weekResult.rows,
      dailyLimit: 10000
    };
  } catch (error) {
    console.error('Get user stats error:', error);
    return {
      todayUsage: 0,
      totalUsage: 0,
      weeklyUsage: [],
      dailyLimit: 10000
    };
  }
}

// 生成验证码
export function generateVerificationCode(): string {
  return Math.random().toString().slice(2, 8).padStart(6, '0');
}

// 保存邮箱验证码
export async function saveEmailVerification(email: string, code: string): Promise<boolean> {
  try {
    // 删除旧的验证码
    await sql`DELETE FROM email_verifications WHERE email = ${email}`;
    
    // 设置过期时间（10分钟后）
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    await sql`
      INSERT INTO email_verifications (email, code, expires_at)
      VALUES (${email}, ${code}, ${expiresAt})
    `;
    
    return true;
  } catch (error) {
    console.error('Save email verification error:', error);
    return false;
  }
}

// 验证邮箱验证码
export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT * FROM email_verifications 
      WHERE email = ${email} AND code = ${code} AND expires_at > NOW()
      LIMIT 1
    `;
    
    if (result.rows.length > 0) {
      // 删除已使用的验证码
      await sql`DELETE FROM email_verifications WHERE email = ${email}`;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Verify email code error:', error);
    return false;
  }
}

// 标记邮箱为已验证
export async function markEmailAsVerified(email: string): Promise<boolean> {
  try {
    await sql`
      UPDATE users SET email_verified = true, updated_at = NOW()
      WHERE email = ${email}
    `;
    return true;
  } catch (error) {
    console.error('Mark email as verified error:', error);
    return false;
  }
}

// 通过用户名或邮箱获取用户
export async function getUserByEmailOrUsername(identifier: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE email = ${identifier.toLowerCase()} OR username = ${identifier}
      LIMIT 1
    `;
    return result.rows[0] as User || null;
  } catch (error) {
    console.error('Get user by email or username error:', error);
    return null;
  }
}