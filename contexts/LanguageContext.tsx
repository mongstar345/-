import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Lang, type TranslationKey } from '../i18n/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ar',
  setLang: () => {},
  t: (key) => key,
  dir: 'rtl',
  isRTL: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('campus_lang');
    return (stored as Lang) || 'ar';
  });

  const isRTL = lang !== 'en';
  const dir = isRTL ? 'rtl' : 'ltr';

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('campus_lang', newLang);
  };

  // Sync dir on <html> element
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const t = (key: TranslationKey): string => {
    return (translations[lang] as Record<string, string>)[key] ?? (translations.ar as Record<string, string>)[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const LANGUAGE_OPTIONS: { code: Lang; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇮🇶' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'ku', label: 'Kurdish', nativeLabel: 'کوردی', flag: '🏳️' },
];
