import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE || '';
    const model = process.env.OPENAI_MODEL || '';

    if (!apiKey) {
      return res.status(400).json({ 
        error: 'API key not configured',
        details: 'OPENAI_API_KEY environment variable is missing'
      });
    }

    // 尝试不同的端点格式
    const endpointVariations = [
      // 标准格式
      `${apiBase.replace(/\/$/, '')}/${model}/chat/completions`,
      // 不带chat/completions
      `${apiBase.replace(/\/$/, '')}/${model}`,
      // 直接使用model作为完整路径
      `https://ark.cn-beijing.volces.com/api/v3/${model}/chat/completions`,
      // 可能的其他格式
      `https://ark.cn-beijing.volces.com/api/v3/chat/completions`,
      // 检查是否需要不同的路径
      `${apiBase.replace(/\/bots\/$/, '')}/chat/completions`,
    ];

    const results = [];

    for (const endpoint of endpointVariations) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        
        const testPayload = {
          messages: [
            { role: 'user', content: '你好' }
          ],
          max_tokens: 10,
          temperature: 0.1,
          stream: false
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'User-Agent': 'Weekly-Report-Debug/1.0.0',
          },
          body: JSON.stringify(testPayload),
        });

        const responseText = await response.text();
        
        results.push({
          endpoint,
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          response: responseText.substring(0, 500), // 限制响应长度
          headers: Object.fromEntries(response.headers.entries()),
        });

        // 如果找到成功的端点，提前返回
        if (response.ok) {
          break;
        }

      } catch (error) {
        results.push({
          endpoint,
          status: 0,
          statusText: 'Network Error',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // 分析结果
    const successfulEndpoint = results.find(r => r.success);
    const analysis = {
      totalTested: results.length,
      successfulEndpoint: successfulEndpoint?.endpoint || null,
      commonErrors: results.reduce((acc, r) => {
        if (!r.success) {
          acc[r.status] = (acc[r.status] || 0) + 1;
        }
        return acc;
      }, {} as Record<number, number>),
    };

    return res.status(200).json({
      config: {
        apiBase,
        model,
        maskedApiKey: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'Not set',
      },
      results,
      analysis,
      recommendations: successfulEndpoint 
        ? [`Use endpoint: ${successfulEndpoint.endpoint}`]
        : [
            'Check if the Bot ID is correct',
            'Verify API key has access to this Bot',
            'Confirm the Bot is active in Volcengine console',
            'Check if the API base URL is correct for your region',
            'Try accessing Volcengine console to verify Bot status'
          ]
    });

  } catch (error) {
    console.error('Volcengine debug error:', error);
    
    return res.status(500).json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}