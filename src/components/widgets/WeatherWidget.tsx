import { CloudRain, Droplets, Wind, ThermometerSun, AlertTriangle, RefreshCw, Sun, Cloud } from 'lucide-react';
import { useLocation } from '../../contexts/LocationContext';
import { useState, useEffect } from 'react';

export function WeatherWidget() {
  const { location } = useLocation();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.lat || !location.lng) return;
    
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`);
        const data = await res.json();
        setWeatherData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [location.lat, location.lng]);

  const t = weatherData?.current?.temperature_2m || '--';
  const h = weatherData?.current?.relative_humidity_2m || '--';
  const w = weatherData?.current?.wind_speed_10m || '--';
  const p = weatherData?.current?.precipitation !== undefined ? weatherData.current.precipitation : '--';

  const isRaining = weatherData?.current?.precipitation > 0;

  return (
    <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-blue-50/50 to-white dark:from-slate-900/90 dark:to-slate-900/60 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            {isRaining ? <CloudRain className="text-blue-500 w-5 h-5" /> : <Sun className="text-amber-500 w-5 h-5" />}
            Hyperlocal Weather
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            {location.loading || loading ? <RefreshCw className="w-3 h-3 animate-spin"/> : null} 
            {location.city ? `${location.city}, ${location.state}` : 'Waiting for GPS...'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold gap-1 flex items-start text-slate-900 dark:text-white">
            {t}<span className="text-lg text-slate-500 dark:text-slate-400 font-normal">°C</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">{p}mm Rain</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-white dark:bg-slate-950/50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Humidity</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1">{h}%</span>
        </div>
        <div className="bg-white dark:bg-slate-950/50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <Wind className="w-5 h-5 text-teal-500 dark:text-teal-400 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Wind</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1">{w} km/h</span>
        </div>
        <div className="bg-white dark:bg-slate-950/50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <ThermometerSun className="w-5 h-5 text-amber-500 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">UV Index</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white mt-1">High (7)</span>
        </div>
      </div>

      {isRaining ? (
        <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex gap-3 items-start shadow-sm">
          <div className="mt-0.5"><AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" /></div>
          <div>
            <h4 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">Alert</h4>
            <p className="text-xs text-red-900/70 dark:text-slate-300 mt-0.5 font-medium">Rainfall currently active. Delay pesticide spray immediately!</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 flex gap-3 items-start shadow-sm">
          <div className="mt-0.5"><Cloud className="w-4 h-4 text-brand-600 dark:text-brand-400" /></div>
          <div>
            <h4 className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-widest">Optimal Weather</h4>
            <p className="text-xs text-brand-900/70 dark:text-slate-300 mt-0.5 font-medium">Clear weather suitable for field activities today.</p>
          </div>
        </div>
      )}
    </div>
  );
}
