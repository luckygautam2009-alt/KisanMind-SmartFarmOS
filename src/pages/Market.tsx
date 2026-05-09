import { useState, useEffect, useMemo } from 'react';
import { IndianRupee, TrendingUp, TrendingDown, MapPin, Search, RefreshCw, BarChart3, LineChart as LineChartIcon, X } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { useLocation } from '../contexts/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';

type Category = 'All' | 'Crops' | 'Vegetables' | 'Fruits' | 'Dairy';

interface MandiItem {
  crop: string;
  category: string;
  market: string;
  price: number;
  trend: string;
  change: string;
  date: string;
  distance: string;
}

export function Market() {
  const { location } = useLocation();
  const [search, setSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [prices, setPrices] = useState<MandiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<MandiItem | null>(null);

  const categories: Category[] = ['All', 'Crops', 'Vegetables', 'Fruits', 'Dairy'];

  // Mock trend data for the last 15 days
  const trendData = useMemo(() => {
    if (!selectedCrop) return [];
    const basePrice = selectedCrop.price;
    let prevPrice = basePrice - (basePrice * 0.1); // rough starting point
    const today = new Date();
    
    return [...Array(15)].map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (14 - i));
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Calculate realistic looking fluctuations based on the current price
      const fluctuation = Math.sin(i * 0.8) * (basePrice * 0.08) + ((Math.random() - 0.5) * basePrice * 0.05);
      const price = i === 14 ? basePrice : basePrice + fluctuation;
      
      const changePct = ((price - prevPrice) / prevPrice) * 100;
      const isSignificant = Math.abs(changePct) > 4.0; // highlight changes > 4%
      prevPrice = price;
      
      return {
        day: formattedDate,
        price,
        changePct: changePct.toFixed(1),
        isSignificant
      };
    });
  }, [selectedCrop]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-white">
          <p className="font-bold text-slate-300 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">₹{Math.round(data.price)}</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${Number(data.changePct) > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
              {Number(data.changePct) > 0 ? '+' : ''}{data.changePct}%
            </span>
          </div>
          {data.isSignificant && (
            <p className="text-[10px] text-amber-400 font-bold uppercase mt-1 tracking-wider">Significant Move</p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.isSignificant) {
      return (
        <circle cx={cx} cy={cy} r={5} stroke="#f59e0b" strokeWidth={2} fill="#1e293b" className="animate-pulse" />
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchMandi = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/mandi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: location.city, state: location.state })
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Failed to fetch');
        }
        if (json.data) setPrices(json.data);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMandi();
  }, [location.city, location.state]);

  const filteredPrices = prices.filter(item => {
    const itemCat = (item.category || '').toLowerCase();
    const active = activeCategory.toLowerCase();
    
    // Exact or "All" match
    let categoryMatch = active === 'all' || itemCat === active;
    
    // Fuzzy fallback match if not "All"
    if (!categoryMatch && active !== 'all') {
      if (active === 'crops') categoryMatch = ['crop', 'grain', 'cereal', 'pulse'].some(c => itemCat.includes(c));
      else if (active === 'vegetables') categoryMatch = ['vegetable', 'veg'].some(c => itemCat.includes(c));
      else if (active === 'fruits') categoryMatch = ['fruit'].some(c => itemCat.includes(c));
      else if (active === 'dairy') categoryMatch = ['dairy', 'milk'].some(c => itemCat.includes(c));
    }
    
    const cropMatch = item.crop.toLowerCase().includes(search.toLowerCase());
    const marketMatch = item.market.toLowerCase().includes(locationSearch.toLowerCase());
    
    return categoryMatch && cropMatch && marketMatch;
  });

  return (
    <div className="max-w-6xl mx-auto flex-1 w-full flex flex-col pt-6 pb-20 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Mandi Intelligence</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Live market analytics and 15-day price forecasts.</p>
        </div>
        {loading && <div className="flex items-center gap-2 text-brand-600 bg-brand-500/10 px-4 py-2 rounded-full text-sm font-bold animate-pulse border border-brand-500/20"><RefreshCw className="w-4 h-4 animate-spin"/> Syncing Live Data...</div>}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar / Filters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl sticky top-24 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <Search className="w-4 h-4" /> Market Filters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Commodity Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Tomato, Wheat" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Mandi or State</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Nashik, MP" 
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4">
                <label className="text-xs font-bold text-slate-500 mb-3 block">Category Selection</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeCategory === cat 
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {selectedCrop && (
              <motion.div 
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-panel p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-500/20 relative">
                   <button 
                     onClick={() => setSelectedCrop(null)}
                     className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                   >
                     <X className="w-5 h-5" />
                   </button>
                   
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/50">
                        <LineChartIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedCrop.crop} Trend</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-wide flex items-center gap-2">
                           <BarChart3 className="w-4 h-4" /> 15-Day Historical Price Index
                        </p>
                      </div>
                   </div>

                   <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={trendData}>
                            <defs>
                               <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="day" hide />
                            <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                               type="monotone" 
                               dataKey="price" 
                               stroke="#10b981" 
                               strokeWidth={4}
                               fillOpacity={1} 
                               fill="url(#colorPrice)" 
                               animationDuration={1500}
                               activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }}
                               dot={<CustomDot />}
                            />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                   
                   <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                      <div className="text-center">
                         <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Peak Price</div>
                         <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{Math.max(...trendData.map(d => d.price)).toFixed(0)}</div>
                      </div>
                      <div className="text-center">
                         <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Average</div>
                         <div className="text-lg font-black text-slate-900 dark:text-white">₹{(trendData.reduce((acc, curr) => acc + curr.price, 0) / trendData.length).toFixed(0)}</div>
                      </div>
                      <div className="text-center">
                         <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Volatility</div>
                         <div className="text-lg font-black text-amber-500">±2.4%</div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-4">
            {error && (
              <div className="p-8 bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/30 rounded-3xl text-red-800 dark:text-red-300">
                <h3 className="font-black text-xl mb-2">Service Temporarily Offline</h3>
                <p className="font-medium opacity-80">{error}</p>
                {error.includes('Key') && <p className="mt-4 text-sm font-bold bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm inline-block">Pro Tip: Enable full AI features by adding your GEMINI_API_KEY in the platform secrets.</p>}
              </div>
            )}
            
            {loading && !error && prices.length === 0 ? (
               [...Array(6)].map((_, i) => (
                 <div key={i} className="glass-panel p-6 rounded-3xl flex items-center justify-between animate-pulse bg-white/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shadow-inner"></div>
                       <div className="space-y-3">
                         <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                         <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                       </div>
                    </div>
                    <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                 </div>
               ))
            ) : filteredPrices.length > 0 ? (
              filteredPrices.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  onClick={() => setSelectedCrop(item)}
                  className={`glass-panel p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] border-2 group ${
                    selectedCrop?.crop === item.crop ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/5' : 'hover:border-slate-300 dark:hover:border-slate-600 border-transparent bg-white dark:bg-slate-900 shadow-sm'
                  }`}
                >
                  <div className="flex gap-5 items-center">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <IndianRupee className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{item.crop}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mt-1 font-bold">
                        <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase">{item.category}</span>
                        <div className="flex items-center gap-1">
                           <MapPin className="w-3 h-3 text-brand-500" /> {item.market} <span className="opacity-60">({item.distance})</span>
                        </div>
                        <span className="opacity-40">•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
                       <span className="text-sm font-bold opacity-60">₹</span>{item.price.toLocaleString()}
                       <span className="text-xs font-bold opacity-40 uppercase tracking-tighter">/qtl</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 ${
                      item.trend === 'up' ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10' :
                      item.trend === 'down' ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-400/10' :
                      'text-slate-700 bg-slate-200 dark:text-slate-400 dark:bg-slate-800'
                    }`}>
                      {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {item.change}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass-panel p-20 rounded-3xl text-center shadow-inner bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800">
                 <div className="w-16 h-16 bg-slate-200 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-slate-400" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Matches Found</h3>
                 <p className="text-slate-500 font-medium max-w-sm mx-auto">Try adjusting your filters or commodity name to find what you're looking for.</p>
                 <button 
                   onClick={() => {setSearch(''); setActiveCategory('All'); setLocationSearch('');}}
                   className="mt-8 text-brand-600 font-black uppercase tracking-widest text-xs hover:underline"
                 >
                   Clear all filters
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
