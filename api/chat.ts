
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format.' });
    }

    // Set up streaming response headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers['origin'] || '',
        'X-Title': 'DeathChat',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.body) {
      return res.status(500).json({ error: 'No response body from OpenRouter.' });
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        // Forward as SSE
        res.write(`data: ${chunk}\n\n`);
        res.flush && res.flush();
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    res.write(`data: {\"error\":\"${error.message || 'Internal server error'}\"}\n\n`);
    res.end();
  }
}
