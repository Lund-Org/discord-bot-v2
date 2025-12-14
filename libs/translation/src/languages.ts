// In a different file for Next

export type SupportedLanguage = keyof typeof supportedLanguages;

export const supportedLanguages = {
  fr: 'fr',
  en: 'en',
};
export const SUPPORTED_LANGUAGES = Object.values(supportedLanguages);
