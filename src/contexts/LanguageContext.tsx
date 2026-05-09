import { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKey } from '../lib/translations';

type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'bn' | 'pa' | 'kn' | 'ml';

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
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('kisanmind_lang') as Language) || 'en');

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

  const t = (key: TranslationKey): string => {
    return (translations[lang] && translations[lang][key as string]) || translations['en']?.[key as string] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
