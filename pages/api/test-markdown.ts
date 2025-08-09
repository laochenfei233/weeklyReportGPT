import { NextApiRequest, NextApiResponse } from 'next';
import { marked } from 'marked';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('Input text:', text);

    // 配置marked选项
    const markedOptions = {
      gfm: true,
      breaks: true,
      sanitize: false,
      smartLists: true,
      smartypants: false
    };

    // 测试不同的渲染方法
    let result1, result2, result3;

    try {
      result1 = await marked(text, markedOptions);
    } catch (e) {
      result1 = `Error with marked(): ${e}`;
    }

    try {
      result2 = marked.parse(text, markedOptions);
    } catch (e) {
      result2 = `Error with marked.parse(): ${e}`;
    }

    try {
      result3 = marked(text);
    } catch (e) {
      result3 = `Error with simple marked(): ${e}`;
    }

    return res.status(200).json({
      input: text,
      results: {
        'marked(text, options)': result1,
        'marked.parse(text, options)': result2,
        'marked(text)': result3,
      },
      types: {
        result1: typeof result1,
        result2: typeof result2,
        result3: typeof result3,
      }
    });

  } catch (error) {
    console.error('Markdown test error:', error);
    
    return res.status(500).json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}