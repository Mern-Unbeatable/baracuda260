import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../index';

describe('i18n', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await changeAppLanguage(DEFAULT_LOCALE);
  });

  it('defaults to English nav labels', () => {
    expect(i18n.t('nav.home')).toBe('Home');
    expect(i18n.t('header.logIn')).toBe('Log IN');
  });

  it('switches to Polish and persists locale', async () => {
    await changeAppLanguage('pl');
    expect(i18n.t('nav.home')).toBe('Strona główna');
    expect(i18n.t('header.registerFree')).toBe('Zarejestruj się');
    expect(i18n.t('privacy.title')).toBe('Polityka prywatności');
    expect(i18n.t('terms.title')).toBe('Regulamin');
    expect(i18n.t('cookies.title')).toBe('Polityka plików cookie');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('pl');
  });

  it('keeps legal section counts aligned in both locales', () => {
    const enPrivacy = i18n.t('privacy.sections', { lng: 'en', returnObjects: true });
    const plPrivacy = i18n.t('privacy.sections', { lng: 'pl', returnObjects: true });
    const enTerms = i18n.t('terms.sections', { lng: 'en', returnObjects: true });
    const plTerms = i18n.t('terms.sections', { lng: 'pl', returnObjects: true });
    const enCookies = i18n.t('cookies.sections', { lng: 'en', returnObjects: true });
    const plCookies = i18n.t('cookies.sections', { lng: 'pl', returnObjects: true });

    expect(enPrivacy).toHaveLength(plPrivacy.length);
    expect(enTerms).toHaveLength(plTerms.length);
    expect(enCookies).toHaveLength(plCookies.length);
    expect(enTerms).toHaveLength(11);
    expect(enCookies).toHaveLength(9);
  });

  it('provides login strings in English and Polish', () => {
    expect(i18n.t('login.welcome', { lng: 'en' })).toBe('Welcome back');
    expect(i18n.t('login.welcome', { lng: 'pl' })).toBe('Witamy z powrotem');
    expect(i18n.t('login.submit', { lng: 'en' })).toBe('Log in');
    expect(i18n.t('login.submit', { lng: 'pl' })).toBe('Zaloguj się');
  });
});
