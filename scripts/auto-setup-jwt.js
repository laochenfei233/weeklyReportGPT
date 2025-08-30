#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * 自动设置JWT密钥
 * 在构建时或首次运行时自动生成JWT密钥
 */
function autoSetupJWT() {
  console.log('🔐 检查JWT密钥配置...');

  // 检查是否已经有JWT_SECRET环境变量
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== 'your-secret-key-change-in-production') {
    console.log('✅ JWT_SECRET已配置');
    return process.env.JWT_SECRET;
  }

  // 生成新的JWT密钥
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  console.log('🎲 生成新的JWT密钥');

  // 在Vercel环境中，我们只能输出密钥供用户手动配置
  if (process.env.VERCEL) {
    console.log('📋 Vercel部署检测到，请手动配置以下环境变量：');
    console.log('   变量名: JWT_SECRET');
    console.log('   变量值:', jwtSecret);
    console.log('   配置路径: Vercel Dashboard → Settings → Environment Variables');
    return jwtSecret;
  }

  // 本地环境：尝试写入.env文件
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';

  // 读取现有的.env文件
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // 检查是否已经有JWT_SECRET配置
  if (envContent.includes('JWT_SECRET=')) {
    // 替换现有的JWT_SECRET
    envContent = envContent.replace(
      /JWT_SECRET=.*/,
      `JWT_SECRET=${jwtSecret}`
    );
  } else {
    // 添加新的JWT_SECRET
    envContent += `\n# 自动生成的JWT密钥\nJWT_SECRET=${jwtSecret}\n`;
  }

  // 写入.env文件
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ JWT密钥已写入.env文件');
  } catch (error) {
    console.error('❌ 写入.env文件失败:', error.message);
    console.log('📋 请手动添加以下环境变量到.env文件：');
    console.log(`JWT_SECRET=${jwtSecret}`);
  }

  return jwtSecret;
}

// 如果直接运行此脚本
if (require.main === module) {
  autoSetupJWT();
}

module.exports = { autoSetupJWT };