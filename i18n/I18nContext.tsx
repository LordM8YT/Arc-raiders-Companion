
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'no';

// Helper to access nested keys like 'header.title'
const getNestedTranslation = (obj: any, key: string): string | undefined => {
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('no'); // Default to Norwegian
  const [translations, setTranslations] = useState<Record<Language, any> | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enRes, noRes] = await Promise.all([
          fetch('./locales/en.json'),
          fetch('./locales/no.json')
        ]);
        if (!enRes.ok || !noRes.ok) {
            throw new Error(`Failed to fetch translation files: ${enRes.statusText}, ${noRes.statusText}`);
        }
        const enData = await enRes.json();
        const noData = await noRes.json();
        setTranslations({ en: enData, no: noData });
      } catch (error) {
        console.error("Could not load translation files:", error);
      }
    };
    fetchTranslations();
  }, []); // Empty dependency array ensures this runs only once on mount

  const t = (key: string, values?: Record<string, string | number>): string => {
    if (!translations) {
      return key; // Return key as fallback during loading
    }
    
    let translation = getNestedTranslation(translations[lang], key);
    if (translation === undefined) {
      // Fallback to English if key not found in current language
      translation = getNestedTranslation(translations.en, key);
      if (translation !== undefined) {
        console.warn(`Translation key "${key}" not found for language "${lang}". Falling back to English.`);
      }
    }

    if (translation === undefined) {
        console.warn(`Translation key "${key}" not found in any language.`);
        return key;
    }
    
    // Replace placeholders like {points}
    if (values) {
        Object.keys(values).forEach(placeholder => {
            translation = (translation as string).replace(`{${placeholder}}`, String(values[placeholder]));
        });
    }

    return translation;
  };

  // Do not render the app until translations are loaded to prevent a flash of untranslated content.
  if (!translations) {
    return null; 
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};