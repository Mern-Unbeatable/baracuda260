import React from 'react';
import { act, render, screen } from '@testing-library/react';
import HomeHero, { HOME_HERO_SLIDE_MS, HOME_HERO_SLIDES } from '../HomeHero';

jest.mock('../../site', () => {
  const React = require('react');
  return {
    AppLink: ({ href, children, ...props }) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
  };
});

describe('HomeHero', () => {
  it('renders headline and slide controls', () => {
    render(<HomeHero />);
    expect(
      screen.getByRole('heading', { name: /12 Photos - Full Zodiac Story/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(HOME_HERO_SLIDES.length);
  });

  it('auto-advances slides every 6 seconds', () => {
    jest.useFakeTimers();
    render(<HomeHero />);

    expect(screen.getByRole('tab', { name: /Show slide 1/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    act(() => {
      jest.advanceTimersByTime(HOME_HERO_SLIDE_MS);
    });

    expect(screen.getByRole('tab', { name: /Show slide 2/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    jest.useRealTimers();
  });
});
