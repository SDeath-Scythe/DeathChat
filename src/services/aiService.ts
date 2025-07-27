export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const sendMessageToAI = async (messages: ChatMessage[], model: string = 'qwen/qwen3-coder:free'): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, model })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API request failed.');
    }
    return data.result || 'Sorry, I couldn\'t generate a response.';
  } catch (error) {
    console.error('Error calling backend /api/chat:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get AI response. Please try again.');
  }
}
