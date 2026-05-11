import { Calendar, UploadCloud, RefreshCw, X, Download, TrendingUp, Send, Bot, BookmarkPlus, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown';
import { useLocation } from '../contexts/LocationContext';
import { YieldPredictionWidget } from '../components/widgets/YieldPredictionWidget';
import { useUser } from '../contexts/UserContext';
import { postAi } from '../lib/aiClient';
import { useLanguage } from '../contexts/LanguageContext';
import { SAMPLE_CROP_REPORT, SAMPLE_FARM_TIMETABLE } from '../lib/sampleFarmPlan';

async function fetchWeatherSnippet(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=precipitation_probability_max,precipitation_sum&timezone=auto&forecast_days=4`;
    const res = await fetch(url);
    const j = await res.json();
    const t = j?.current_weather?.temperature;
    const probs: number[] = j?.daily?.precipitation_probability_max?.slice(0, 4) || [];
    const rainBits = probs.length ? `Next days rain chance (max %): ${probs.join(', ')}.` : '';
    return [`Approx. current temperature: ${t ?? 'n/a'}°C.`, rainBits].filter(Boolean).join(' ');
  } catch {
    return '';
  }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import { FarmTimetableWidget } from '../components/widgets/FarmTimetableWidget';

export function Planner() {
  const [reportText, setReportText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [schedule, setSchedule] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [savingPlan, setSavingPlan] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { location } = useLocation();
  const { firebaseUser, timetables, saveTimetable, user } = useUser();
  const { t } = useLanguage();

  const scheduleDayBlocks = useMemo(() => {
    if (!schedule) return [];
    return schedule.split(/\n(?=###\s*Day)/).filter((b) => /^###\s*Day/i.test(b.trim()));
  }, [schedule]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportText(reader.result as string);
        setSchedule(null);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = async () => {
    if (!reportText) return;
    setLoading(true);
    setSchedule(null);
    setMessages([]);
    try {
      const weatherHint = await fetchWeatherSnippet(location.lat, location.lng);
      const farmBits = [
        user?.farmDetails?.primaryCrop && `Primary crop: ${user.farmDetails.primaryCrop}`,
        user?.farmDetails?.soilType && `Soil type: ${user.farmDetails.soilType}`,
      ].filter(Boolean).join('. ');

      const promptSections = [
        'Timetable',
        'Generate a practical 7-day precision farm Timetable in Markdown based on the crop analysis report below.',
        `Location context: ${location.city || 'Unknown'}, ${location.state || ''}.`,
      ];
      if (weatherHint) promptSections.push(`Weather context: ${weatherHint}`);
      if (farmBits) promptSections.push(`Farm profile: ${farmBits}`);
      promptSections.push(
        '',
        '--- REPORT START ---',
        reportText,
        '--- REPORT END ---',
        '',
        'Requirements:',
        '- Output Markdown only.',
        '- Start with one title line like "# 7-Day Farm Timetable".',
        '- For each day use exactly: ### Day N: Short descriptive title (N from 1 to 7).',
        '- Under each day use bullet lines starting with "-" for tasks.',
        '- Where helpful include times like **06:00 AM - 07:00 AM:** before task labels.',
        '- Include watering (💧), fertilizer (🧪), pest/disease control (🛡️), and monitoring tasks when relevant.',
      );
      const prompt = promptSections.join('\n');

      const aiSchedule = await postAi({ text: prompt });
      setSchedule(aiSchedule.trim());
    } catch (e: any) {
      console.error(e);
      setSchedule(`**Error generating schedule.**\n\n${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const extractTimetableTitle = (md: string) => {
    const m = md.match(/^#\s+(.+)/m);
    return (m?.[1] || 'Saved farm timetable').replace(/[*_]/g, '').slice(0, 80);
  };

  const handleSaveTimetable = async () => {
    if (!schedule || !firebaseUser) return;
    setSavingPlan(true);
    try {
      await saveTimetable({
        title: extractTimetableTitle(schedule),
        content: schedule,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setSavingPlan(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !schedule || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const prompt = [
        'You help farmers follow their AI-generated timetable.',
        'Here is their current timetable:',
        '---',
        schedule,
        '---',
        `Farmer question: ${userMessage}`,
        'Answer in concise Markdown. Reference specific days or times from the timetable when useful.',
      ].join('\n');

      const reply = await postAi({ text: prompt });
      setMessages(prev => [...prev, { role: 'assistant', content: reply.trim() }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `**Error:** ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const clearFile = () => {
    setReportText(null);
    setFileName(null);
    setSchedule(null);
    setMessages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto flex-1 w-full flex flex-col pt-6 pb-12 gap-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('plannerTitle')}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t('plannerSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <YieldPredictionWidget />
        </div>
        <div className="md:col-span-1">
          <FarmTimetableWidget />
        </div>
      </div>


      <div className="mt-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t('genTimetable')}</h2>
        <p className="text-slate-500 text-sm mb-3">{t('genTimetableDesc')}</p>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => {
              setReportText(SAMPLE_CROP_REPORT);
              setFileName('sample-report.md');
              setSchedule(null);
              setMessages([]);
            }}
            className="px-4 py-2 rounded-full text-sm font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors"
          >
            {t('loadSampleReport')}
          </button>
          <button
            type="button"
            onClick={() => {
              setSchedule(SAMPLE_FARM_TIMETABLE.trim());
              setMessages([]);
            }}
            className="px-4 py-2 rounded-full text-sm font-bold bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-500/25 transition-colors"
          >
            {t('loadDemoTimetable')}
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-6">{t('demoPlanHint')}</p>

        {firebaseUser && timetables.length > 0 && (
          <div className="glass-panel p-4 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-brand-500" /> {t('savedPlans')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {timetables.slice(0, 8).map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    setSchedule(plan.content);
                    setMessages([]);
                  }}
                  className="text-left px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[220px] truncate"
                  title={plan.title}
                >
                  {plan.title}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {!reportText ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="glass-panel p-12 rounded-3xl border-dashed border-2 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-brand-500/50 transition-colors"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".md,.txt,.json" className="hidden" />
            <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 shadow-xl shadow-brand-500/10">
              <Calendar className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('uploadReportTitle')}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 text-center">{t('uploadReportHint')}</p>
            
            <button className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-full shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2">
              <UploadCloud className="w-5 h-5" /> {t('selectReportFile')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-3xl relative flex items-center justify-between border border-brand-200 dark:border-brand-800">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{fileName}</h4>
                    <p className="text-xs text-slate-500">{t('reportLoaded')}</p>
                  </div>
               </div>
               <button onClick={clearFile} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>

            {!schedule && (
              <div className="flex justify-center mt-2">
                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-8 py-3 bg-brand-600 hover:bg-brand-500 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 text-white font-bold rounded-full shadow-xl shadow-brand-500/30 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> {t('generatingPlan')}</>
                  ) : (
                    <><Calendar className="w-5 h-5" /> {t('genActionPlan')}</>
                  )}
                </button>
              </div>
            )}

            {schedule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }} 
                className="rounded-3xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t('timetableHeading')}</h3>
                    <p className="text-sm text-brand-500 dark:text-brand-400 font-semibold">{t('timetableAIByline')}</p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full">💧 {t('legendWater')}</span>
                  <span className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full">🧪 {t('legendFert')}</span>
                  <span className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded-full">🛡️ {t('legendPest')}</span>
                  <span className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full">👁️ {t('legendMonitor')}</span>
                </div>

                {/* Day Cards */}
                <div className="space-y-4">
                  {scheduleDayBlocks.length === 0 && (
                    <div className="glass-panel p-6 rounded-2xl markdown-body prose dark:prose-invert max-w-none">
                      <Markdown>{schedule}</Markdown>
                    </div>
                  )}
                  {scheduleDayBlocks.map((dayBlock, dayIndex) => {
                    const titleMatch = dayBlock.match(/###\s*(Day\s*[\d\-–]+[^:\n]*):?\s*([^\n]*)/i);
                    if (!titleMatch) return null;

                    const dayLabel = titleMatch[1].trim();
                    const dayTitle = titleMatch[2].trim();
                    const tasks = dayBlock
                      .split('\n')
                      .filter(l => l.trim().startsWith('-'))
                      .map(l => l.replace(/^-\s*/, '').trim());

                    const getTaskStyle = (task: string) => {
                      if (/💧|water/i.test(task)) return { bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30', badge: 'bg-blue-500', time: 'text-blue-600 dark:text-blue-400' };
                      if (/🧪|fertilizer|NPK|Urea|Potassium/i.test(task)) return { bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30', badge: 'bg-emerald-500', time: 'text-emerald-600 dark:text-emerald-400' };
                      if (/🛡️|pest|fungicide|spray|neem/i.test(task)) return { bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30', badge: 'bg-red-500', time: 'text-red-600 dark:text-red-400' };
                      return { bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30', badge: 'bg-amber-500', time: 'text-amber-600 dark:text-amber-400' };
                    };

                    const dayColors = ['from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-purple-500 to-pink-600', 'from-rose-500 to-red-600', 'from-teal-500 to-cyan-600', 'from-brand-500 to-brand-700'];
                    const gradientColor = dayColors[dayIndex % dayColors.length];

                    return (
                      <motion.div
                        key={dayIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: dayIndex * 0.08 }}
                        className="glass-panel border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden"
                      >
                        {/* Day Header */}
                        <div className={`bg-gradient-to-r ${gradientColor} px-6 py-4 flex items-center justify-between`}>
                          <div>
                            <span className="text-white/70 text-xs font-bold uppercase tracking-widest">{dayLabel}</span>
                            <h4 className="text-white font-extrabold text-lg leading-tight">{dayTitle || t('actionDayFallback')}</h4>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-lg">
                            {dayIndex + 1}
                          </div>
                        </div>

                        {/* Tasks */}
                        <div className="p-4 space-y-3">
                          {tasks.length > 0 ? tasks.map((task, taskIndex) => {
                            const style = getTaskStyle(task);
                            // Extract time from bold text like **06:00 AM - 07:00 AM:**
                            const timeMatch = task.match(/\*\*([^*]+)\*\*/);
                            const timeLabel = timeMatch ? timeMatch[1] : null;
                            const taskBody = task.replace(/\*\*[^*]+\*\*:?\s*/, '').trim();

                            return (
                              <div key={taskIndex} className={`flex items-start gap-3 p-4 rounded-xl border ${style.bg} transition-all`}>
                                <div className={`w-2 h-2 rounded-full ${style.badge} mt-2 flex-shrink-0`}></div>
                                <div className="flex-1 min-w-0">
                                  {timeLabel && (
                                    <span className={`text-xs font-black uppercase tracking-wide ${style.time} block mb-1`}>
                                      ⏰ {timeLabel}
                                    </span>
                                  )}
                                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: taskBody.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }}
                                  />
                                </div>
                              </div>
                            );
                          }) : (
                            <p className="text-sm text-slate-400 italic px-2">{t('plannerContinueMonitoring')}</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {firebaseUser && scheduleDayBlocks.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={handleSaveTimetable}
                      disabled={savingPlan}
                      className="px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                    >
                      {savingPlan ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BookmarkPlus className="w-4 h-4" />}
                      {t('savePlanCloud')}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {schedule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 glass-panel p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-brand-500/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{t('plannerAssistTitle')}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{t('plannerAssistSub')}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {messages.length === 0 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                      <p className="text-sm text-slate-500 font-medium italic">{t('plannerChatEmpty')}</p>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-brand-600 text-white rounded-tr-none' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                      }`}>
                        {m.role === 'assistant' ? (
                          <div className="markdown-body prose dark:prose-invert prose-sm max-w-none">
                            <Markdown>{m.content}</Markdown>
                          </div>
                        ) : (
                          <p className="text-sm font-medium">{m.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-brand-500" />
                        <span className="text-xs font-bold text-slate-500">{t('plannerThinking')}</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleChatSubmit} className="relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t('plannerChatPh')}
                    className="w-full pl-6 pr-16 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-brand-500 transition-all font-medium text-slate-900 dark:text-white"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || chatLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
