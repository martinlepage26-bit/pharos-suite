import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

const mergeTranslations = (base, override) => {
  if (Array.isArray(base)) {
    if (!Array.isArray(override)) return base;

    return base.map((item, index) => {
      const next = override[index];

      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return mergeTranslations(item, next || {});
      }

      return next ?? item;
    });
  }

  if (base && typeof base === 'object') {
    return Object.keys(base).reduce((accumulator, key) => {
      accumulator[key] = mergeTranslations(base[key], override?.[key]);
      return accumulator;
    }, {});
  }

  return override ?? base;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('lang');
    if (saved) return saved;
    const browserLang = navigator.language.slice(0, 2);
    return browserLang === 'fr' ? 'fr' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const t = mergeTranslations(translations.en, translations[language] || translations.en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
