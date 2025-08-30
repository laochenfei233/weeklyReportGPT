/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },

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
