import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAdmin from './locales/en/admin.json';
import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enMember from './locales/en/member.json';
import enPublic from './locales/en/public.json';
import plAdmin from './locales/pl/admin.json';
import plAuth from './locales/pl/auth.json';
import plCommon from './locales/pl/common.json';
import plMember from './locales/pl/member.json';
import plPublic from './locales/pl/public.json';

export const LOCALE_STORAGE_KEY = 'locale';
export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = [
  { code: 'en', labelKey: 'languages.en' },
  { code: 'pl', labelKey: 'languages.pl' },
];

const NAMESPACES = ['common', 'auth', 'public', 'member', 'admin'];

const getSavedLocale = () => {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && SUPPORTED_LOCALES.some(({ code }) => code === saved)) {
      return saved;
    }
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE;
};

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    public: enPublic,
    member: enMember,
    admin: enAdmin,
  },
  pl: {
    common: plCommon,
    auth: plAuth,
    public: plPublic,
    member: plMember,
    admin: plAdmin,
  },
};

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: getSavedLocale(),
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES.map(({ code }) => code),
    ns: NAMESPACES,
    defaultNS: 'common',
    fallbackNS: ['public', 'member', 'admin', 'auth'],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  document.documentElement.lang = i18n.language;

  i18n.on('languageChanged', (lng) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, lng);
    } catch {
      // ignore
    }
    document.documentElement.lang = lng;
  });
}

export const changeLanguage = (lng) => {
  if (!SUPPORTED_LOCALES.some(({ code }) => code === lng)) return undefined;
  return i18n.changeLanguage(lng);
};

export default i18n;
