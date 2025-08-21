// 添加用户名字段到现有用户表的脚本
const { sql } = require('@vercel/postgres');

async function addUsernameField() {
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
  } catch (error) {
    console.error('Error adding username field:', error);
  }
}

// 执行函数
addUsernameField();