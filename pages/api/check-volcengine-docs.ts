import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const model = process.env.OPENAI_MODEL || '';
  const apiBase = process.env.OPENAI_API_BASE || '';

  // 分析Bot ID格式
  const botIdAnalysis = {
    provided: model,
    format: model.match(/^bot-\d{14}-[a-z0-9]{5}$/) ? 'Standard' : 'Non-standard',
    parts: {
      prefix: model.startsWith('bot-') ? 'bot-' : 'Missing bot- prefix',
      timestamp: model.match(/bot-(\d{14})-/)?.[1] || 'No timestamp found',
      suffix: model.match(/-([a-z0-9]{5})$/)?.[1] || 'No suffix found',
    },
    isValid: /^bot-\d{14}-[a-z0-9]{5}$/.test(model),
  };

  // 分析API Base URL
  const apiBaseAnalysis = {
    provided: apiBase,
    isVolcengine: apiBase.includes('volces.com'),
    region: apiBase.includes('cn-beijing') ? 'Beijing' : 'Unknown',
    hasBotsPath: apiBase.includes('/bots/'),
    endsWithSlash: apiBase.endsWith('/'),
    expectedFormat: 'https://ark.cn-beijing.volces.com/api/v3/bots/',
  };

  // 可能的问题和建议
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!botIdAnalysis.isValid) {
    issues.push('Bot ID format may be incorrect');
    suggestions.push('Verify Bot ID format: bot-YYYYMMDDHHMMSS-XXXXX');
  }

  if (!apiBaseAnalysis.isVolcengine) {
    issues.push('API Base URL does not appear to be Volcengine');
    suggestions.push('Use Volcengine API base: https://ark.cn-beijing.volces.com/api/v3/bots/');
  }

  if (!apiBaseAnalysis.hasBotsPath) {
    issues.push('API Base URL missing /bots/ path');
    suggestions.push('Add /bots/ to the API base URL');
  }

  // 构建期望的完整端点
  const expectedEndpoint = `https://ark.cn-beijing.volces.com/api/v3/bots/${model}/chat/completions`;

  return res.status(200).json({
    analysis: {
      botId: botIdAnalysis,
      apiBase: apiBaseAnalysis,
    },
    expectedEndpoint,
    issues,
    suggestions,
    documentation: {
      volcengineApiDocs: 'https://www.volcengine.com/docs/82379',
      botManagement: 'https://console.volcengine.com/ark/region:ark+cn-beijing/bot',
      commonFormats: [
        'https://ark.cn-beijing.volces.com/api/v3/bots/{bot_id}/chat/completions',
        'https://ark.ap-singapore-1.volces.com/api/v3/bots/{bot_id}/chat/completions',
      ],
    },
    troubleshooting: [
      'Check if the Bot exists in Volcengine console',
      'Verify API key has permission to access the Bot',
      'Ensure the Bot is in "Published" or "Active" status',
      'Check if you are using the correct region endpoint',
      'Verify the Bot ID is copied correctly from the console',
    ],
  });
}