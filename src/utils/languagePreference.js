export const LANGUAGE_PREFERENCE = {
  en: 0,
  ar: 1,
};

export function getLanguagePreference(language) {
  return LANGUAGE_PREFERENCE[language] ?? LANGUAGE_PREFERENCE.en;
}
