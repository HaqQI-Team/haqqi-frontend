import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

const LANGUAGE_KEY = "haqqi-language";
const DEFAULT_LANGUAGE = "en";
const supportedLanguages = ["en", "ar"];

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_KEY);

  return supportedLanguages.includes(storedLanguage)
    ? storedLanguage
    : DEFAULT_LANGUAGE;
}

function syncDocumentDirection(language) {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}

const initialLanguage = getInitialLanguage();

syncDocumentDirection(initialLanguage);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  localStorage.setItem(LANGUAGE_KEY, language);
  syncDocumentDirection(language);
});

export default i18n;
