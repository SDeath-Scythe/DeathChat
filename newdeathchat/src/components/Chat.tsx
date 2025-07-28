import React, { useState, useRef, useEffect } from 'react'
import { sendMessageToAI, ChatMessage } from '../services/aiService'
import './Chat.module.css'

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatbot-conversations')
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations)
      const conversationsWithDates = parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setConversations(conversationsWithDates)
      if (conversationsWithDates.length > 0) {
        setCurrentConversationId(conversationsWithDates[0].id)
      }
    } else {
      // Create initial conversation
      createNewConversation()
    }
  }, [])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chatbot-conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        id: 1,
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
  }

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId))
    if (currentConversationId === conversationId) {
      const remaining = conversations.filter(conv => conv.id !== conversationId)
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id)
      } else {
        createNewConversation()
      }
    }
  }

  const updateConversationTitle = (conversationId: string, firstMessage: string) => {
    const title = firstMessage.length > 30 ? firstMessage.substring(0, 30) + '...' : firstMessage
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, title, updatedAt: new Date() }
        : conv
    ))
  }

  const currentConversation = conversations.find(conv => conv.id === currentConversationId)
  const messages = currentConversation?.messages || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // Only auto-scroll to bottom if there are messages and user has sent at least one message
    if (messages.length > 1) {
      scrollToBottom()
    }
  }, [messages])

  // Ensure page starts at top on initial load
  useEffect(() => {
    window.scrollTo(0, 0)
    // Also ensure the main container scrolls to top
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentConversationId) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    }

    // Update conversation with user message
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            updatedAt: new Date()
          }
        : conv
    ))

    // Update title if this is the first user message
    const currentConv = conversations.find(conv => conv.id === currentConversationId)
    if (currentConv && currentConv.messages.length === 1) {
      updateConversationTitle(currentConversationId, inputValue)
    }

    setInputValue('')
    setIsTyping(true)
    setError(null)

    try {
      // Convert messages to API format
      const chatMessages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful and friendly AI assistant.' },
        ...messages.map(msg => ({
          role: msg.isBot ? 'assistant' as const : 'user' as const,
          content: msg.text
        })),
        { role: 'user', content: inputValue }
      ];

      const aiResponse = await sendMessageToAI(chatMessages, 'qwen/qwen3-coder:free');

      const botMessage: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      };

      // Update conversation with bot message
      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage, botMessage],
              updatedAt: new Date()
            }
          : conv
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);

      const errorBotMessage: Message = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${errorMessage}`,
        isBot: true,
        timestamp: new Date()
      };

      // Update conversation with error message
      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage, errorBotMessage],
              updatedAt: new Date()
            }
          : conv
      ));
    } finally {
      setIsTyping(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Only send if not typing and input is not empty
      if (!isTyping && inputValue.trim()) {
        handleSendMessage()
      }
    }
    // Allow all other keys to pass through without any restrictions
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const renderFormattedText = (text: string) => {
    // Split text into parts: code blocks, inline code, and regular text
    const parts = text.split(/```([\s\S]*?)```|`([^`]+)`/g)
    
    return parts.map((part, index) => {
      // Code blocks (multiline)
      if (index % 3 === 1 && part) {
        const lines = part.trim().split('\n')
        const language = lines[0].trim()
        const code = lines.slice(language && !language.includes(' ') ? 1 : 0).join('\n')
        
        return (
          <div key={index} className="my-4 bg-gray-800/50 border border-gray-600/50 rounded-lg overflow-hidden group">
            <div className="bg-gray-700/70 px-4 py-2 flex items-center justify-between border-b border-gray-600/50">
              <span className="text-xs text-gray-300 font-medium">
                {language && !language.includes(' ') ? language : 'code'}
              </span>
              <button
                onClick={() => copyToClipboard(code)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all duration-200 p-1 rounded hover:bg-gray-600/50"
                title="Copy code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <pre className="p-4 text-sm text-gray-200 overflow-x-auto leading-relaxed">
                <code className="language-{language}">{code}</code>
              </pre>
            </div>
          </div>
        )
      }
      
      // Inline code
      if (index % 3 === 2 && part) {
        return (
          <code key={index} className="bg-gray-700/70 text-orange-300 px-2 py-1 rounded text-sm font-mono border border-gray-600/30">
            {part}
          </code>
        )
      }
      
      // Regular text with enhanced formatting
      if (part) {
        const formattedText = part
          .split('\n')
          .map((line, lineIndex) => {
            // Section headers with diamond bullet
            if (line.trim().match(/^[♦◆▪️]\s+/)) {
              return (
                <div key={lineIndex} className="flex items-start my-3">
                  <span className="text-blue-400 mr-3 mt-1 text-sm">♦</span>
                  <div className="font-semibold text-blue-200">{line.trim().substring(2)}</div>
                </div>
              )
            }

            // Bullet points with better styling
            if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
              return (
                <div key={lineIndex} className="flex items-start my-2 ml-4">
                  <span className="text-blue-400 mr-3 mt-1.5 text-xs">●</span>
                  <div className="text-gray-200 leading-relaxed">{line.trim().substring(2)}</div>
                </div>
              )
            }
            
            // Numbered lists with enhanced styling
            const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)/)
            if (numberedMatch) {
              return (
                <div key={lineIndex} className="flex items-start my-2 ml-4">
                  <span className="text-blue-400 mr-3 mt-0.5 font-semibold text-sm min-w-[20px]">{numberedMatch[1]}.</span>
                  <div className="text-gray-200 leading-relaxed">{numberedMatch[2]}</div>
                </div>
              )
            }
            
            // Main headers
            if (line.trim().startsWith('# ')) {
              return (
                <h3 key={lineIndex} className="text-xl font-bold mt-6 mb-3 text-blue-300 border-b border-gray-600/50 pb-2">
                  {line.trim().substring(2)}
                </h3>
              )
            }
            
            // Sub headers
            if (line.trim().startsWith('## ')) {
              return (
                <h4 key={lineIndex} className="text-lg font-semibold mt-4 mb-2 text-blue-300">
                  {line.trim().substring(3)}
                </h4>
              )
            }

            // Sub-sub headers
            if (line.trim().startsWith('### ')) {
              return (
                <h5 key={lineIndex} className="text-base font-medium mt-3 mb-2 text-blue-300">
                  {line.trim().substring(4)}
                </h5>
              )
            }
            
            // Bold and italic text with better regex
            let processedLine = line
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
            
            // Regular paragraphs
            if (line.trim()) {
              return (
                <div key={lineIndex} className="my-1 text-gray-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />
              )
            }
            
            // Empty lines for spacing
            return <div key={lineIndex} className="h-2" />
          })
        
        return <div key={index} className="space-y-1">{formattedText}</div>
      }
      
      return null
    })
  }

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Project Title - Center Top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          DeathChat
        </h1>
      </div>

      {/* Top Portfolio Button */}
      <div className="absolute top-4 right-4 z-50">
        <a
          href="https://sdeath-scythe.github.io/3d-portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-gray-800/90 via-gray-700/90 to-gray-800/90 hover:from-blue-600/20 hover:via-purple-600/20 hover:to-pink-600/20 backdrop-blur-xl border border-gray-600/30 hover:border-blue-500/30 text-gray-200 hover:text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 hover:scale-105 group shadow-lg hover:shadow-xl"
        >
          <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0H8m0 0v5.586a1 1 0 00.293.707L12 15l3.707-2.707a1 1 0 00.293-.707V6z" />
          </svg>
          <span>More from this creator</span>
          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Sidebar - Full Height */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 h-screen backdrop-blur-xl shadow-2xl`}>
        <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
          <button
            onClick={createNewConversation}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white p-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.02] group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 m-2 rounded-xl cursor-pointer transition-all duration-300 group hover:scale-[1.02] ${
                currentConversationId === conversation.id
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg'
                  : 'bg-gray-800/50 hover:bg-gradient-to-r hover:from-gray-700/60 hover:to-gray-600/60 border border-transparent hover:border-gray-600/30 backdrop-blur-sm'
              }`}
              onClick={() => setCurrentConversationId(conversation.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-100 truncate group-hover:text-white transition-colors duration-300">
                    {conversation.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-300">
                    {conversation.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(conversation.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-2 transition-all duration-300 rounded-lg hover:bg-red-500/10 hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center items-center p-6">
        {/* Chat Box - Centered */}
        <div className="bg-gradient-to-br from-gray-800/90 via-gray-700/90 to-gray-800/90 border border-gray-600/30 rounded-2xl shadow-2xl backdrop-blur-xl w-full max-w-5xl h-[580px] flex flex-col overflow-hidden ring-1 ring-white/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
            <div className="flex items-center relative z-10">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-all duration-300 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="w-3 h-3 bg-green-400 rounded-full mr-4 animate-pulse shadow-lg shadow-green-400/50"></div>
              <div>
                <h3 className="font-bold text-xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">AI Assistant</h3>
                <p className="text-sm opacity-90 text-gray-100">Online • Powered by Qwen Coder</p>
              </div>
            </div>
          </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-gradient-to-r from-red-900/90 to-red-800/90 border border-red-700/50 text-red-100 px-5 py-4 text-sm backdrop-blur-sm">
          <strong className="font-semibold">Error:</strong> {error}
          <button 
            onClick={() => setError(null)}
            className="float-right text-red-200 hover:text-white transition-colors duration-300 hover:scale-110 p-1 rounded"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-900/50 to-gray-800/50 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} group animate-fade-in`}
          >
            <div className={`max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl px-5 py-4 rounded-2xl relative transition-all duration-300 hover:scale-[1.01] ${
              message.isBot
                ? 'bg-gradient-to-br from-gray-700/95 via-gray-600/95 to-gray-700/95 text-gray-100 shadow-xl border border-gray-500/30 backdrop-blur-sm'
                : 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl ring-1 ring-white/20'
            }`}>
              {message.isBot && (
                <button
                  onClick={() => copyToClipboard(message.text)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-gray-600/50 hover:scale-110"
                  title="Copy message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              )}
              <div className="text-sm whitespace-pre-wrap font-sans break-words overflow-x-auto pr-10 leading-relaxed">
                {renderFormattedText(message.text)}
              </div>
              <p className={`text-xs mt-4 font-medium ${
                message.isBot ? 'text-gray-400' : 'text-blue-100'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gradient-to-br from-gray-700/95 via-gray-600/95 to-gray-700/95 text-gray-100 shadow-xl border border-gray-500/30 backdrop-blur-sm px-5 py-4 rounded-2xl max-w-xs">
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce shadow-lg shadow-blue-400/50"></div>
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-600/30 bg-gradient-to-r from-gray-800/90 via-gray-700/90 to-gray-800/90 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-4 bg-gradient-to-r from-gray-700/90 to-gray-600/90 border border-gray-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-400 text-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
            placeholder="Type your message..."
            autoComplete="off"
            spellCheck="true"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:via-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Chat
