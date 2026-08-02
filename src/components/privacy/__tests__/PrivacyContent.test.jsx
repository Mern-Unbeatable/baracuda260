import React from 'react';
import { act, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import PrivacyContent from '../PrivacyContent';

jest.mock('../../site', () => {
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

describe('Privacy Policy page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title and all section headings', () => {
    render(<PrivacyContent />);

    expect(screen.getByRole('heading', { level: 1, name: i18n.t('privacy.title') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('privacy.lastUpdated'))).toBeInTheDocument();

    const sections = i18n.t('privacy.sections', { returnObjects: true });
    sections.forEach((section) => {
      expect(screen.getByRole('heading', { level: 2, name: section.title })).toBeInTheDocument();
    });
  });

  it('switches legal copy to Polish', async () => {
    render(<PrivacyContent />);
    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Polityka prywatności' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '1. Wprowadzenie' })).toBeInTheDocument();
  });
});
