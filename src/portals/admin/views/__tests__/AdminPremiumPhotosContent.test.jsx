import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminPremiumPhotosContent from '@/portals/admin/views/AdminPremiumPhotosContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, 'aria-label': ariaLabel }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe('Admin Premium Photos content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title, filters, cards, and pagination', () => {
    render(<AdminPremiumPhotosContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminPremiumPhotos.title') }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminPremiumPhotos.filters.all') })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(12);
    expect(
      screen.getAllByRole('link', { name: i18n.t('adminPremiumPhotos.cards.autumn.title') })[0],
    ).toHaveAttribute('href', '/admin/premium-photos/autumn');
  });

  it('filters cards by album type', async () => {
    const user = userEvent.setup();
    render(<AdminPremiumPhotosContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminPremiumPhotos.filters.zodiac') }));

    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
});
