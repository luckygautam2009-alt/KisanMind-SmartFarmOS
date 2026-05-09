import { AgentStatusWidget } from '../components/widgets/AgentStatusWidget';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { MandiWidget } from '../components/widgets/MandiWidget';
import { ScannerWidget } from '../components/widgets/ScannerWidget';
import { AlertsWidget } from '../components/widgets/AlertsWidget';
import { Farm3DModel } from '../components/widgets/Farm3DModel';
import { YieldPredictionWidget } from '../components/widgets/YieldPredictionWidget';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { useUser } from '../contexts/UserContext';

export function Dashboard() {
  const { location, requestLocation } = useLocation();
  const { user } = useUser();

  const firstName = user?.name?.split(' ')[0] || user?.id || 'Farmer';

  return (
    <div className="flex-1 w-full flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase card-3d">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            KisanMind System Active
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -10, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight"
          >
            {firstName}'s Farm
          </motion.h1>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-500 mb-2 text-sm font-medium">
             <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-500" />
             {location.loading ? (
               <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin"/> Locating...</span>
             ) : location.error ? (
               <span className="text-red-500 cursor-pointer hover:underline" onClick={requestLocation}>{location.error} (Retry)</span>
             ) : (
               <span>{location.city}, {location.state} ({location.lat.toFixed(2)}, {location.lng.toFixed(2)})</span>
             )}
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl font-medium"
          >
            <span className="text-brand-600 dark:text-brand-300 font-semibold">"किसान सोता है — KisanMind जागता है"</span> <br className="md:hidden" /> 
            <span className="hidden md:inline"> | </span> 
            Your autonomous agents are monitoring {user?.farmDetails.totalLand} of {user?.farmDetails.primaryCrop} and {user?.farmDetails.secondaryCrop}.
          </motion.p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Interactive 3D Farm Model (Span 12 cols, 2 rows) */}
        <motion.div 
          className="md:col-span-6 lg:col-span-12 lg:row-span-2 card-3d greenhouse-glass rounded-[2rem] overflow-hidden p-2 leaf-shadow"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <Farm3DModel />
          </div>
        </motion.div>

        {/* Agent Status (Span 4 cols, 1 row) */}
        <motion.div 
          className="md:col-span-3 lg:col-span-4 lg:row-span-1 card-3d-reverse"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AgentStatusWidget />
        </motion.div>

        {/* Weather (Span 4 cols, 2 rows) */}
        <motion.div 
          className="md:col-span-3 lg:col-span-4 lg:row-span-2 card-3d"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WeatherWidget />
        </motion.div>

        {/* Scanner Tool (Span 4 cols, 1 row) */}
        <motion.div 
          className="md:col-span-3 lg:col-span-4 lg:row-span-1 card-3d-reverse"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ScannerWidget />
        </motion.div>

        {/* Mandi Widget (Span 4 cols, 1 row) */}
        <motion.div 
          className="md:col-span-3 lg:col-span-4 lg:row-span-1 card-3d"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MandiWidget />
        </motion.div>

        {/* Intelligence / Alerts (Span 8 cols, 1 row) */}
        <motion.div 
          className="md:col-span-6 lg:col-span-8 lg:row-span-1 card-3d-reverse"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AlertsWidget />
        </motion.div>

        {/* Yield Predictor (Span 4 cols, 1 row) */}
        <motion.div 
          className="md:col-span-3 lg:col-span-4 lg:row-span-1 card-3d"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <YieldPredictionWidget />
        </motion.div>

      </div>
    </div>
  );
}
