import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Leaf, Sprout, CloudSun, TrendingUp, Sun, Moon, Globe, Check, ShieldCheck, LocateFixed, Cpu, ScanLine, X, Play } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import heroBg from '../assets/background.jpeg';

export function Landing() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { setLanguage, t, lang } = useLanguage();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500 z-0 bg-transparent">
      
      {/* Global Fixed Background Image */}
      <motion.div 
        className="fixed inset-0 z-[-10] pointer-events-none"
        style={{ scale: useTransform(scrollYProgress, [0, 1], [1, 1.05]) }}
      >
         <img 
           src={heroBg} 
           alt="Farm Sunrise" 
           className="w-full h-full object-cover opacity-100 brightness-[0.65]"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950/90"></div>
      </motion.div>

      {/* Immersive 3D Floating Elements */}
      <div className="absolute inset-0 pointer-events-none z-[-2] overflow-hidden perspective-1000">
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -400]) }} className="absolute top-[20%] left-[10%] w-64 h-64 bg-amber-500/20 rounded-full blur-[100px]" />
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -250]) }} className="absolute top-[40%] right-[10%] w-96 h-96 bg-brand-500/10 rounded-full blur-[120px]" />
        
        {/* 3D Glass Leaf */}
         <motion.div 
           animate={{ y: [0, -60, 0], x: [0, 30, 0], rotateX: [0, 360], rotateY: [0, 360] }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute top-[15%] left-[15%] w-32 h-32 bg-gradient-to-br from-brand-400/20 to-brand-600/5 backdrop-blur-md border border-white/20 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.2)]"
           style={{ transformStyle: 'preserve-3d' }}
         >
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(20px)' }}><Leaf className="w-12 h-12 text-brand-400/80 drop-shadow-lg" /></div>
         </motion.div>

        {/* 3D Glass Sun */}
         <motion.div 
           animate={{ y: [0, 70, 0], x: [0, -40, 0], rotateX: [360, 0], rotateY: [0, 360] }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="absolute top-[40%] right-[12%] w-40 h-40 bg-gradient-to-bl from-amber-400/20 to-orange-600/5 backdrop-blur-md border border-white/20 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.2)]"
           style={{ transformStyle: 'preserve-3d' }}
         >
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(30px)' }}><Sun className="w-16 h-16 text-amber-400/80 drop-shadow-lg" /></div>
         </motion.div>

        {/* 3D Glass Tech Hexagon */}
         <motion.div 
           animate={{ y: [0, -50, 0], x: [0, 50, 0], rotateX: [0, 180, 360], rotateZ: [0, 90, 180] }}
           transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-[25%] left-[20%] w-28 h-28 bg-gradient-to-tr from-blue-400/20 to-indigo-600/5 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
           style={{ transformStyle: 'preserve-3d', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
         >
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(15px)' }}><Cpu className="w-10 h-10 text-blue-400/80 drop-shadow-lg" /></div>
         </motion.div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 lg:px-12 h-24 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
            <Sprout className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">Kisan<span className="text-brand-500">Mind+</span></h1>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{t('smartFarmOS')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group py-2">
             <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
               <Globe className="w-4 h-4" />
               <span className="uppercase">{lang}</span>
             </button>
             <div className="absolute right-0 top-full w-32 max-h-[80vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
               {['en', 'hi', 'pa', 'mr', 'gu', 'te', 'ta', 'kn', 'ml', 'bn'].map(l => (
                 <button 
                   key={l} 
                   onClick={() => setLanguage(l as any)}
                   className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800 text-slate-300 uppercase"
                 >
                   {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : l === 'pa' ? 'ਪੰਜਾਬੀ' : l === 'mr' ? 'मराठी' : l === 'gu' ? 'ગુજરાતી' : l === 'te' ? 'తెలుగు' : l === 'ta' ? 'தமிழ்' : l === 'kn' ? 'ಕನ್ನಡ' : l === 'ml' ? 'മലയാളം' : 'বাংলা'}
                 </button>
               ))}
             </div>
           </div>
          
          <Link to="/login" className="hidden sm:flex text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors">
            {t('signIn')}
          </Link>
          <Link to="/login" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
            {t('getStarted')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6 lg:px-12 flex flex-col items-center text-center w-full min-h-[90vh] justify-center overflow-hidden border-b border-white/5">

        {/* Content Container to ensure it stays above the new z-[0] background */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 inline-flex items-center gap-2 mb-8 px-4 py-1.5 bg-brand-500/20 border border-brand-500/30 rounded-full text-brand-400 text-sm font-semibold tracking-wide backdrop-blur-md"
        >
          <Sprout className="w-4 h-4" /> {t('heroTaglineFuture')}
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
        >
          {t('heroTitleGrow')} <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-400">{t('heroTitleWaste')}</span> {t('heroTitleEarn')}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md"
        >
          {t('heroSubtitleMain')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/login" className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-full shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 flex items-center gap-2 text-lg">
            {t('getStarted')} <ArrowRight className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => setIsVideoModalOpen(true)}
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full shadow-xl transition-all hover:-translate-y-1 hover:bg-white/20 flex items-center gap-2 text-lg"
          >
            <Play className="w-5 h-5 fill-current" />
            {t('demoWatch')}
          </button>
        </motion.div>
      </main>

      {/* Enhanced Bento Grid Features Section */}
      <section className="relative z-10 py-24 px-6 lg:px-12 mt-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex px-4 py-1.5 bg-brand-500/20 text-brand-400 font-bold uppercase tracking-widest text-xs rounded-full border border-brand-500/30 mb-6">
              {t('completeFarmIntelligence')}
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
              {t('everythingYouNeed')}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(300px,auto)] gap-6">
            
            {/* Bento Card 1: Crop Scanning (Large Wide) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="col-span-1 md:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row group hover:border-brand-500/50 transition-colors shadow-2xl"
            >
              <div className="p-10 flex-1 flex flex-col justify-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ScanLine className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{t('featureDiseaseTitle')}</h3>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  {t('featureDiseaseDesc')}
                </p>
                <div className="flex items-center gap-2 text-brand-400 font-semibold mt-auto">
                  <Check className="w-5 h-5"/> {t('featureDiseaseBadge')}
                </div>
              </div>
              <div className="w-full md:w-2/5 relative min-h-[250px] overflow-hidden">
                <img src="https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2" alt="Crop Scan" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent hidden md:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:hidden"></div>
              </div>
            </motion.div>

            {/* Bento Card 2: Weather (Tall) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="col-span-1 md:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 flex flex-col group hover:border-amber-500/50 transition-colors shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <CloudSun className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 relative z-10">{t('featureWeatherTitle')}</h3>
              <p className="text-slate-300 text-lg leading-relaxed relative z-10">
                {t('featureWeatherDesc')}
              </p>
              <div className="mt-auto pt-8 relative z-10">
                <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                  <CloudSun className="text-amber-400 w-8 h-8"/>
                  <div>
                    <div className="text-white font-bold">{t('rainExpected')}</div>
                    <div className="text-amber-400 text-sm">{t('tomorrowAt2PM')}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 3: Agmarknet (Wide) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="col-span-1 md:col-span-12 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row-reverse group hover:border-orange-500/50 transition-colors shadow-2xl"
            >
              <div className="p-10 flex-1 flex flex-col justify-center">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{t('featureMandiTitle')}</h3>
                <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-2xl">
                  {t('featureMandiDesc')}
                </p>
                <div className="flex flex-wrap gap-4 mt-auto">
                  <div className="flex items-center gap-2 text-orange-400 font-semibold bg-orange-500/10 px-4 py-2 rounded-lg"><Check className="w-4 h-4"/> {t('featureMandiCheck1')}</div>
                  <div className="flex items-center gap-2 text-orange-400 font-semibold bg-orange-500/10 px-4 py-2 rounded-lg"><Check className="w-4 h-4"/> {t('featureMandiCheck2')}</div>
                </div>
              </div>
              <div className="w-full md:w-1/3 relative min-h-[250px] overflow-hidden">
                <img src="https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2" alt="Market" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 duration-700" />
                <div className="absolute inset-0 bg-gradient-to-l from-slate-950/80 via-transparent to-transparent hidden md:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:hidden"></div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Transparent 3D Footer */}
      <motion.footer 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 py-12 px-6 lg:px-12 w-full bg-transparent max-w-7xl mx-auto"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6" style={{ transform: 'translateZ(30px)' }}>
          
          {/* Brand & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <Sprout className="text-brand-500 w-6 h-6" />
              <span className="font-bold text-white text-lg tracking-tight">Kisan<span className="text-brand-500">Mind+</span></span>
            </div>
            <div className="hidden md:block w-px h-6 bg-white/10"></div>
            <p className="text-sm font-medium text-slate-300">
              &copy; 2026. <span className="hidden sm:inline">{t('footerTaglineShort')}</span>
            </p>
          </div>

          {/* Links & Status */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium text-slate-300">
             <a href="#" className="hover:text-brand-400 transition-colors">{t('supportLink')}</a>
             <a href="#" className="hover:text-brand-400 transition-colors">{t('privacyLink')}</a>
             <a href="#" className="hover:text-brand-400 transition-colors">{t('termsLink')}</a>
             
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 ml-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-400">{t('allSystemsOperational')}</span>
             </div>
          </div>

        </div>
      </motion.footer>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10"
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-brand-950 p-8 text-center border-[8px] border-slate-800 rounded-3xl">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 rounded-full bg-brand-500/20 flex items-center justify-center mb-6"
                >
                  <Play className="w-12 h-12 text-brand-400 fill-current" />
                </motion.div>
                <h3 className="text-3xl sm:text-5xl font-black text-white mb-4">{t('demoWelcome')}</h3>
                <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-medium mb-8">
                  {t('demoDesc')}
                </p>
                <div className="flex flex-wrap justify-center gap-4 hidden sm:flex">
                  <div className="px-6 py-3 rounded-full bg-white/10 text-white text-sm font-bold backdrop-blur-md">{t('weatherRisks')}</div>
                  <div className="px-6 py-3 rounded-full bg-white/10 text-white text-sm font-bold backdrop-blur-md">{t('mandiPrices')}</div>
                  <div className="px-6 py-3 rounded-full bg-white/10 text-white text-sm font-bold backdrop-blur-md">{t('cropScan')}</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
