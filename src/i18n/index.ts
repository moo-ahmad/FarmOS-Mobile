import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ur from './locales/ur.json';
import { FALLBACK_LANGUAGE, resolveLanguage } from './resolve';

const deviceLanguage = resolveLanguage(
  getLocales().map((locale) => locale.languageTag),
);

// eslint-disable-next-line import/no-named-as-default-member -- i18n.use is the documented i18next API
void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ur: { translation: ur },
  },
  lng: deviceLanguage,
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
export {
  SUPPORTED_LANGUAGES,
  FALLBACK_LANGUAGE,
  isRTL,
  isSupportedLanguage,
  resolveLanguage,
  type SupportedLanguage,
} from './resolve';
export { syncLayoutDirection } from './rtl';
