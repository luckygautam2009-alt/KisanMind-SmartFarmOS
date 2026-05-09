import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Thermometer, Wind, Zap, Activity } from 'lucide-react';

export function Farm3DModel() {
  return (
    <div className="w-full h-full p-6 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group min-h-[300px]">
        {/* Background Graphic */}
        <div className="absolute right-0 bottom-0 w-full h-full bg-topo-pattern opacity-[0.03] dark:opacity-[0.05] pointer-events-none transition-opacity group-hover:opacity-[0.06]" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
            <div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Activity className="w-5 h-5 text-brand-500" /> Farm Health Overview
               </h3>
               <p className="text-sm text-slate-500 font-medium mt-1">Real-time metrics from field sensors and satellite data.</p>
            </div>
            <div className="px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wide border border-emerald-200 dark:border-emerald-800 shrink-0">
               Optimal Condition
            </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 mt-auto">
            <MetricCard icon={Droplets} label="Soil Moisture" value="45%" status="Good" color="blue" />
            <MetricCard icon={Thermometer} label="Soil Temp" value="22°C" status="Stable" color="amber" />
            <MetricCard icon={Wind} label="Wind Speed" value="12 km/h" status="Normal" color="slate" />
            <MetricCard icon={Zap} label="Nitrogen Level" value="Opt" status="Balanced" color="brand" />
        </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, status, color }: { icon: any, label: string, value: string, status: string, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-800',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100 dark:border-amber-800',
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 border-brand-100 dark:border-brand-800',
    slate: 'bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700'
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`p-4 rounded-2xl border ${colorMap[color]} flex flex-col gap-3 shadow-sm`}
    >
      <div className="flex justify-between items-start">
        <Icon className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{status}</span>
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        <div className="text-xs font-medium opacity-80 mt-1 truncate">{label}</div>
      </div>
    </motion.div>
  );
}
