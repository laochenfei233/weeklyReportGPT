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

// 替换或添加 JWT_SECRET
if (envContent.includes('JWT_SECRET=')) {
  envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${secret}`);
  console.log('✅ JWT_SECRET 已更新');
} else {
  envContent += `\n# Authentication Configuration\nJWT_SECRET=${secret}\n`;
  console.log('✅ JWT_SECRET 已添加');
}

fs.writeFileSync(envPath, envContent);

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
console.log('   点击设置按钮，在管理员板块获取验证码并登录');
console.log('');

console.log('');
console.log('🎉 设置完成！开始使用 Weekly Report GPT 吧！');