import { ScanLine, UploadCloud, RefreshCw, X, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useUser } from '../contexts/UserContext';
import { postAi } from '../lib/aiClient';
import { useLanguage } from '../contexts/LanguageContext';

function extractScanFields(markdown: string): { disease?: string; confidence?: string } {
  const disease =
    markdown.match(/\*\*Detected Disease\/Pest\*\*[:\s]*\*?\*?([^*\n]+)/i)?.[1]?.trim() ||
    markdown.match(/(?:disease|diagnosis)[:\s]+([^\n#]+)/i)?.[1]?.trim();
  const confidence =
    markdown.match(/\*\*Confidence[^*]*\*\*[:\s]*([^\n]+)/i)?.[1]?.trim() ||
    markdown.match(/confidence\s*(?:score)?[:\s]+([^\n]+)/i)?.[1]?.trim();
  return { disease: disease || undefined, confidence: confidence || undefined };
}

interface RecentScan {
  id: string;
  image: string;
  result: string;
  date: string;
  title: string;
}

export function Scan() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { scanHistory, saveScan, deleteScan } = useUser();
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractTitleFromMarkdown = (md: string) => {
    const match = md.match(/^#+\s+(.*)/m);
    if (match && match[1]) {
       // Return first heading, stripped of markdown
       return match[1].replace(/[*_~`]/g, '').slice(0, 40);
    }
    return t('cropScanResults');
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = [
        'Analyze the uploaded crop leaf or plant image.',
        'Identify crop health, probable diseases, pests, or nutrient issues.',
        'Give a confidence assessment, severity, recommended pesticides and fertilizers where applicable,',
        'and a short actionable treatment plan.',
        'Respond in clear Markdown with headings (use "### Fertilizer Recommendations" for nutrient section).',
      ].join(' ');

      const aiMarkdown = await postAi({
        text: prompt,
        imageBase64: image,
      });

      const trimmed = aiMarkdown.trim();
      setResult(trimmed);

      const { disease, confidence } = extractScanFields(trimmed);
      await saveScan({
        title: extractTitleFromMarkdown(trimmed),
        result: trimmed,
        imageBase64: image,
        date: new Date().toISOString(),
        confidence: confidence || undefined,
        disease: disease || undefined,
      });

    } catch (e: any) {
      console.error(e);
      setResult(`**Error processing image.**\n\n${e.message}\n\n*Tip: Run the app with \`npm run dev\` so the API server is available on the same origin, and optionally set \`GEMINI_API_KEY\` for live vision analysis.*`);
    } finally {
      setLoading(false);
    }
  };

  const clearScan = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadReport = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Crop_Analysis_Report_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto flex-1 w-full flex flex-col pt-6 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('scanTitle')}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t('scanSubtitle')}</p>
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 min-h-[400px] glass-panel rounded-3xl border-dashed border-2 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-brand-500/50 transition-colors"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <div className="absolute inset-0 bg-brand-500/5 dark:bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="z-10 flex flex-col items-center p-8 text-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 shadow-xl shadow-brand-500/10">
              <UploadCloud className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('uploadCropImage')}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">{t('uploadCropHint')}</p>
            
            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl text-left border border-slate-200 dark:border-slate-700/50 w-full max-w-md mb-8">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-brand-500" /> {t('photoGuidance')}
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 ml-6 list-disc marker:text-brand-500">
                <li>{t('pg1')}</li>
                <li>{t('pg2')}</li>
                <li>{t('pg3')}</li>
                <li>{t('pg4')}</li>
              </ul>
            </div>

            <button className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-full shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2 pointer-events-auto">
              <UploadCloud className="w-5 h-5" /> {t('selectImage')}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-4 rounded-3xl relative">
            <button onClick={clearScan} className="absolute top-6 right-6 bg-slate-900/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <img src={image} className="w-full max-h-[400px] object-cover rounded-2xl" alt="Crop for scan" />
            
             <div className="mt-4 flex justify-center">
               <button 
                  onClick={handleScan}
                  disabled={loading}
                  className="px-8 py-3 bg-brand-600 hover:bg-brand-500 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:bg-slate-400 text-white font-bold rounded-full shadow-xl shadow-brand-500/30 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> {t('scanningAI')}</>
                  ) : (
                    <><ScanLine className="w-5 h-5" /> {t('analyzeCrop')}</>
                  )}
               </button>
             </div>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} 
              className="glass-panel p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-l-4 border-l-brand-500 shadow-lg flex flex-col gap-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('diagnosisTitle')}</h3>
                <button 
                  onClick={downloadReport} 
                  className="text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  {t('downloadReport')}
                </button>
              </div>
              <div className="markdown-body prose dark:prose-invert prose-brand max-w-none text-slate-700 dark:text-slate-300">
                {(() => {
                  const fertilizerMatch = result.match(/(#{2,3})\s*(?:[^\w\s]*\s*)?Fertilizer Recommendations?/i);
                  if (!fertilizerMatch) {
                    return <Markdown>{result}</Markdown>;
                  }

                  const parts = result.split(fertilizerMatch[0]);
                  const beforeText = parts[0];
                  
                  let fertilizerText = parts[1] || '';
                  let afterText = '';

                  const nextHeadingMatch = fertilizerText.match(/\n#{1,3}\s/);
                  if (nextHeadingMatch && nextHeadingMatch.index !== undefined) {
                    afterText = fertilizerText.substring(nextHeadingMatch.index);
                    fertilizerText = fertilizerText.substring(0, nextHeadingMatch.index);
                  }

                  return (
                    <>
                      <Markdown>{beforeText}</Markdown>
                      
                      <div className="not-prose bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500/30 p-6 sm:p-8 rounded-3xl my-8 shadow-lg shadow-emerald-500/10">
                        <h3 className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-400 mb-6 flex items-center gap-3 border-b-2 border-emerald-200 dark:border-emerald-800/50 pb-4">
                          <span className="text-2xl">🌿</span> Nutrient & Fertilizer Plan
                        </h3>
                        <div className="prose dark:prose-invert prose-emerald max-w-none text-emerald-900 dark:text-emerald-200 marker:text-emerald-500">
                          <Markdown>{fertilizerText}</Markdown>
                        </div>
                      </div>

                      <Markdown>{afterText}</Markdown>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {!result && !image && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-brand-500" /> {t('scanHistory')}
            {scanHistory.length > 0 && (
              <span className="ml-auto text-xs font-bold px-2 py-1 bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-full">
                ☁️ {scanHistory.length} {t('savedToCloud')}
              </span>
            )}
          </h3>
          
          {scanHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scanHistory.slice(0, 6).map((scan) => (
                <div 
                  key={scan.id} 
                  className="glass-panel p-3 rounded-2xl cursor-pointer hover:border-brand-500/50 transition-all flex flex-col gap-3 group bg-white/50 dark:bg-slate-900/50 relative"
                >
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative"
                    onClick={() => {
                      if (scan.imageBase64) setImage(scan.imageBase64);
                      setResult(scan.result);
                    }}
                  >
                    {scan.imageBase64 ? (
                      <img src={scan.imageBase64} alt={scan.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ScanLine className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-xs font-medium bg-brand-500/80 px-2 py-1 rounded backdrop-blur-sm">{t('viewReport')}</span>
                    </div>
                  </div>
                  <div className="px-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate flex-1" title={scan.title}>{scan.title}</h4>
                      {scan.id && (
                        <button
                          onClick={() => scan.id && deleteScan(scan.id)}
                          className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                          title={t('deleteScanTitle')}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {scan.disease && (
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{scan.disease} · {scan.confidence}</span>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {new Date(scan.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-2">
                <ScanLine className="w-4 h-4" /> {t('noScansYet')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
