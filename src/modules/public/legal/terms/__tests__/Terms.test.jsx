import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import TermsContent from '@/modules/public/legal/terms/sections/TermsMain';

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

describe('Terms of Service page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title and prohibited-activity bullets', () => {
    render(<TermsContent />);

    expect(screen.getByRole('heading', { level: 1, name: i18n.t('terms.title') })).toBeInTheDocument();

    const sections = i18n.t('terms.sections', { returnObjects: true });
    expect(sections).toHaveLength(11);

    const prohibited = screen
      .getByRole('heading', { level: 2, name: '8. Prohibited Activities' })
      .closest('section');
    expect(prohibited).not.toBeNull();
    expect(within(prohibited).getByText('Upload illegal content')).toBeInTheDocument();
    expect(within(prohibited).getByText('Abuse the platform')).toBeInTheDocument();
  });

  it('switches legal copy to Polish', async () => {
    render(<TermsContent />);
    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Regulamin' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '8. Zabronione działania' })).toBeInTheDocument();
  });
});
