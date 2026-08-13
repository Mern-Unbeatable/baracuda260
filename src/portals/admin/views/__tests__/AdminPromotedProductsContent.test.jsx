import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminPromotedProductsContent from '@/portals/admin/views/AdminPromotedProductsContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, 'aria-label': ariaLabel }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe('Admin Promoted Products content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title, filters, cards, and pagination', () => {
    render(<AdminPromotedProductsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminPromoted.title') }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminPromoted.filters.all') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminPromoted.filters.single') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminPromoted.filters.six') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminPromoted.filters.zodiac') })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(12);
    expect(screen.getByLabelText(i18n.t('adminPromoted.pagination.aria'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminPromoted.pagination.page', { page: 1 }) })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('shows all cards by default and filters by album type', async () => {
    const user = userEvent.setup();
    render(<AdminPromotedProductsContent />);

    expect(screen.getAllByRole('article')).toHaveLength(12);
    expect(screen.getByRole('button', { name: i18n.t('adminPromoted.filters.all') })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: i18n.t('adminPromoted.filters.zodiac') }));

    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByRole('button', { name: i18n.t('adminPromoted.filters.zodiac') })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('renders promoted card variant with metadata', () => {
    render(<AdminPromotedProductsContent />);

    expect(screen.getAllByText(i18n.t('adminPromoted.badge.promoted')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminPromoted.cards.nordic.title')).length).toBeGreaterThan(0);
  });

  it('renders simple card variant with price', () => {
    render(<AdminPromotedProductsContent />);

    expect(screen.getAllByText('$2.00').length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminPromoted.cards.autumn.title')).length).toBeGreaterThan(0);
  });

  it('switches copy to Polish', async () => {
    render(<AdminPromotedProductsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Promowane produkty' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wszystkie' })).toBeInTheDocument();
  });
});
