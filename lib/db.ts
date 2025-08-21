import { sql } from '@vercel/postgres';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  is_admin: boolean;
  daily_token_usage: number;
  last_usage_date: string;
  created_at: string;
  updated_at: string;
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
        password_hash VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        daily_token_usage INTEGER DEFAULT 0,
        last_usage_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    await sql`CREATE INDEX IF NOT EXISTS idx_token_usage_user_date ON token_usage(user_id, date)`;

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

// 创建用户
export async function createUser(email: string, passwordHash: string): Promise<User | null> {
  try {
    const result = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${passwordHash})
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