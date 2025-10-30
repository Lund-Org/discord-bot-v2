import { initI18n } from '@discord-bot-v2/translation';
import { initReactI18next } from 'react-i18next';

const runsOnServerSide = typeof window === 'undefined';

export const getI18nInstance = (lang = 'fr') => {
  const instance = initI18n({
    ns: 'web',
    enableLanguageDetection: false,
    initReactI18next,
    language: lang,
  });

  if (
    runsOnServerSide &&
    instance.isInitialized &&
    lang !== instance.language
  ) {
    instance.changeLanguage(lang);
  }

  return instance;
};
