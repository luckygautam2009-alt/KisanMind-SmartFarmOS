import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Circle, AlertCircle, Droplets, FlaskConical, Bug, Eye } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface TimetableItem {
  id: string;
  time: string;
  task: string;
  type: 'watering' | 'fertilizer' | 'pest' | 'monitoring';
  completed: boolean;
}

const DEFAULT_TIMETABLE: TimetableItem[] = [
  { id: '1', time: '06:00 AM', task: 'Check soil moisture levels in North plot', type: 'watering', completed: true },
  { id: '2', time: '07:30 AM', task: 'Automated drip irrigation - Segment A', type: 'watering', completed: true },
  { id: '3', time: '09:00 AM', task: 'Apply organic NPK booster to wheat saplings', type: 'fertilizer', completed: false },
  { id: '4', time: '11:00 AM', task: 'Routine canopy inspection for yellow rust', type: 'monitoring', completed: false },
  { id: '5', time: '04:30 PM', task: 'Pest control spray (Neem oil) - Boundary area', type: 'pest', completed: false },
  { id: '6', time: '06:00 PM', task: 'Log daily growth metrics into SmartFarm OS', type: 'monitoring', completed: false },
];

export function FarmTimetableWidget() {
  const { t } = useLanguage();

  const getIcon = (type: string) => {
    switch (type) {
      case 'watering': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'fertilizer': return <FlaskConical className="w-4 h-4 text-emerald-500" />;
      case 'pest': return <Bug className="w-4 h-4 text-red-500" />;
      case 'monitoring': return <Eye className="w-4 h-4 text-amber-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'watering': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'fertilizer': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'pest': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'monitoring': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-brand-500" /> {t('dailyTimetable')}
          </h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{t('todayOperations')}</p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
              U{i}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-hide">
        {DEFAULT_TIMETABLE.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
              item.completed 
                ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-70' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-brand-500/50 shadow-sm'
            }`}
          >
            <div className="flex-shrink-0 mt-1">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${getBadgeColor(item.type)}`}>
                  {item.time}
                </span>
                <div className="flex items-center gap-1">
                  {getIcon(item.type)}
                </div>
              </div>
              <p className={`text-sm font-semibold leading-snug ${item.completed ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                {item.task}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-brand-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('nextOpPrefix')}: Apply NPK booster</span>
        </div>
        <button className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest hover:underline">
          {t('viewFullSchedule')}
        </button>
      </div>
    </div>
  );
}
