'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { defaultLocale, isRTL } from '@/i18n/config';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, Record<string, string>>;
  t: (section: string, key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, Record<string, string>>>({});

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('bhumisetu-locale', newLocale);
    } catch (e) {
      // Ignore if localStorage is blocked
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bhumisetu-locale') as Locale | null;
      if (saved) setLocaleState(saved);
    } catch (e) {
      // Ignore if localStorage is blocked
    }
  }, []);

  useEffect(() => {
    import(`@/i18n/locales/${locale}.json`)
      .then((mod) => setMessages(mod.default))
      .catch(() =>
        import(`@/i18n/locales/en.json`).then((mod) => setMessages(mod.default))
      );
  }, [locale]);

  const t = (section: string, key: string): string => {
    const sectionData = messages[section] as Record<string, string> | undefined;
    return sectionData?.[key] ?? key;
  };

  const dir = isRTL(locale) ? 'rtl' : 'ltr';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages, t, dir }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
