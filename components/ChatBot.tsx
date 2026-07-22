
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { sendMessageStream } from '../services/geminiService';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hi! I'm Kgotso's AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    const initialAiMessage: Message = { id: aiMessageId, sender: 'ai', text: '' };
    setMessages(prev => [...prev, initialAiMessage]);

    try {
      let fullResponse = '';
      const stream = sendMessageStream(userMessage.text);
      
      for await (const chunk of stream) {
        if (chunk) {
          fullResponse += chunk;
          setMessages(prev => 
            prev.map(msg => msg.id === aiMessageId ? { ...msg, text: fullResponse } : msg)
          );
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => 
        prev.map(msg => msg.id === aiMessageId ? { ...msg, text: "I'm sorry, I'm having trouble thinking right now. Try again later." } : msg)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-zinc-800/40 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot size={20} className="text-indigo-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 border border-zinc-900" />
              </div>
              <div>
                <span className="font-bold text-sm text-zinc-100 block">Kgotso AI</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Ready to help</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 px-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-900/20' 
                    : 'bg-white/5 text-zinc-200 rounded-bl-none border border-white/5'
                }`}>
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-40 text-[10px] uppercase font-bold tracking-wider">
                    {msg.sender === 'user' ? <User size={10} /> : <Sparkles size={10} />}
                    <span>{msg.sender === 'user' ? 'You' : 'Assistant'}</span>
                  </div>
                  {msg.text || (msg.sender === 'ai' && isLoading && <div className="flex gap-1 py-1"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" /></div>)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-zinc-800/20 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 text-white placeholder-zinc-500 transition-all"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-zinc-900 animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default ChatBot;
