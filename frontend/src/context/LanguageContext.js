import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations } from '../translations';
import { getPathLanguage, isLocalizablePath, localizePath } from '../lib/i18nRouting';

const LanguageContext = createContext();
const LANGUAGE_STORAGE_KEY = 'lang';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [preferredLanguage, setPreferredLanguage] = useState(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
    const browserLang = navigator.language.slice(0, 2);
    return browserLang === 'fr' ? 'fr' : 'en';
  });
  const routeLanguage = getPathLanguage(location.pathname);
  const language = routeLanguage || (isLocalizablePath(location.pathname) ? 'en' : preferredLanguage);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language === 'fr' ? 'fr-CA' : 'en';
  }, [language]);

  useEffect(() => {
    if (routeLanguage) {
      setPreferredLanguage(routeLanguage);
    }
  }, [routeLanguage]);

  const setLanguage = (nextLanguage, options = {}) => {
    if (nextLanguage !== 'en' && nextLanguage !== 'fr') {
      return;
    }

    setPreferredLanguage(nextLanguage);

    const shouldNavigate = options.navigate !== false && (routeLanguage || isLocalizablePath(location.pathname));
    if (!shouldNavigate) {
      return;
    }

    const currentPath = `${location.pathname}${location.search}${location.hash}`;
    const nextPath = localizePath(currentPath, nextLanguage, { force: Boolean(routeLanguage) || isLocalizablePath(location.pathname) });

    if (nextPath !== currentPath) {
      navigate(nextPath, { replace: options.replace ?? false });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const localizedPath = useMemo(
    () => (value, options) => localizePath(value, language, options),
    [language]
  );

  const t = mergeTranslations(translations.en, translations[language] || translations.en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, localizedPath, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
