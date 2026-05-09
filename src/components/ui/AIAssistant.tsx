import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Mic, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { postAi } from '../../lib/aiClient';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hello! I am KisanMind AI. I can help you with crop disease diagnosis, weather alerts, and mandi prices. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = input.trim();
    if (!q || sendLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setSendLoading(true);

    try {
      const hint =
        lang === 'hi'
          ? 'User writes in Hindi or English; reply in the same language when possible.'
          : 'Reply in clear Markdown when lists help.';
      const reply = await postAi({
        text: `Farmer assistant chat.\n${hint}\nQuestion: ${q}`,
      });
      setMessages(prev => [...prev, { role: 'ai', text: reply.trim() }]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Could not reach the AI server.';
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: `${msg} Run the app with npm run dev so /api/ai is available.`,
        },
      ]);
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] z-50 glass-panel rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-brand-200 dark:border-brand-500/20 bg-white/90 dark:bg-slate-900/95"
          >
            {/* Header */}
            <div className="p-4 bg-brand-500 dark:bg-brand-600 flex items-center justify-between text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">KisanMind AI</h3>
                  <p className="text-[10px] text-brand-100 font-medium tracking-wide uppercase">Always active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-500 text-white rounded-br-sm' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-200 dark:border-slate-700'
                  }`}>
                    {msg.role === 'ai' && <Sparkles className="w-3 h-3 text-brand-500 mb-1" />}
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={lang === 'hi' ? "हिंदी में पूछें..." : "Type your question..."}
                  className="w-full pl-4 pr-10 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-brand-500">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              <button 
                type="submit"
                disabled={!input.trim() || sendLoading}
                className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 text-white flex items-center justify-center transition-colors shadow-md shrink-0"
              >
                <Send className={`w-4 h-4 ml-0.5 ${sendLoading ? 'opacity-50' : ''}`} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-brand-600 to-brand-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30 z-50 group border border-white/20"
      >
        <span className="absolute inset-0 rounded-full bg-brand-400 blur opacity-40 group-hover:opacity-75 transition-opacity"></span>
        <div className="relative z-10 flex">
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
        </div>
        {/* Unread dot */}
        {!isOpen && (
           <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
        )}
      </motion.button>
    </>
  );
}
