import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Target, Shield, Sprout, CloudRain, Cpu, History } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

export function YieldPredictionWidget() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI loading process
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalAcres = parseInt(user?.farmDetails.totalLand || '12') || 12;
  const expectedYieldPerAcre = 2.1; // tons
  const totalYield = (totalAcres * expectedYieldPerAcre).toFixed(1);
  
  // 5-year average statistics
  const historicalAvgYieldPerAcre = 1.85; // tons
  const historicalAvgTotalYield = (totalAcres * historicalAvgYieldPerAcre).toFixed(1);
  const trendPercentage = (((expectedYieldPerAcre - historicalAvgYieldPerAcre) / historicalAvgYieldPerAcre) * 100).toFixed(1);
  const isPositiveTrend = Number(trendPercentage) > 0;

  return (
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-500" /> AI Yield Predictor
        </h3>
        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase rounded-md border border-emerald-500/20">
          Live Estimate
        </span>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <Cpu className="w-8 h-8 text-brand-500 animate-pulse" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Running LightGBM Simulation...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Estimated Total Yield ({user?.farmDetails.primaryCrop})</p>
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-end gap-3">
                <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {totalYield} <span className="text-xl text-slate-500 font-medium">Tons</span>
                </div>
                <div className={`flex items-center gap-1 ${isPositiveTrend ? 'text-emerald-500' : 'text-rose-500'} font-bold mb-1`}>
                  {isPositiveTrend ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{isPositiveTrend ? '+' : ''}{trendPercentage}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                <History className="w-3 h-3" />
                <span>5-Year Average: {historicalAvgTotalYield} Tons</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold w-full mt-3">
                 <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                   <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
                 </div>
                 <span className="text-emerald-500">85% Confidence</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
            <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Weather Impact</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">+12% (Favorable)</p>
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Soil Pre-Condition</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Optimal NPK</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
