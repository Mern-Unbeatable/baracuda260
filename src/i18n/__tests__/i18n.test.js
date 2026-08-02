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
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('pl');
  });
});
