import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { Message, User } from '../types';
import { motion } from 'motion/react';

interface AiTaxAssistantProps {
  user: User;
  onUpgrade: () => void;
}

export default function AiTaxAssistant({ user, onUpgrade }: AiTaxAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Habari! I am your Business Logic AI Bookkeeping Assistant. I specialize in Kenyan corporate bookkeeping, payroll summary calculations (PAYE, SHA, NSSF, Housing Levy), and general ledger / accounting requirements. 

How can I help you support your business bookkeeping goals today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "How is the PAYE calculated for KSh 70,500 salary?",
    "What is the due date for monthly VAT submissions?",
    "How do I organize receipts for bookkeeping?",
    "Describe SHA statutory payroll deductions.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Premium Check: Allow first 3 messages for trial, then require Premium limit
    if (!user.isPremium && messages.filter(m => m.sender === 'user').length >= 3) {
      setMessages(prev => [
        ...prev,
        {
          id: 'system-limit-warn-' + Date.now(),
          sender: 'assistant',
          content: `⚠️ **AI Consultation Limit Reached**
You have reached the free tier limit of 3 AI queries. Business Logic's comprehensive AI model handles advanced audits, calculations, and tax advisory instantly in our Premium Plan.

Upgrade your plan to the **AI Enabled Premium Plan** today for only **KSh 10,000/month** to resume unlimited tax consulting.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      return;
    }

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          userContext: {
            name: user.name,
            companyName: user.companyName,
            employeeCount: user.employeeCount,
            isPremium: user.isPremium
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: 'msg-reply-' + Date.now(),
        sender: 'assistant',
        content: data.reply || "Pardon, I encountered a temporary connection issue. Please try submitting again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          sender: 'assistant',
          content: "Oops! We encountered an error while consulting with the AI engine. Please ensure your network is running or try re-sending.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl justify-between" id="ai-tax-assistant-root">
      
      {/* Header */}
      <div className="bg-slate-950/80 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl text-white">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base flex items-center">
              AI Accounting Assistant
              <span className="ml-2 text-[10px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 font-mono rounded-full border border-cyan-500/20 uppercase tracking-wider">
                MVP
              </span>
            </h3>
            <p className="text-xs text-slate-400">Powered by Gemini 3.5 Flash &middot; Accounting Expert</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {user.isPremium ? (
            <span className="flex items-center text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-mono font-medium">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> PREMIUM UNLOCKED
            </span>
          ) : (
            <button 
              onClick={onUpgrade}
              className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono font-bold text-xs rounded-full hover:from-amber-400 hover:to-orange-400 update-premium-btn transition shadow-md"
            >
              UPGRADE KSH 10,000/MO
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/40">
        
        {/* Trial limit notice if not premium */}
        {!user.isPremium && (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start space-x-2.5">
            <div className="p-1 bg-indigo-500/20 text-indigo-400 rounded-md mt-0.5">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="text-xs text-indigo-200">
              <p className="font-semibold">Free Preview Status</p>
              <p className="text-indigo-300">You can complete up to 3 trial queries with the AI assistant. Upgrade to unlock complete legal, tax compliance, and unlimited advisory books.</p>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              m.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none font-sans font-medium shadow-lg'
                : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-none leading-relaxed'
            }`}>
              {/* Message Content with simple Markdown styling */}
              <div className="whitespace-pre-wrap component-markdown">
                {m.content.split('\n').map((line, idx) => {
                  let formattedLine = line;
                  // Render bullet lists or Bold text simply
                  if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                    return <li key={idx} className="ml-4 list-disc text-slate-300 py-0.5">{line.substring(2)}</li>;
                  }
                  if (line.trim().startsWith('⚠️') || line.trim().startsWith('✅') || line.trim().startsWith('👉')) {
                    return <p key={idx} className="py-1 flex items-start text-indigo-200 font-medium">{line}</p>;
                  }
                  return <p key={idx} className="py-0.5 last:mb-0">{formattedLine}</p>;
                })}
              </div>
              <span className="block text-[10px] text-slate-400 mt-2 text-right font-mono">
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl rounded-bl-none px-4 py-3.5 shadow-md max-w-[80%]">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin" />
                <span className="text-xs text-slate-400 font-mono">Consulting Business Logic AI Tax legal frameworks...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-3 bg-slate-950/40 border-t border-slate-800/80">
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2">Suggested Compliance Questions:</p>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/60 transition text-left cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Form Input Container */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(inputValue);
          }}
          placeholder="Ask about VAT calculation, bookkeeping tips, PAYE bands..."
          className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 px-4 py-3 rounded-xl text-sm text-white focus:outline-none placeholder-slate-500 font-sans transition-colors"
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim() || isLoading}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-indigo-600 transition shadow-lg cursor-pointer flex items-center justify-center"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
