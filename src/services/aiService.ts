const API_URL = '/api/chat'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export const sendMessageToAI = async (messages: ChatMessage[]): Promise<string> => {


  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `API request failed with status ${response.status}. Please try again.`);
    }
    return data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
  } catch (error) {
    console.error('Error calling serverless API:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get AI response. Please try again.');
  }
}
