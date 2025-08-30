#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Weekly Report GPT 快速设置');
console.log('===============================');
console.log('');

// 检查 .env 文件
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 复制 .env.example 到 .env...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env 文件已创建');
  } else {
    console.log('❌ 未找到 .env.example 文件');
    process.exit(1);
  }
} else {
  console.log('✅ .env 文件已存在');
}

// 生成 JWT_SECRET
console.log('');
console.log('🔐 生成 JWT_SECRET...');
const secret = crypto.randomBytes(64).toString('hex');

// 读取 .env 文件内容
let envContent = fs.readFileSync(envPath, 'utf8');

// 替换 JWT_SECRET
if (envContent.includes('JWT_SECRET=your-jwt-secret-key-change-in-production')) {
  envContent = envContent.replace(
    'JWT_SECRET=your-jwt-secret-key-change-in-production',
    `JWT_SECRET=${secret}`
  );
  fs.writeFileSync(envPath, envContent);
  console.log('✅ JWT_SECRET 已自动配置');
} else if (envContent.includes('JWT_SECRET=')) {
  console.log('⚠️  JWT_SECRET 已存在，跳过自动配置');
} else {
  // 如果没有 JWT_SECRET 行，添加它
  envContent += `\n# Authentication Configuration\nJWT_SECRET=${secret}\n`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ JWT_SECRET 已添加到 .env 文件');
}

console.log('');
console.log('📝 接下来的步骤:');
console.log('');
console.log('1️⃣  配置 API 密钥:');
console.log('   编辑 .env 文件，设置你的 OPENAI_API_KEY');
console.log('');
console.log('2️⃣  启动开发服务器:');
console.log('   npm run dev');
console.log('');
console.log('3️⃣  访问应用:');
console.log('   http://localhost:3000');
console.log('');
console.log('4️⃣  管理员登录:');
console.log('   点击"管理"按钮，使用验证码登录');
console.log('');
console.log('🎉 设置完成！开始使用 Weekly Report GPT 吧！');