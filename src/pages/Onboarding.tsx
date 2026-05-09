import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Settings2, Moon, Sun, Monitor, Palette, Type, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import heroBg from '../assets/background.jpeg';

export function Onboarding() {
  const navigate = useNavigate();
  const { theme, setTheme, color, setColor, font, setFont } = useTheme();
  const { lang, setLanguage } = useLanguage();

  const colors = [
    { id: 'emerald', name: 'Emerald (Nature)', hex: 'bg-emerald-500' },
    { id: 'blue', name: 'Blue (Water)', hex: 'bg-blue-500' },
    { id: 'orange', name: 'Orange (Harvest)', hex: 'bg-orange-500' },
    { id: 'purple', name: 'Purple (Tech)', hex: 'bg-purple-500' }
  ] as const;

  const fonts = [
    { id: 'outfit', name: 'Outfit (Modern)', class: 'font-outfit' },
    { id: 'inter', name: 'Inter (Clean)', class: 'font-inter' },
    { id: 'sans', name: 'Noto Sans (Reading)', class: 'font-sans' }
  ] as const;

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'hi', name: 'हिंदी' },
    { id: 'mr', name: 'मराठी' },
    { id: 'gu', name: 'ગુજરાતી' },
    { id: 'ta', name: 'தமிழ்' },
    { id: 'te', name: 'తెలుగు' },
    { id: 'bn', name: 'বাংলা' },
    { id: 'pa', name: 'ਪੰਜਾਬੀ' }
  ] as const;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="Farm Background" className="w-full h-full object-cover opacity-10 dark:opacity-30 blur-md scale-105 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-slate-50/60 to-slate-50/90 dark:from-slate-950/80 dark:via-slate-950/60 dark:to-slate-950/90 transition-colors duration-500"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 100 }}
        className="w-full max-w-5xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl dark:shadow-[0_0_60px_rgba(0,0,0,0.6)] p-8 lg:p-12 z-10 transition-colors duration-500"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-brand-200 dark:border-brand-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            <Settings2 className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Configure Your Farm OS</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Personalize KisanMind+ to suit your environment and preferences.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column: Language */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
              <Globe className="w-6 h-6 text-brand-500 dark:text-brand-400" /> Language / भाषा
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id as any)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    lang === l.id 
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="font-semibold text-lg">{l.name}</span>
                  {lang === l.id && <Check className="w-5 h-5 text-brand-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Personalization */}
          <div className="space-y-10">
            
            {/* Theme Mode */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/10 pb-4">
                <Monitor className="w-6 h-6 text-blue-400" /> Appearance Mode
              </h3>
              <div className="flex gap-4">
                <button onClick={() => setTheme('light')} className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${theme === 'light' ? 'border-brand-500 bg-brand-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                  <Sun className={`w-8 h-8 ${theme === 'light' ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span className={`font-bold ${theme === 'light' ? 'text-white' : 'text-slate-400'}`}>Light</span>
                </button>
                <button onClick={() => setTheme('dark')} className={`flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${theme === 'dark' ? 'border-brand-500 bg-brand-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                  <Moon className={`w-8 h-8 ${theme === 'dark' ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-400'}`}>Dark</span>
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/10 pb-4">
                <Palette className="w-6 h-6 text-orange-400" /> Color Accent
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
                      color === c.id ? 'border-brand-500 bg-brand-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${c.hex} shadow-sm ring-2 ring-offset-2 ${color === c.id ? 'ring-white/50 ring-offset-slate-900' : 'ring-transparent'}`}></div>
                    <span className={`font-bold ${color === c.id ? 'text-white' : 'text-slate-300'}`}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/10 pb-4">
                <Type className="w-6 h-6 text-rose-400" /> Typography
              </h3>
              <div className="flex flex-col gap-4">
                {fonts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFont(f.id)}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${f.class} ${
                      font === f.id ? 'border-brand-500 bg-brand-500/20 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="text-xl font-semibold">{f.name}</span>
                    {font === f.id && <Check className="w-6 h-6 text-brand-400" />}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-16 flex justify-end pt-8 border-t border-white/10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 bg-brand-600 hover:bg-brand-500 text-white text-lg font-bold rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center gap-3 hover:-translate-y-1"
          >
            Launch Dashboard <Check className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
