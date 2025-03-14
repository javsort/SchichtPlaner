// src/context/LanguageContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import en from '../dictionary/en.json';
import de from '../dictionary/de.json';

type Language = 'en' | 'de';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Translation function: selects the appropriate dictionary based on language.
  const t = (key: string): string => {
    const dict = language === 'en' ? en : de;
    return dict[key] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
