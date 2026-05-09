import { CloudRain, Wind, ThermometerSun, MapPin, CalendarDays, Loader2, CloudLightning, Sun, Droplets, Umbrella } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { useEffect, useState, type ComponentProps } from 'react';
import Markdown from 'react-markdown';
import { useUser } from '../contexts/UserContext';
import { postAi } from '../lib/aiClient';
import { useLanguage } from '../contexts/LanguageContext';

export function Weather() {
  const { location, requestLocation } = useLocation();
  const { user } = useUser();
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [advisory, setAdvisory] = useState<string | null>(null);
  const [advisoryLoading, setAdvisoryLoading] = useState(false);
  const [advisoryError, setAdvisoryError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      if (location.loading) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          latitude: String(location.lat),
          longitude: String(location.lng),
          current: [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'precipitation',
            'weathercode',
            'windspeed_10m',
            'winddirection_10m',
          ].join(','),
          daily: [
            'weathercode',
            'temperature_2m_max',
            'temperature_2m_min',
            'precipitation_sum',
            'precipitation_probability_max',
            'windspeed_10m_max',
          ].join(','),
          timezone: 'auto',
        });
        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
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

  const loadFarmWeatherAdvisory = async () => {
    setAdvisoryLoading(true);
    setAdvisoryError(null);
    try {
      const cur = data?.current;
      const daily = data?.daily;
      const summary = [
        `Location: ${location.city}, ${location.state}.`,
        cur &&
          `Now: ${cur.temperature_2m}°C (feels ${cur.apparent_temperature}°C), humidity ${cur.relative_humidity_2m}%, wind ${cur.windspeed_10m} km/h, code ${cur.weathercode}.`,
        daily?.time?.length &&
          `Next 7 days: max temps ${daily.temperature_2m_max?.slice(0, 7).map((t: number) => Math.round(t)).join(', ')}°C;`,
        daily?.precipitation_probability_max &&
          `rain chance peaks ${Math.max(...daily.precipitation_probability_max.slice(0, 7))}%.`,
      ]
        .filter(Boolean)
        .join(' ');

      const cropLine = user?.farmDetails?.primaryCrop
        ? `Primary crop: ${user.farmDetails.primaryCrop}. Soil: ${user.farmDetails.soilType || 'unknown'}.`
        : 'Crop not specified in profile; give general smallholder advice.';

      const text = [
        'Weather farm advisory',
        'Given this weather snapshot, write a short practical advisory for the farmer (irrigation, spraying windows, frost/heat, rain delays).',
        'Use Markdown with bullet points. Keep it under 180 words.',
        summary,
        cropLine,
      ].join('\n');

      const result = await postAi({ text });
      setAdvisory(result.trim());
    } catch (e: unknown) {
      setAdvisoryError(e instanceof Error ? e.message : 'Could not load advisory.');
    } finally {
      setAdvisoryLoading(false);
    }
  };

  const getWeatherIcon = (code: number, props: ComponentProps<typeof Sun>) => {
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
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  const current = data?.current;
  const daily = data?.daily;

  return (
    <div className="max-w-5xl mx-auto flex-1 w-full flex flex-col pt-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('weatherTitle')}</h1>
          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 flex-wrap">
            <MapPin className="w-4 h-4 shrink-0" /> {t('weatherLiveFrom')} {location.city}, {location.state}
            <button type="button" onClick={requestLocation} className="text-xs ml-1 text-brand-600 hover:underline">
              {t('updateLocation')}
            </button>
          </p>
        </div>
      </div>

      {current && (
        <div className="glass-panel p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-br from-blue-50/50 to-white dark:from-slate-900/80 dark:to-slate-900/40">
          <div className="flex items-center gap-6">
            {getWeatherIcon(current.weathercode, { className: 'w-24 h-24' })}
            <div>
              <div className="text-6xl font-black text-slate-900 dark:text-white mb-2">{current.temperature_2m}°C</div>
              <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">{getWeatherDesc(current.weathercode)}</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('feelsLike')} {current.apparent_temperature}°C · {t('humidityLabel')} {current.relative_humidity_2m}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-sm">
              <Wind className="w-6 h-6 text-teal-500 mb-2" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{t('windLabel')}</span>
              <span className="font-bold text-slate-900 dark:text-white">{current.windspeed_10m} km/h</span>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-sm">
              <ThermometerSun className="w-6 h-6 text-amber-500 mb-2" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{t('observedLabel')}</span>
              <span className="font-bold text-slate-900 dark:text-white text-center">
                {new Date(current.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-sm">
              <Droplets className="w-6 h-6 text-sky-500 mb-2" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{t('rainNowLabel')}</span>
              <span className="font-bold text-slate-900 dark:text-white">{current.precipitation} mm</span>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col items-center min-w-[120px] shadow-sm">
              <Umbrella className="w-6 h-6 text-indigo-500 mb-2" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{t('windDirLabel')}</span>
              <span className="font-bold text-slate-900 dark:text-white">{current.winddirection_10m}°</span>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel p-6 rounded-3xl mb-8 border border-brand-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('farmAgentTitle')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('farmAgentDesc')}
            </p>
          </div>
          <button
            type="button"
            onClick={loadFarmWeatherAdvisory}
            disabled={advisoryLoading || !current}
            className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-brand-500/25"
          >
            {advisoryLoading ? t('generatingAdvisory') : t('genAdvisory')}
          </button>
        </div>
        {advisoryError && <p className="text-sm text-red-600 dark:text-red-400">{advisoryError}</p>}
        {advisory && (
          <div className="markdown-body prose dark:prose-invert prose-sm max-w-none text-slate-700 dark:text-slate-300">
            <Markdown>{advisory}</Markdown>
          </div>
        )}
      </div>

      {daily && (
        <>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> {t('sevenDay')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {daily.time.map((timeStr: string, idx: number) => {
              const date = new Date(timeStr);
              const day = date.toLocaleDateString('en-US', { weekday: 'short' });
              const rainPct = daily.precipitation_probability_max?.[idx];
              const rainSum = daily.precipitation_sum?.[idx];
              return (
                <div key={timeStr} className="glass-panel p-4 rounded-2xl flex flex-col items-center">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 mb-2">{idx === 0 ? t('todayLabel') : day}</span>
                  {getWeatherIcon(daily.weathercode[idx], { className: 'w-10 h-10 mb-2' })}
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-lg">{Math.round(daily.temperature_2m_max[idx])}°</span>
                    <span className="font-medium text-slate-500 dark:text-slate-400 text-lg">{Math.round(daily.temperature_2m_min[idx])}°</span>
                  </div>
                  <span className="text-xs text-sky-600 dark:text-sky-400 mt-2 font-semibold">
                    {rainPct != null ? `${rainPct}% ${t('rainChance')}` : ''}
                    {rainSum != null && Number(rainSum) > 0 ? ` · ${rainSum} mm` : ''}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">Wind {Math.round(daily.windspeed_10m_max?.[idx] ?? 0)} km/h</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
