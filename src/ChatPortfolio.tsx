import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, Github, Linkedin, Download } from 'lucide-react';

const ChatPortfolio = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi! I'm your AI portfolio assistant. I can tell you about my skills, projects, experience, and more. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Backend API configuration
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  
  const suggestedQuestions = [
    "What are your technical skills?",
    "Show me your projects",
    "Tell me about your experience",
    "How can I contact you?",
    "Whare are your interests?"
  ];
  const [error, setError] = useState<null | string>(null);

  const getResponseFromBackend = async (userMessage: string) => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/query `, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: userMessage,
        }),
      });

      console.log("RESPONSE:",response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.answer || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (err) {
      console.error('Backend error:', err);
      setError('Unable to connect to the server. Please check your connection.');
      return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or check that the backend server is running.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    // Get response from backend
    setIsTyping(true);
    const response = await getResponseFromBackend(userMessage);
    setIsTyping(false);
    
    setMessages(prev => [...prev, {
      type: 'bot',
      content: response,
      timestamp: new Date()
    }]);
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} className="font-bold mt-3 mb-1">{line.slice(2, -2)}</div>;
      }
      if (line.startsWith('**')) {
        const parts = line.split('**');
        return (
          <div key={i} className="mt-2">
            <span className="font-bold">{parts[1]}</span>
            {parts[2]}
          </div>
        );
      }
      if (line.match(/^[🚀💼🌟📧💼🐙🏆⭐🎯📈✍️]/)) {
        return <div key={i} className="mt-3 mb-1">{line}</div>;
      }
      return line ? <div key={i}>{line}</div> : <div key={i} className="h-2"></div>;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg p-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Portfolio Assistant</h1>
            <p className="text-xs text-gray-500">Powered by AI • Always online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="https://github.com" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Github className="w-5 h-5 text-gray-600" />
          </a>
          <a href="https://linkedin.com" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Linkedin className="w-5 h-5 text-gray-600" />
          </a>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user' 
                ? 'bg-blue-600' 
                : 'bg-gradient-to-br from-purple-600 to-blue-500'
            }`}>
              {message.type === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'flex justify-end' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}>
                <div className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                  {formatMessage(message.content)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about my work, skills, or experience..."
                className="w-full bg-transparent outline-none resize-none text-sm"
                rows={1}
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Connected to backend API • Real-time responses
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPortfolio;
