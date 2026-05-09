import { ScanLine, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function ScannerWidget() {
  return (
    <Link to="/dashboard/scan" className="block glass-panel p-1 rounded-3xl h-full relative overflow-hidden group cursor-pointer border border-brand-200 dark:border-brand-500/20 hover:border-brand-500/50 transition-colors bg-white dark:bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-slate-50 dark:from-brand-900/40 dark:to-slate-900/80 z-0"></div>
      
      {/* Target Crosshairs */}
      <div className="absolute inset-4 border border-brand-300/50 dark:border-brand-500/30 rounded-2xl z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-brand-500 dark:border-brand-400 rounded-tl-xl -mt-0.5 -ml-0.5"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-brand-500 dark:border-brand-400 rounded-tr-xl -mt-0.5 -mr-0.5"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-brand-500 dark:border-brand-400 rounded-bl-xl -mb-0.5 -ml-0.5"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-brand-500 dark:border-brand-400 rounded-br-xl -mb-0.5 -mr-0.5"></div>
      </div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
          <ScanLine className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Crop Scanner</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-[200px] font-medium">Detect diseases & nutrient deficiencies in real-time</p>
        
        <div className="mt-6 flex gap-3">
          <div className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/20">
            <ScanLine className="w-4 h-4" /> Start Scan
          </div>
        </div>
      </div>
      
      {/* Scanning laser animation */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-0.5 bg-brand-500 dark:bg-brand-400 shadow-[0_0_8px_2px_theme(colors.brand.500/30)] dark:shadow-[0_0_8px_2px_theme(colors.brand.500/50)] z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ top: '10%' }}
        animate={{ top: '90%' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </Link>
  );
}
