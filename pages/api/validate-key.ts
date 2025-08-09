import { NextApiRequest, NextApiResponse } from 'next';
import { getAPIKeyInfo } from '../../utils/apiConfig';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY || '';
    const baseURL = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    
    if (!apiKey) {
      return res.status(400).json({
        error: 'No API key configured',
        details: 'OPENAI_API_KEY environment variable is missing'
      });
    }

    const keyInfo = getAPIKeyInfo(apiKey, baseURL);
    const cleanKey = apiKey.trim();
    
    // Mask the API key for security
    const maskedKey = cleanKey.length > 8 
      ? `${cleanKey.substring(0, 8)}...${cleanKey.substring(cleanKey.length - 4)}`
      : '***masked***';

    return res.status(200).json({
      validation: {
        isValid: keyInfo.isValid,
        provider: keyInfo.provider,
        expectedFormat: keyInfo.format,
      },
      keyInfo: {
        maskedKey,
        length: cleanKey.length,
        startsWithSk: cleanKey.startsWith('sk-'),
        hasWhitespace: apiKey !== cleanKey,
        originalLength: apiKey.length,
      },
      config: {
        baseURL,
        detectedProvider: keyInfo.provider,
      },
      recommendations: keyInfo.isValid ? [] : [
        'Check if the API key is copied correctly',
        'Ensure there are no extra spaces or newlines',
        'Verify the key format matches the API provider',
        'Test the key with the API provider directly'
      ]
    });

  } catch (error) {
    console.error('Key validation error:', error);
    
    return res.status(500).json({
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}