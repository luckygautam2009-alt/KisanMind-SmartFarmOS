import { BrainCircuit, Tractor, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

export function AlertsWidget() {
  const alerts = [
    { 
      agent: 'Planning AI', 
      title: 'Optimal Harvesting Window', 
      message: 'Based on moisture levels, harvest wheat between Thursday and Saturday.',
      icon: Tractor,
      color: 'text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-400/10 border-brand-200 dark:border-brand-400/20'
    },
    { 
      agent: 'Disease AI', 
      title: 'High Risk: Rust Disease', 
      message: 'Neighboring farms reported Yellow Rust. Preventative spray recommended within 48hrs.',
      icon: Sprout,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20'
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Kisan Intelligence
        </h2>
        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">2 New</span>
      </div>

      <div className="flex-1 space-y-3">
        {alerts.map((alert, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-2xl border ${alert.color} bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm relative overflow-hidden group hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-current opacity-5 blur-2xl rounded-full -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`}></div>
            <div className="flex gap-3 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${alert.color.split(' ')[0]} ${alert.color.split(' ')[1]} ${alert.color.split(' ')[2]}`}>
                <alert.icon className="w-4 h-4 text-current" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 block">{alert.agent}</span>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">{alert.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{alert.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
