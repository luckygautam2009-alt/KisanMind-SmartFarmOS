import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { LocationProvider } from './contexts/LocationContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <LocationProvider>
          <App />
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
