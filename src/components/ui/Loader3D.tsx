import { motion } from 'framer-motion';

export function Loader3D() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
      <div className="relative flex flex-col items-center justify-center space-y-6">
        
        {/* Sleek rotating geometric shapes */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 border-t-2 border-r-2 border-brand-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-2 border-b-2 border-l-2 border-emerald-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          />
          <motion.div
             className="w-8 h-8 bg-brand-500 rounded-full shadow-[0_0_20px_theme(colors.brand.500)]"
             animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
             transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          className="text-white text-sm font-semibold tracking-widest uppercase"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Initializing KisanMind
        </motion.div>

      </div>
    </div>
  );
}
