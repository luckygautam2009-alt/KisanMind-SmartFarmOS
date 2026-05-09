import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { translations, resolveTranslations, TranslationKey } from '../lib/translations';

export type Language = keyof typeof translations;

interface LanguageContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('kisanmind_lang');
    if (stored && stored in translations) return stored as Language;
    return 'en';
  });

  const dict = useMemo(() => resolveTranslations(lang), [lang]);

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('kisanmind_lang', newLang);
  };

  const toggleLanguage = () => {
    setLang((prev) => {
      const newLang = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('kisanmind_lang', newLang);
      return newLang;
    });
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    if (['hi', 'mr', 'bn', 'pa', 'gu', 'ta', 'te', 'kn', 'ml'].includes(lang)) {
        document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    } else {
        document.body.style.fontFamily = '"Outfit", sans-serif';
    }
  }, [lang]);

  const t = useCallback((key: TranslationKey) => dict[key] ?? key, [dict]);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
