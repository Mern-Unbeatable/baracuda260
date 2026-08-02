import React from 'react';
import { render, screen, within } from '@testing-library/react';
import TermsContent from '../TermsContent';
import { TERMS_LAST_UPDATED, TERMS_SECTIONS } from '../termsData';

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

describe('Terms of Service page', () => {
  it('renders the page title and last-updated line', () => {
    render(<TermsContent />);

    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument();
    expect(screen.getByText(TERMS_LAST_UPDATED)).toBeInTheDocument();
    expect(screen.getByTestId('site-page-layout')).toHaveClass('terms-page-root');
  });

  it('renders every section heading from termsData', () => {
    render(<TermsContent />);

    TERMS_SECTIONS.forEach((section) => {
      expect(screen.getByRole('heading', { level: 2, name: section.title })).toBeInTheDocument();
    });
  });

  it('renders introduction copy and prohibited-activity bullets', () => {
    render(<TermsContent />);

    expect(screen.getByText('Welcome to My12Photos.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'By accessing or using this website, you agree to comply with these Terms of Service.',
      ),
    ).toBeInTheDocument();

    const prohibited = screen.getByRole('heading', {
      level: 2,
      name: '8. Prohibited Activities',
    }).closest('section');

    expect(prohibited).not.toBeNull();
    expect(within(prohibited).getByText('Upload illegal content')).toBeInTheDocument();
    expect(within(prohibited).getByText('Use bots or automated voting')).toBeInTheDocument();
    expect(within(prohibited).getByText('Abuse the platform')).toBeInTheDocument();
  });

  it('exports eleven canonical sections', () => {
    expect(TERMS_SECTIONS).toHaveLength(11);
    expect(TERMS_SECTIONS.map((section) => section.id)).toEqual([
      'introduction',
      'eligibility',
      'accounts',
      'competitions',
      'voting',
      'ip',
      'prizes',
      'prohibited',
      'suspension',
      'disclaimer',
      'changes',
    ]);
  });
});
