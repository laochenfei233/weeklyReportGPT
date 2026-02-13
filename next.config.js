/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 静态导出配置（用于GitHub Pages和Cloudflare Pages）
  output: 'export',
  images: {
    unoptimized: true,
  },

  // 禁用不需要的Next.js功能以支持静态导出
  trailingSlash: true,
  
  skipTrailingSlashRedirect: true,
  
  serverExternalPackages: [],
  env: {
    OPENAI_API_BASE: process.env.OPENAI_API_BASE,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
    MAX_TOKENS: process.env.MAX_TOKENS,
  },
};

module.exports = nextConfig;
