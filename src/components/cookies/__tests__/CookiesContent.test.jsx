import React from 'react';
import { render, screen, within } from '@testing-library/react';
import CookiesContent from '../CookiesContent';
import { COOKIES_INTRO, COOKIES_LAST_UPDATED, COOKIES_SECTIONS } from '../cookiesData';

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

describe('Cookie Policy page', () => {
  it('renders the page title, last-updated line, and intro', () => {
    render(<CookiesContent />);

    expect(screen.getByRole('heading', { level: 1, name: 'Cookie Policy' })).toBeInTheDocument();
    expect(screen.getByText(COOKIES_LAST_UPDATED)).toBeInTheDocument();
    expect(screen.getByText(COOKIES_INTRO)).toBeInTheDocument();
    expect(screen.getByTestId('site-page-layout')).toHaveClass('cookies-page-root');
  });

  it('renders every section heading from cookiesData', () => {
    render(<CookiesContent />);

    COOKIES_SECTIONS.forEach((section) => {
      expect(screen.getByRole('heading', { level: 2, name: section.title })).toBeInTheDocument();
    });
  });

  it('renders types and advertising copy with key bullets', () => {
    render(<CookiesContent />);

    const types = screen
      .getByRole('heading', { level: 2, name: 'Types of Cookies We Use' })
      .closest('section');
    expect(types).not.toBeNull();
    expect(within(types).getByText('Required for:')).toBeInTheDocument();
    expect(within(types).getByText('Login')).toBeInTheDocument();
    expect(within(types).getByText('Language Preferences')).toBeInTheDocument();

    expect(
      screen.getByText(
        'Google Ads may use cookies to display relevant advertisements and measure advertising effectiveness.',
      ),
    ).toBeInTheDocument();
  });

  it('exports nine canonical sections in Figma order', () => {
    expect(COOKIES_SECTIONS).toHaveLength(9);
    expect(COOKIES_SECTIONS.map((section) => section.id)).toEqual([
      'what-are-cookies',
      'types',
      'performance',
      'analytics',
      'advertising',
      'functional',
      'managing',
      'third-party',
      'updates',
    ]);
  });
});
