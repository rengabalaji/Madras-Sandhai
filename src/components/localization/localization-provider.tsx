
'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import ta from '@/locales/ta.json';

type Locale = 'en' | 'ta';

const translations = { en, ta };

// This function handles nested keys and placeholders.
const translate = (locale: Locale, key: string, options?: Record<string, string | number>): string => {
  const keys = key.split('.');
  let result: any = translations[locale];
  
  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) {
      // Fallback to English if key not found in current locale
      result = translations.en;
      for (const enK of keys) {
        result = result?.[enK];
        if (result === undefined) return key; // Return key if not found in English either
      }
      break;
    }
  }

  if (typeof result !== 'string') return key;

  if (options) {
    result = result.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
        return String(options[placeholder] ?? match);
    });
  }

  return result;
};


export interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'madras_sandhai_locale';

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (storedLocale && ['en', 'ta'].includes(storedLocale)) {
        setLocaleState(storedLocale);
      }
    } catch (error) {
      console.error('Failed to parse locale from localStorage', error);
      localStorage.removeItem(LOCALE_STORAGE_KEY);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  };

  const t = useCallback((key: string, options?: Record<string, string | number>) => {
    return translate(locale, key, options);
  }, [locale]);

  const value = {
    locale,
    setLocale,
    t,
  };

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
};
