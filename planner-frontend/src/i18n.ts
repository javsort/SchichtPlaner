// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Import your translation JSON files
import en from "./dictionary/en.json";
import de from "./dictionary/de.json";

const resources = {
  en: { translation: en },
  de: { translation: de },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for React
    },
    // Optionally specify default namespace if using multiple files
    defaultNS: "translation",
  });

export default i18n;
