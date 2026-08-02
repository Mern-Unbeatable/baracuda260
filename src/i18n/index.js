import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import pl from './locales/pl.json';

/** Keep in sync with axios Accept-Language (`src/services/axiosInstance.js`). */
export const LOCALE_STORAGE_KEY = 'locale';

export const SUPPORTED_LOCALES = [
  { code: 'en', labelKey: 'languages.en' },
  { code: 'pl', labelKey: 'languages.pl' },
];

export const DEFAULT_LOCALE = 'en';

const readStoredLocale = () => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.some((locale) => locale.code === stored)) {
      return stored;
    }
  } catch {
    // ignore private-mode / SSR
  }
  return DEFAULT_LOCALE;
};

const applyDocumentLang = (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pl: { translation: pl },
  },
  lng: readStoredLocale(),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: SUPPORTED_LOCALES.map((locale) => locale.code),
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

applyDocumentLang(i18n.language);

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, lng);
  } catch {
    // ignore
  }
  applyDocumentLang(lng);
});

export const changeAppLanguage = (lng) => {
  if (!SUPPORTED_LOCALES.some((locale) => locale.code === lng)) return;
  return i18n.changeLanguage(lng);
};

export default i18n;
