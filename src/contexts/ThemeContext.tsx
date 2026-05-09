import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
type ColorSchema = 'emerald' | 'blue' | 'orange' | 'purple';
type FontSchema = 'outfit' | 'inter' | 'sans';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  color: ColorSchema;
  setColor: (c: ColorSchema) => void;
  font: FontSchema;
  setFont: (f: FontSchema) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  color: 'emerald',
  setColor: () => {},
  font: 'outfit',
  setFont: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('kisanmind_theme') as Theme) || 'dark');
  const [color, setColor] = useState<ColorSchema>(() => (localStorage.getItem('kisanmind_color') as ColorSchema) || 'emerald');
  const [font, setFont] = useState<FontSchema>(() => (localStorage.getItem('kisanmind_font') as FontSchema) || 'outfit');

  useEffect(() => {
    localStorage.setItem('kisanmind_theme', theme);
    localStorage.setItem('kisanmind_color', color);
    localStorage.setItem('kisanmind_font', font);

    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'theme-emerald', 'theme-blue', 'theme-orange', 'theme-purple', 'font-outfit', 'font-inter', 'font-sans');
    root.classList.add(theme);
    root.classList.add(`theme-${color}`);
    root.classList.add(`font-${font}`);
  }, [theme, color, font]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, color, setColor, font, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
