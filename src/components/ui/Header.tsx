import { Bell, Mic, Search, Menu, Sun, Moon, Globe, AlertTriangle, Sprout, Tractor, X, Send, User, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { useUser } from '../../contexts/UserContext';

export function Header() {
  const { lang, setLanguage, t } = useLanguage();
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'agent', text: string}[]>([]);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { signOutUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const notifications = useMemo(
    () => [
      { title: t('notif1Title'), desc: t('notif1Desc'), icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
      { title: t('notif2Title'), desc: t('notif2Desc'), icon: Sprout, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
      { title: t('notif3Title'), desc: t('notif3Desc'), icon: Tractor, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-500/10' },
    ],
    [t]
  );

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Stop listening if user submits manually
    if (isListening) stopListening();

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: `Answer as a farming assistant: ${userMsg}` 
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server Error');
      }
      setMessages(prev => [...prev, { role: 'agent', text: data.result }]);
    } catch (e: any) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'agent', text: `Error: ${e.message}. Note: if API key is missing, add it to Settings/Secrets.` }]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    const speechMap: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      bn: 'bn-IN',
      pa: 'pa-IN',
    };
    recognition.lang = speechMap[lang] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(prev => prev + " " + transcript);
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const stopListening = () => setIsListening(false);

  return (
    <>
      <header className="h-16 px-6 lg:px-10 flex items-center justify-between z-40 sticky top-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 rounded-none shrink-0 transition-colors duration-500">
        <div className="flex items-center gap-4 w-full">
          <button className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all w-80 relative">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-500 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Language & Theme Adjustments */}
          <div className="items-center gap-1 hidden md:flex border-r border-slate-200 dark:border-slate-800 pr-4 mr-2">
             <div className="relative group py-2">
               <button 
                 className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
               >
                 <Globe className="w-4 h-4" />
                 <span className="hidden xl:block uppercase">{lang}</span>
               </button>
               <div className="absolute right-0 top-full w-32 max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                 {['en', 'hi', 'pa', 'mr', 'gu', 'te', 'ta', 'kn', 'ml', 'bn'].map(l => (
                   <button 
                     key={l} 
                     onClick={() => setLanguage(l as any)}
                     className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase"
                   >
                     {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : l === 'pa' ? 'ਪੰਜਾਬੀ' : l === 'mr' ? 'मराठी' : l === 'gu' ? 'ગુજરાતી' : l === 'te' ? 'తెలుగు' : l === 'ta' ? 'தமிழ்' : l === 'kn' ? 'ಕನ್ನಡ' : l === 'ml' ? 'മലയാളം' : 'বাংলা'}
                   </button>
                 ))}
               </div>
             </div>
             <button 
               onClick={toggleTheme}
               className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-slate-100 dark:bg-slate-800/50 rounded-full"
             >
               {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </button>
          </div>

          {/* Voice Assistant Button (Hindi) */}
          <button onClick={() => setShowVoiceChat(true)} className="relative group flex items-center gap-2 px-4 py-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 border border-brand-200 dark:border-brand-500/30 rounded-full transition-all">
            <div className="absolute inset-0 bg-brand-400 rounded-full blur opacity-0 dark:opacity-20 group-hover:dark:opacity-40 transition-opacity"></div>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 dark:bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600 dark:bg-brand-500"></span>
            </span>
            <Mic className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="text-sm font-medium text-brand-700 dark:text-brand-300 hidden sm:block whitespace-nowrap">{t('kisanVoice')}</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center shrink-0"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">{t('notificationsTitle')}</h3>
                    <span className="text-xs font-semibold bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full">{t('newBadge')}</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notif, i) => (
                      <div key={i} className="flex gap-3 p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${notif.bg}`}>
                          <notif.icon className={`w-5 h-5 ${notif.color}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{notif.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{notif.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    <span className="text-sm font-medium text-brand-600 dark:text-brand-400">{t('viewAll')}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar with Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all shrink-0 ml-1 block bg-slate-200 dark:bg-slate-800 flex items-center justify-center focus:ring-2 focus:ring-brand-500/50"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-500" />
              )}
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || t('guestLabel')}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/dashboard/profile" 
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-brand-500" />
                      {t('profileNav')}
                    </Link>
                    <Link 
                      to="/dashboard/settings" 
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-brand-500" />
                      {t('settings')}
                    </Link>
                  </div>
                  <div className="p-2 border-t border-slate-200 dark:border-slate-800">
                    <button 
                      onClick={async () => {
                        await signOutUser();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Kisan Voice Chat Dialog */}
      <AnimatePresence>
        {showVoiceChat && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVoiceChat(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed bottom-4 sm:bottom-10 right-4 sm:right-10 w-[calc(100vw-32px)] sm:w-[450px] h-[500px] max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-[95] overflow-hidden"
            >
              {/* Chat Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-brand-600 to-emerald-500 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center relative">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg">{t('voiceModalTitle')}</h3>
                     <p className="text-white/80 text-xs">{t('voiceModalSub')}</p>
                  </div>
                </div>
                <button onClick={() => setShowVoiceChat(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex shrink-0 items-center justify-center mt-1">
                    <Sprout className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 shadow-sm max-w-[85%]">
                    {t('voiceWelcome')}
                  </div>
                </div>

                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-brand-100 dark:bg-brand-900'}`}>
                      {msg.role === 'user' ? <span className="text-emerald-700 dark:text-emerald-300 font-bold text-xs">You</span> : <Sprout className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                    </div>
                    <div className={`p-4 rounded-2xl border text-sm shadow-sm max-w-[85%] ${
                      msg.role === 'user' 
                        ? 'bg-emerald-500 text-white rounded-tr-none border-emerald-600' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border-slate-200 dark:border-slate-700 markdown-body prose-sm dark:prose-invert'
                    }`}>
                      {msg.role === 'user' ? msg.text : <Markdown>{msg.text}</Markdown>}
                    </div>
                  </div>
                ))}
                
                {loading && (
                   <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex shrink-0 items-center justify-center mt-1">
                      <Sprout className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                 <form onSubmit={handleChatSubmit} className="relative flex items-center">
                   <button 
                     type="button"
                     onClick={isListening ? stopListening : startListening}
                     className={`absolute left-2 p-2 rounded-full transition-colors z-10 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                   >
                     <Mic className="w-4 h-4" />
                   </button>
                   <input 
                     type="text" 
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder={isListening ? t('voiceListening') : t('voiceInputPh')} 
                     className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                   />
                   <button 
                     type="submit" 
                     disabled={!query.trim() || loading}
                     className="absolute right-2 p-2 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 disabled:opacity-50 text-white rounded-full transition-colors"
                   >
                     <Send className="w-4 h-4" />
                   </button>
                 </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
