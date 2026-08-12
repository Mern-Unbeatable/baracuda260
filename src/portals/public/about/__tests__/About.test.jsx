import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AboutContent from '@/portals/public/about/About';
import AboutHowItWorks from '@/portals/public/about/sections/AboutHowItWorks';
import AboutHero from '@/portals/public/about/sections/AboutHero';
import { ABOUT_HERO_SLIDE_MS, ABOUT_HERO_SLIDES } from '@/portals/public/about/data/aboutAssets';

jest.mock('@/shared/site-chrome', () => {
  const React = require('react');
  return {
    SitePageLayout: ({ children }) => <div data-testid="site-page-layout">{children}</div>,
    Shell: ({ children, className = '' }) => (
      <div className={className} data-testid="shell">
        {children}
      </div>
    ),
    ImgIcon: ({ src }) => <img src={src} alt="" data-testid="img-icon" />,
  };
});

describe('About page', () => {
  it('renders hero and key sections', () => {
    render(<AboutContent />);

    expect(screen.getByRole('heading', { name: /About My12Photos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Our Story/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Our Mission/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Our Vision/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Our Community/i })).toBeInTheDocument();
    expect(screen.getByText('12+')).toBeInTheDocument();
    expect(screen.getByText('$10K+')).toBeInTheDocument();
    expect(screen.getByText('150K+')).toBeInTheDocument();
  });

  it('switches competition steps on click', async () => {
    const user = userEvent.setup();
    render(<AboutHowItWorks />);

    expect(screen.getByText(/Step 1 of 5/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Choose Your Competition/i }));
    expect(screen.getByText(/Step 2 of 5/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText(/Step 3 of 5/i)).toBeInTheDocument();
  });

  it('auto-advances hero slides every 6 seconds', () => {
    jest.useFakeTimers();
    render(<AboutHero />);

    expect(screen.getByRole('tab', { name: /Show slide 1/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    act(() => {
      jest.advanceTimersByTime(ABOUT_HERO_SLIDE_MS);
    });

    expect(screen.getByRole('tab', { name: /Show slide 2/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    act(() => {
      jest.advanceTimersByTime(ABOUT_HERO_SLIDE_MS * (ABOUT_HERO_SLIDES.length - 1));
    });

    expect(screen.getByRole('tab', { name: /Show slide 1/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    jest.useRealTimers();
  });
});
