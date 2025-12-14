// import dayjs from 'dayjs';
import i18n, { ThirdPartyModule } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { sanitize as sanitizePurify } from 'isomorphic-dompurify';

import { SUPPORTED_LANGUAGES, supportedLanguages } from './languages';
import ENGLISH_WEB from './web/en.json';
import FRENCH_WEB from './web/fr.json';

export type TranslationNamespace = 'web';

// https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
type InitI18nType = {
  ns?: TranslationNamespace;
  fallbackNs?: TranslationNamespace[];
  enableLanguageDetection?: boolean;
  initReactI18next?: ThirdPartyModule;
  language?: string | null;
};

export function initI18n({
  ns = undefined,
  fallbackNs = undefined,
  enableLanguageDetection = false,
  initReactI18next = undefined,
  language = null,
}: InitI18nType) {
  // if (language) {
  //   dayjs.locale(language);
  // }
  // if i18n is not initialized, initialize it
  if (i18n.isInitialized) {
    return i18n;
  }
  if (enableLanguageDetection) {
    i18n.use(LanguageDetector);
  }
  if (initReactI18next) {
    i18n.use(initReactI18next);
  }

  // i18n.on('languageChanged', (lng) => {
  //   dayjs.locale(lng);
  // });

  i18n.init({
    fallbackLng: supportedLanguages.fr,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: ['web'],
    defaultNS: ns,
    fallbackNS: fallbackNs,
    interpolation: { escape: sanitize },
    resources: {
      [supportedLanguages.en]: {
        ['web']: ENGLISH_WEB,
      },
      [supportedLanguages.fr]: {
        ['web']: FRENCH_WEB,
      },
    },
    returnEmptyString: false,
    ...(language ? { lng: language } : {}),
  });

  // The i18n instance needs to be passed to Storybook to allow locale switching
  return i18n;
}

function sanitize(domStr: string) {
  return sanitizePurify(domStr, {
    ADD_ATTR: ['target', 'rel'],
    ADD_TAGS: ['video-component'],
  });
}
