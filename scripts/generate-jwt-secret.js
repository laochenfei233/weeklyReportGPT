#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 JWT_SECRET 生成器');
console.log('====================');
console.log('');

// 生成64字节的随机密钥
const secret = crypto.randomBytes(64).toString('hex');

console.log('✅ 已生成安全的 JWT_SECRET:');
console.log('');
console.log('┌─────────────────────────────────────────────────────────────────┐');
console.log('│ ' + secret.substring(0, 64) + ' │');
console.log('│ ' + secret.substring(64) + ' │');
console.log('└─────────────────────────────────────────────────────────────────┘');
console.log('');

console.log('📋 配置步骤:');
console.log('');
console.log('1️⃣  本地开发环境:');
console.log('   在 .env 文件中替换:');
console.log('   JWT_SECRET=' + secret);
console.log('');
console.log('2️⃣  Vercel 部署环境:');
console.log('   • 进入 Vercel Dashboard');
console.log('   • 选择项目 → Settings → Environment Variables');
console.log('   • 添加变量: JWT_SECRET');
console.log('   • 值: ' + secret);
console.log('');
console.log('3️⃣  其他部署平台:');
console.log('   在相应平台的环境变量设置中添加此密钥');
console.log('');

// 检查是否存在 .env 文件
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('💡 提示: 检测到 .env 文件存在');
  console.log('   你可以手动编辑 .env 文件，或者运行以下命令自动替换:');
  console.log('   (请先备份你的 .env 文件)');
  console.log('');
}

console.log('⚠️  安全提醒:');
console.log('   • 请妥善保管此密钥，不要泄露给他人');
console.log('   • 不要将包含真实密钥的 .env 文件提交到 Git');
console.log('   • 生产环境必须使用此类强随机密钥');
console.log('');
console.log('🎉 配置完成后，你就可以使用管理员验证码登录功能了！');