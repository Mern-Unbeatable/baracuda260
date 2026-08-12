import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminCompetitionsContent from '@/portals/admin/views/AdminCompetitionsContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, 'aria-label': ariaLabel }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe('Admin Competitions content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title, filters, cards, and pagination', () => {
    render(<AdminCompetitionsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminCompetitions.title') }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminCompetitions.filters.single') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminCompetitions.filters.six') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminCompetitions.filters.zodiac') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitions.cards.autumn.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitions.cards.zodiac.title'))).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: i18n.t('adminCompetitions.cards.autumn.title') }),
    ).toHaveAttribute('href', '/admin/my-competitions/autumn');
    expect(screen.getByLabelText(i18n.t('adminCompetitions.pagination.aria'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminCompetitions.pagination.page', { page: 1 }) })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('filters cards by album type', async () => {
    const user = userEvent.setup();
    render(<AdminCompetitionsContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminCompetitions.filters.zodiac') }));

    expect(screen.getByText(i18n.t('adminCompetitions.cards.zodiac.title'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('adminCompetitions.cards.autumn.title'))).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminCompetitions.filters.zodiac') })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('keeps every card photo visible when pagination page changes', async () => {
    const user = userEvent.setup();
    render(<AdminCompetitionsContent />);

    expect(screen.getByText(i18n.t('adminCompetitions.cards.autumn.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitions.cards.zodiac.title'))).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: i18n.t('adminCompetitions.pagination.page', { page: 2 }) }),
    );

    expect(screen.getByText(i18n.t('adminCompetitions.cards.autumn.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitions.cards.wings.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminCompetitions.cards.zodiac.title'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('adminCompetitions.pagination.page', { page: 2 }) }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('switches competitions copy to Polish', async () => {
    render(<AdminCompetitionsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Galeria zdjęć' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pojedyncze zdjęcie' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Historia 6 zdjęć' })).toBeInTheDocument();
    expect(screen.getByText('Autumn Sequence')).toBeInTheDocument();
  });
});
