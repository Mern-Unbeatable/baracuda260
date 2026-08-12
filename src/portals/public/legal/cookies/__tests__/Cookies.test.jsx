import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import CookiesContent from '@/portals/public/legal/cookies/sections/CookiesMain';

jest.mock('@/shared/site-chrome', () => {
  const React = jest.requireActual('react');
  return {
    SitePageLayout: ({ children, rootClassName = '' }) => (
      <div className={rootClassName} data-testid="site-page-layout">
        {children}
      </div>
    ),
    Shell: ({ children, className = '' }) => (
      <div className={className} data-testid="shell">
        {children}
      </div>
    ),
  };
});

describe('Cookie Policy page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title, intro, and types bullets', () => {
    render(<CookiesContent />);

    expect(screen.getByRole('heading', { level: 1, name: i18n.t('cookies.title') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('cookies.intro'))).toBeInTheDocument();

    const types = screen
      .getByRole('heading', { level: 2, name: 'Types of Cookies We Use' })
      .closest('section');
    expect(types).not.toBeNull();
    expect(within(types).getByText('Login')).toBeInTheDocument();
    expect(within(types).getByText('Language Preferences')).toBeInTheDocument();
  });

  it('switches legal copy to Polish', async () => {
    render(<CookiesContent />);
    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Polityka plików cookie' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Czym są pliki cookie?' })).toBeInTheDocument();
  });
});
