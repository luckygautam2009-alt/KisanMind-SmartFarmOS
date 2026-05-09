import { Leaf, Mail, Globe, MapPin, Sprout } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export function DashboardFooter() {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 bg-transparent shrink-0">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Brand & Copyright */}
        <Link to="/dashboard" className="flex items-center gap-4 group">
          <div className="flex items-center gap-2">
            <Sprout className="text-brand-600 dark:text-brand-500 w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Kisan<span className="text-brand-500">Mind+</span></span>
          </div>
          <div className="hidden md:block w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
          <p className="text-xs font-medium text-slate-500">
            {t('footerCopyright')} <span className="hidden sm:inline">{t('footerTaglineShort')}</span> {t('footerCredit')}
          </p>
        </Link>

        {/* Links & Status */}
        <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
           <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('supportLink')}</a>
           <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('privacyLink')}</a>
           <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">{t('termsLink')}</a>
           
           <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{t('allSystemsGo')}</span>
           </div>
        </div>

      </div>
    </footer>
  );
}
