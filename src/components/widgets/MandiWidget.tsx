import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export function MandiWidget() {
  const prices = [
    { crop: 'Wheat (Sharbati)', price: 2450, trend: 'up', change: '+2.4%' },
    { crop: 'Soybean', price: 4200, trend: 'down', change: '-1.2%' },
    { crop: 'Mustard', price: 5100, trend: 'stable', change: '0.0%' },
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Live Mandi Intel
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800">Sehore Mandi</span>
      </div>

      <div className="flex-1 flex justify-center flex-col gap-3">
        {prices.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-200">{item.crop}</div>
              <div className="text-xs text-slate-500 font-semibold">₹{item.price} / quintal</div>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              item.trend === 'up' ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10' :
              item.trend === 'down' ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-400/10' :
              'text-slate-600 bg-slate-200 dark:text-slate-400 dark:bg-slate-800'
            }`}>
              {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {item.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
