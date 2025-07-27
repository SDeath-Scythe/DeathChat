const API_URL = '/api/chat'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Streaming version: returns an async generator yielding text chunks
export async function* sendMessageToAIStream(messages: ChatMessage[]): AsyncGenerator<string, void, unknown> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages })
  });
  if (!response.body) {
    throw new Error('No response body');
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
      let lines = buffer.split('\n\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          yield data;
        }
      }
    }
  }
}
