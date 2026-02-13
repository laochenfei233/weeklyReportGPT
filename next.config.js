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
  
  serverExternalPackages: [],
  env: {
    OPENAI_API_BASE: process.env.OPENAI_API_BASE,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
    MAX_TOKENS: process.env.MAX_TOKENS,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
