import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, Globe, Check, ArrowRight, ShieldCheck, 
  MapPin, Palette, Monitor, Type, Leaf
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

export function Onboarding() {
  const navigate = useNavigate();
  const { lang, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { updateFarmDetails, user } = useUser();
  const [step, setStep] = useState(1);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' }
  ];

  const handleFinish = async () => {
    // Basic default farm details if not set
    if (!user?.farmDetails.primaryCrop) {
      await updateFarmDetails({
        primaryCrop: 'Wheat',
        secondaryCrop: 'Mustard',
        totalLand: '5',
        soilType: 'Loamy'
      });
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-500">
      <div className="max-w-2xl w-full">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-panel p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl"
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              {t('configureFarmOs')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('personalizeFarmOs')}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('operatingLanguage')}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as any)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                      lang === l.code 
                        ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-900/20' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`text-xs font-black uppercase mb-1 ${lang === l.code ? 'text-brand-600' : 'text-slate-400'}`}>
                      {l.label}
                    </div>
                    <div className={`text-lg font-bold ${lang === l.code ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {l.native}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Monitor className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('appearanceMode')}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['light', 'dark'].map((t_mode) => (
                  <button
                    key={t_mode}
                    onClick={() => setTheme(t_mode as any)}
                    className={`p-6 rounded-3xl border-2 transition-all text-center group ${
                      theme === t_mode 
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110 ${
                      t_mode === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {t_mode === 'light' ? <Palette className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white capitalize">{t(t_mode as any)}</div>
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('colorAccent')}</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded-2xl shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-4 border-white dark:border-slate-800"
                      style={{ backgroundColor: color }}
                    >
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 text-center">
              <div className="w-24 h-24 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-12 h-12 text-brand-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-widest">{t('allSystemsGo')}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your Farm OS is optimized and ready for deployment.
                </p>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <Type className="w-6 h-6 text-rose-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('typographyTitle')}</h3>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-900 dark:text-white font-medium italic">
                    "The quick brown fox jumps over the lazy dog."
                  </p>
                  <p className="text-xs text-slate-400 mt-2">Outfit Sans-Serif (Default)</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-between items-center">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-10 py-4 bg-brand-600 text-white rounded-2xl font-black shadow-xl shadow-brand-600/30 hover:scale-105 transition-all flex items-center gap-2"
              >
                {t('launchDashboard')} <Check className="w-6 h-6" />
              </button>
            )}
          </div>
        </motion.div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" /> Secure Onboarding Protocol
        </div>
      </div>
    </div>
  );
}
