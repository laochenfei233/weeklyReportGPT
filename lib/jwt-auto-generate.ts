/**
 * 自动生成JWT密钥
 * 如果环境变量中没有JWT_SECRET，则生成一个随机密钥
 */
export function getOrGenerateJWTSecret(): string {
  // 如果已经有JWT_SECRET环境变量，直接使用
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== 'your-secret-key-change-in-production') {
    return process.env.JWT_SECRET;
  }

  // 只在服务器端生成密钥
  if (typeof window === 'undefined') {
    const crypto = require('crypto');
    const generatedSecret = crypto.randomBytes(64).toString('hex');
    
    // 在开发环境中，我们可以动态设置环境变量
    if (process.env.NODE_ENV !== 'production') {
      process.env.JWT_SECRET = generatedSecret;
      console.log('🔐 自动生成JWT密钥（开发环境）');
    } else {
      // 生产环境中，记录警告但仍然使用生成的密钥
      console.warn('⚠️  警告：生产环境中使用自动生成的JWT密钥');
      console.warn('   建议在Vercel Dashboard中设置JWT_SECRET环境变量');
      console.warn('   生成的密钥:', generatedSecret);
    }
    
    return generatedSecret;
  }
  
  // 客户端或无法生成密钥时的fallback
  return 'fallback-jwt-secret-please-configure-properly';
}

/**
 * 获取JWT密钥，确保总是有一个可用的密钥
 */
export function getJWTSecret(): string {
  return getOrGenerateJWTSecret();
}