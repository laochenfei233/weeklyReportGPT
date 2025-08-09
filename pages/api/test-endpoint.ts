import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    
    // Import adapter
    const { getAPIAdapter } = require('../../utils/apiAdapters');
    const adapter = getAPIAdapter(apiBase);
    
    const endpoint = adapter.transformEndpoint(apiBase, model);
    
    // Test payload transformation
    const testPayload = {
      model,
      messages: [{ role: 'user', content: 'test' }],
      temperature: 0.7,
      max_tokens: 100,
      stream: false
    };
    
    const transformedPayload = adapter.transformPayload(testPayload);
    
    return res.status(200).json({
      config: {
        apiBase,
        model,
        adapter: adapter.name,
      },
      endpoint: {
        original: `${apiBase}/chat/completions`,
        transformed: endpoint,
        isCorrect: !endpoint.includes('//') && endpoint.includes(model),
      },
      payload: {
        original: testPayload,
        transformed: transformedPayload,
        modelRemoved: !transformedPayload.hasOwnProperty('model'),
      },
      analysis: {
        hasDoubleSlash: endpoint.includes('//'),
        containsModel: endpoint.includes(model),
        endpointLength: endpoint.length,
        expectedPattern: apiBase.includes('volces.com') 
          ? `${apiBase}${model}/chat/completions`
          : `${apiBase}/chat/completions`
      }
    });

  } catch (error) {
    console.error('Endpoint test error:', error);
    
    return res.status(500).json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}