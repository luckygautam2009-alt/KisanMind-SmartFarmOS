import { CloudRain, Wind, ThermometerSun, MapPin, CalendarDays, Loader2, CloudLightning, Sun } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { useEffect, useState } from 'react';

export function Weather() {
  const { location, requestLocation } = useLocation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      if (location.loading) return;
      setLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [location.lat, location.lng, location.loading]);

  const getWeatherIcon = (code: number, props: any) => {
    if (code === 0 || code === 1) return <Sun {...props} className={`${props.className} text-amber-500`} />;
    if (code < 40) return <ThermometerSun {...props} className={`${props.className} text-amber-400`} />;
    if (code < 70) return <CloudRain {...props} className={`${props.className} text-blue-500`} />;
    if (code >= 95) return <CloudLightning {...props} className={`${props.className} text-purple-500`} />;
    return <CloudRain {...props} className={`${props.className} text-slate-500`} />;
  };

  const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rain Showers';
    if (code >= 71 && code <= 82) return 'Snow Showers';
    if (code >= 95) return 'Thunderstorms';
    return 'Cloudy';
  };

  if (loading || location.loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-500" /></div>;
  }

  const current = data?.current_weather;
  const daily = data?.daily;

  return (
    <div className="max-w-5xl mx-auto flex-1 w-full flex flex-col pt-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Weather & Risks</h1>
          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Live from {location.city}, {location.state}
            <button onClick={requestLocation} className="text-xs ml-2 text-brand-600 hover:underline">Update Location</button>
          </p>
        </div>
      </div>

      {current && (
        <div className="glass-panel p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-br from-blue-50/50 to-white dark:from-slate-900/80 dark:to-slate-900/40">
          <div className="flex items-center gap-6">
            {getWeatherIcon(current.weathercode, { className: "w-24 h-24" })}
            <div>
              <div className="text-6xl font-black text-slate-900 dark:text-white mb-2">{current.temperature}°C</div>
              <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">{getWeatherDesc(current.weathercode)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-sm">
              <Wind className="w-6 h-6 text-teal-500 mb-2" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Wind</span>
              <span className="font-bold text-slate-900 dark:text-white">{current.windspeed} km/h</span>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-sm">
              <ThermometerSun className="w-6 h-6 text-amber-500 mb-2" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Time</span>
              <span className="font-bold text-slate-900 dark:text-white">{new Date(current.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
        </div>
      )}

      {daily && (
        <>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> 7-Day Forecast
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {daily.time.map((timeStr: string, idx: number) => {
              const date = new Date(timeStr);
              const day = date.toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <div key={timeStr} className="glass-panel p-4 rounded-2xl flex flex-col items-center">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 mb-2">{idx === 0 ? 'Today' : day}</span>
                  {getWeatherIcon(daily.weathercode[idx], { className: "w-8 h-8 mb-2" })}
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-lg">{Math.round(daily.temperature_2m_max[idx])}°</span>
                    <span className="font-medium text-slate-500 dark:text-slate-400 text-lg">{Math.round(daily.temperature_2m_min[idx])}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
