import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Scan, TrendingUp, CloudSun, Settings, LogOut, Sprout, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard') || 'Dashboard', href: '/dashboard' },
    { icon: Scan, label: t('cropScan') || 'Crop Scan', href: '/dashboard/scan' },
    { icon: Calendar, label: t('farmPlanner') || 'Farm Planner', href: '/dashboard/planner' },
    { icon: TrendingUp, label: t('mandiPrices') || 'Mandi Prices', href: '/dashboard/market' },
    { icon: CloudSun, label: t('weatherRisks') || 'Weather & Risks', href: '/dashboard/weather' },
    { icon: BookOpen, label: t('farmerBlogs'), href: '/dashboard/blogs' },
  ];

  return (
    <aside className="w-64 flex flex-col h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 sticky top-0 hidden md:flex z-20 shrink-0 transition-colors duration-500">
      {/* Brand */}
      <Link to="/dashboard" className="h-20 flex items-center px-6 gap-3 border-b border-slate-200 dark:border-slate-800 shrink-0 group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <Sprout className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">Kisan<span className="text-brand-500 dark:text-brand-400">Mind+</span></h1>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">{t('smartFarmOS')}</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="block relative group"
            >
              <div className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 relative z-10 font-medium text-sm",
                isActive 
                  ? "text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 font-semibold" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              )}>
                <item.icon className={cn("w-5 h-5", isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                {item.label}
              </div>
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1 bottom-1 w-1 bg-brand-600 dark:bg-brand-500 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="p-4 shrink-0 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <Link
          to="/dashboard/settings"
          className="block relative group"
        >
          <div className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 relative z-10 font-medium text-sm",
            location.pathname === '/dashboard/settings' 
              ? "text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 font-semibold" 
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
          )}>
            <Settings className={cn("w-5 h-5", location.pathname === '/dashboard/settings' ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
            {t('settings')}
          </div>
          {location.pathname === '/dashboard/settings' && (
            <motion.div
              layoutId="sidebar-indicator"
              className="absolute left-0 top-1 bottom-1 w-1 bg-brand-600 dark:bg-brand-500 rounded-r-full"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </Link>
        <Link to="/" className="flex items-center gap-3 px-4 py-2.5 w-full text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors font-medium text-sm group">
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-600 dark:text-slate-500 dark:group-hover:text-red-400" />
          <span className="font-medium">{t('logout')}</span>
        </Link>
      </div>
    </aside>
  );
}
