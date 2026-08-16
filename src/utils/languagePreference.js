export const LANGUAGE_PREFERENCE = {
  ar: 0,
  en: 1,
};

export function getLanguagePreference(language) {
  return LANGUAGE_PREFERENCE[language] ?? LANGUAGE_PREFERENCE.en;
}
