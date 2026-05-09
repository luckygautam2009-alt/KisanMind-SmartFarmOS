import { motion } from 'framer-motion';
import { Bell, Globe, Moon, Shield, Sun, UploadCloud, Palette, Type, User, Check, LogOut, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'bn' | 'pa' | 'kn' | 'ml';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
];

export function Settings() {
  const { lang, setLanguage } = useLanguage();
  const { theme, toggleTheme, color, setColor, font, setFont } = useTheme();
  const { user, signOutUser } = useUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="max-w-5xl mx-auto flex-1 w-full flex flex-col pt-6 pb-12 px-4 relative">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight transition-colors">Configuration</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">Manage your smart farm preferences, personalization, and security.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        
        {/* Left Column: Profile & Security */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Profile Card */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 relative z-10 transition-colors">
              <Shield className="w-6 h-6 text-brand-400" /> Account Identity
            </h3>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-brand-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover rounded-[2rem]" />
                ) : (
                  <User className="w-12 h-12 text-brand-400" />
                )}
                <button className="absolute -bottom-3 -right-3 w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-brand-500 transition-colors">
                  <UploadCloud className="w-5 h-5" />
                </button>
              </div>
              <div className="font-extrabold text-slate-900 dark:text-white text-2xl mb-1 transition-colors">{user?.name || 'Farmer'}</div>
              <div className="text-brand-500 dark:text-brand-400 font-medium mb-1 transition-colors">{user?.membership || 'Free Member'}</div>
              <div className="text-slate-500 dark:text-slate-400 text-sm mb-6 transition-colors">{user?.email || ''}</div>
              
              <button onClick={handleSignOut} className="w-full py-3 px-4 bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-white/10 hover:border-red-300 dark:hover:border-red-500/30 text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>

          {/* System & Alerts Card */}
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] shadow-xl transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3 transition-colors">
              <Smartphone className="w-6 h-6 text-blue-500 dark:text-blue-400" /> System & Alerts
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-lg transition-colors">Push Notifications</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Weather & Market alerts</div>
                </div>
                <div className="w-14 h-8 bg-brand-500 rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <motion.div layout className="absolute right-1 top-1 bg-white w-6 h-6 rounded-full shadow-md"></motion.div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-lg transition-colors">SMS Fallback</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Receive alerts offline</div>
                </div>
                <div className="w-14 h-8 bg-brand-500 rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <motion.div layout className="absolute right-1 top-1 bg-white w-6 h-6 rounded-full shadow-md"></motion.div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Personalization */}
        <div className="md:col-span-7 space-y-6">
          
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] shadow-xl h-full transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 transition-colors">
              <Palette className="w-6 h-6 text-orange-500 dark:text-orange-400" /> Interface Personalization
            </h3>
            
            <div className="space-y-8">
              
              {/* Language Selection */}
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl p-5 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center transition-colors"><Globe className="w-5 h-5"/></div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-lg transition-colors">Operating Language</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">OS interface language</div>
                  </div>
                </div>
                <div className="relative">
                  <select 
                    value={lang} 
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full appearance-none px-4 py-4 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl font-medium text-base hover:border-brand-500 dark:hover:border-brand-500 transition-colors outline-none cursor-pointer shadow-sm dark:shadow-none"
                  >
                     {languages.map((l) => (
                       <option key={l.code} value={l.code}>{l.label}</option>
                     ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>

              {/* Theme Mode */}
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl p-5 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-500 dark:text-purple-400 flex items-center justify-center transition-colors">
                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-lg transition-colors">Appearance</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Dark mode recommended for field use</div>
                  </div>
                </div>
                <div className="flex bg-slate-200 dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 rounded-xl p-1 transition-colors">
                  <button onClick={() => theme !== 'light' && toggleTheme()} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${theme === 'light' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Light</button>
                  <button onClick={() => theme !== 'dark' && toggleTheme()} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Dark</button>
                </div>
              </div>

              {/* Accent Color */}
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl p-5 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/20 text-brand-500 dark:text-brand-400 flex items-center justify-center transition-colors"><Palette className="w-5 h-5"/></div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-lg transition-colors">Accent Color</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Primary brand color</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  {[
                    { id: 'emerald', class: 'bg-emerald-500' },
                    { id: 'blue', class: 'bg-blue-500' },
                    { id: 'orange', class: 'bg-orange-500' },
                    { id: 'purple', class: 'bg-purple-500' }
                  ].map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setColor(c.id as any)} 
                      className={`w-14 h-14 rounded-2xl ${c.class} flex items-center justify-center transition-all ${color === c.id ? 'ring-4 ring-slate-900/20 dark:ring-white/20 scale-110 shadow-lg' : 'hover:scale-105 opacity-80'}`}
                    >
                      {color === c.id && <Check className="w-6 h-6 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Style */}
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl p-5 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center transition-colors"><Type className="w-5 h-5"/></div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-lg transition-colors">Typography</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Application font family</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setFont('outfit')} className={`py-4 px-2 text-center rounded-xl font-outfit text-lg transition-all ${font === 'outfit' ? 'bg-brand-500 text-white font-bold shadow-lg' : 'bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'}`}>Outfit</button>
                  <button onClick={() => setFont('inter')} className={`py-4 px-2 text-center rounded-xl font-inter text-lg transition-all ${font === 'inter' ? 'bg-brand-500 text-white font-bold shadow-lg' : 'bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'}`}>Inter</button>
                  <button onClick={() => setFont('sans')} className={`py-4 px-2 text-center rounded-xl font-sans text-lg transition-all ${font === 'sans' ? 'bg-brand-500 text-white font-bold shadow-lg' : 'bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'}`}>System</button>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
