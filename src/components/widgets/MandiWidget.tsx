import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, IndianRupee, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from '../../contexts/LocationContext';

export function MandiWidget() {
  const { location } = useLocation();
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMandi = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/mandi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: location.city, state: location.state })
        });
        const json = await res.json();
        if (json.data) setPrices(json.data.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMandi();
  }, [location.city, location.state]);

  return (
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Live Mandi Intel
        </h2>
        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 flex items-center gap-1">
           {loading ? <RefreshCw className="w-3 h-3 animate-spin"/> : null}
           {location.city || 'Nearby'}
        </span>
      </div>

      <div className="flex-1 flex justify-center flex-col gap-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
          ))
        ) : prices.length > 0 ? (
          prices.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-200">{item.crop}</div>
                <div className="text-xs text-slate-500 font-semibold">₹{item.price} / qtl</div>
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
          ))
        ) : (
          <div className="text-center py-4 text-xs text-slate-500 italic">No live data available</div>
        )}
      </div>
    </div>
  );
}
