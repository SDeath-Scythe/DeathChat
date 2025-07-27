
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
    const { messages, model } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format.' });
    }

    // Set up streaming response headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();

    const modelToUse = typeof model === 'string' && model.length > 0 ? model : 'qwen/qwen3-coder:free';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers['origin'] || '', // Optional, for OpenRouter ranking
        'X-Title': 'DeathChat', // Optional, for OpenRouter ranking
      },
      body: JSON.stringify({
        model: modelToUse,
        messages,
      }),
    });

    if (!response.ok) {
      // Try to parse error message from OpenRouter
      let errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        errorText = errorJson.error || errorText;
      } catch {}
      res.write(`data: {\"error\":\"OpenRouter error: ${errorText.replace(/"/g, '')}\"}\n\n`);
      res.end();
      return;
    }

    if (!response.body) {
      res.write('data: {"error":"No response body from OpenRouter."}\n\n');
      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              // Only stream 'content' as per OpenRouter docs
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                res.write(`data: ${content}\n\n`);
                res.flush && res.flush();
              }
            } catch {
              // Not JSON, ignore
            }
          }
        }
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    res.write(`data: {\"error\":\"${error.message || 'Internal server error'}\"}\n\n`);
    res.end();
  }
}
