#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔐 检查JWT密钥配置...');

// 检查环境变量
if (process.env.JWT_SECRET) {
  console.log('✅ JWT_SECRET 已在环境变量中配置');
  process.exit(0);
}

// 检查 .env 文件
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('JWT_SECRET=') && !envContent.includes('JWT_SECRET=your-jwt-secret-key')) {
    console.log('✅ JWT_SECRET 已在 .env 文件中配置');
    process.exit(0);
  }
}

// 生成新的JWT密钥
console.log('🔑 生成新的JWT密钥...');
const secret = crypto.randomBytes(64).toString('hex');

// 更新或创建 .env 文件
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

if (envContent.includes('JWT_SECRET=')) {
  // 替换现有的JWT_SECRET
  envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${secret}`);
} else {
  // 添加新的JWT_SECRET
  envContent += `\n# Authentication Configuration\nJWT_SECRET=${secret}\n`;
}

fs.writeFileSync(envPath, envContent);
console.log('✅ JWT_SECRET 已自动生成并保存到 .env 文件');
console.log('🎉 JWT配置完成！');