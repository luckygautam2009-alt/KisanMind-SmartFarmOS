import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Mail, Lock, User, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import heroBg from '../assets/background.jpeg';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useUser();

  // If already signed in, redirect
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        navigate('/dashboard');
      } else {
        await signUpWithEmail(name, email, password);
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim() || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim() || 'Google sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="Farm Background" className="w-full h-full object-cover opacity-10 dark:opacity-40 blur-sm scale-105 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-100/80 via-slate-50/90 to-slate-50 dark:from-slate-950/60 dark:via-slate-950/80 dark:to-slate-950 transition-colors duration-500"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 100 }}
        className="w-full max-w-5xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row z-10 shadow-2xl dark:shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-colors duration-500"
      >
        {/* Left Form Side */}
        <div className="flex-1 p-8 md:p-12 xl:p-16 flex flex-col relative">
          
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-10 w-fit">
            <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
          </Link>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 transition-colors">
              {isLogin ? t('welcomeBack') : t('createAccount')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
              {isLogin ? t('signInToAccess') : t('joinFuture')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-4"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
            </motion.div>
          )}

          {/* Google Auth Button */}
          <button 
            onClick={handleGoogleAuth}
            disabled={submitting}
            className="w-full flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold py-3.5 px-4 rounded-2xl transition-all mb-6 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <GoogleIcon />}
            {isLogin ? `${t('signIn')} with Google` : `${t('signUp')} with Google`}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
            <span className="text-slate-500 text-xs font-bold tracking-widest uppercase">{t('orContinueWithEmail')}</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('fullName')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ram Singh"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('emailPlaceholder')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  placeholder="ram@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('passwordPlaceholder')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-black/20 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end pt-1">
                <a href="#" className="text-sm font-medium text-brand-400 hover:text-brand-300">{t('forgotPassword')}</a>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-4 px-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all mt-6"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isLogin ? t('signIn') : t('signUp')} <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-400">
              {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
            </span>{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-white hover:text-brand-400 transition-colors"
            >
              {isLogin ? t('signUp') : t('signIn')}
            </button>
          </div>
        </div>

        {/* Right Illustration Side */}
        <div className="hidden md:block flex-1 relative overflow-hidden bg-slate-900 border-l border-white/5">
          <div className="absolute inset-0 bg-brand-600/20 mix-blend-multiply z-10"></div>
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src="https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Agriculture field"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
          
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white z-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 backdrop-blur-md flex items-center justify-center">
                <Sprout className="text-brand-400 w-7 h-7" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Kisan<span className="text-brand-400">Mind+</span></span>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem]"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl font-medium mb-6 leading-relaxed text-slate-200">
                {t('progressiveFarmerReview')}
              </blockquote>
              <div className="flex items-center gap-4">
                <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2" alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-brand-500" />
                <div>
                  <p className="font-bold text-white">{t('progressiveFarmerName')}</p>
                  <p className="text-brand-400 text-sm font-medium">{t('progressiveFarmerTitle')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
