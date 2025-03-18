// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import moment from "moment";

// Import your translation JSON files
import en from "./dictionary/en.json";
import de from "./dictionary/de.json";

const resources = {
  en: { translation: en },
  de: { translation: de },
};

// Force Monday start for English
moment.updateLocale("en", {
  week: { dow: 1, doy: 4 },
});

// Force Monday start for German
moment.updateLocale("de", {
  week: { dow: 1, doy: 4 },
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    defaultNS: "translation",
  });

export default i18n;
