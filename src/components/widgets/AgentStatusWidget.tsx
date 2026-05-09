import { motion } from 'framer-motion';
import { Cpu, Zap, Activity } from 'lucide-react';

export function AgentStatusWidget() {
  const agents = [
    { name: 'Weather AI', status: 'Active', pulse: 'bg-emerald-500' },
    { name: 'Disease Scanner', status: 'Online', pulse: 'bg-emerald-500' },
    { name: 'Market Intel', status: 'Syncing', pulse: 'bg-amber-500' },
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden h-full flex flex-col group">
      <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 transition-opacity group-hover:opacity-10 dark:group-hover:opacity-20">
        <Cpu className="w-24 h-24 text-brand-600 dark:text-brand-400" />
      </div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-500/20 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center">
          <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">System Status</h2>
          <p className="text-xs text-brand-600 dark:text-brand-300 font-bold tracking-wide">3 AUTONOMOUS AGENTS</p>
        </div>
      </div>

      <div className="space-y-4 flex-1 relative z-10 mt-auto">
        {agents.map((agent, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{agent.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{agent.status}</span>
              <span className="relative flex h-2.5 w-2.5">
                {agent.status === 'Syncing' ? (
                  <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                ) : (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${agent.pulse}`}></span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
