import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint requires POST method',
      allowedMethods: ['POST'],
      usage: 'Use POST request or visit /debug page for testing'
    });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

    if (!apiKey) {
      return res.status(400).json({ 
        error: 'API key not configured',
        details: 'OPENAI_API_KEY environment variable is missing'
      });
    }

    // Import adapter
    const { getAPIAdapter } = require('../../utils/apiAdapters');
    const adapter = getAPIAdapter(apiBase);
    
    const endpoint = adapter.transformEndpoint(apiBase, model);
    const headers = adapter.transformHeaders(apiKey);
    
    console.log(`Testing API: ${endpoint} with model: ${model} using ${adapter.name} adapter`);

    const testPayload = {
      model,
      messages: [
        { role: 'user', content: '测试消息，请回复"测试成功"' }
      ],
      max_tokens: 50,
      temperature: 0.1,
      stream: false
    };

    const transformedPayload = adapter.transformPayload(testPayload);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(transformedPayload),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`API Test Failed: ${response.status} ${response.statusText}`, responseText);
      
      let errorMessage = `API test failed: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(responseText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }

      return res.status(response.status).json({
        success: false,
        error: errorMessage,
        details: {
          status: response.status,
          statusText: response.statusText,
          endpoint,
          model,
          response: responseText
        }
      });
    }

    const result = JSON.parse(responseText);
    
    return res.status(200).json({
      success: true,
      message: 'API test successful',
      data: {
        endpoint,
        model,
        response: result.choices?.[0]?.message?.content || 'No content returned',
        usage: result.usage
      }
    });

  } catch (error) {
    console.error('Test API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}