const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export const sendMessageToAI = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'DeathChat AI'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      })
    })

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before sending another message.')
      }
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key.')
      }
      if (response.status === 402) {
        throw new Error('Insufficient credits. Please check your OpenRouter account.')
      }
      throw new Error(`API request failed with status ${response.status}. Please try again.`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'
  } catch (error) {
    console.error('Error calling OpenRouter API:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to get AI response. Please try again.')
  }
}
