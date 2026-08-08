import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminSubmissionsContent from '@/modules/admin/views/AdminSubmissionsContent';

describe('Admin Submissions content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title, filters, cards, and pagination', () => {
    render(<AdminSubmissionsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminSubmissions.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSubmissions.eyebrow'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminSubmissions.filters.all') })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: i18n.t('adminSubmissions.filters.single') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminSubmissions.filters.six') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminSubmissions.filters.zodiac') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSubmissions.cards.golden.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSubmissions.cards.tidal.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSubmissions.cards.zodiac.title'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('adminSubmissions.pagination.aria'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('adminSubmissions.pagination.page', { page: 1 }) }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('filters cards by album type', async () => {
    const user = userEvent.setup();
    render(<AdminSubmissionsContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminSubmissions.filters.six') }));

    expect(screen.getByText(i18n.t('adminSubmissions.cards.autumn.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSubmissions.cards.city.title'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('adminSubmissions.cards.golden.title'))).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminSubmissions.filters.six') })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('keeps every filtered card visible when pagination page changes', async () => {
    const user = userEvent.setup();
    render(<AdminSubmissionsContent />);

    expect(screen.getByText(i18n.t('adminSubmissions.cards.golden.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSubmissions.cards.zodiac.title'))).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: i18n.t('adminSubmissions.pagination.page', { page: 2 }) }),
    );

    expect(screen.getByText(i18n.t('adminSubmissions.cards.golden.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSubmissions.cards.wings.title'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminSubmissions.cards.zodiac.title'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('adminSubmissions.pagination.page', { page: 2 }) }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('records approve and reject decisions via aria-pressed', async () => {
    const user = userEvent.setup();
    render(<AdminSubmissionsContent />);

    const approve = screen.getByRole('button', {
      name: i18n.t('adminSubmissions.actions.approve', {
        title: i18n.t('adminSubmissions.cards.golden.title'),
      }),
    });
    const reject = screen.getByRole('button', {
      name: i18n.t('adminSubmissions.actions.reject', {
        title: i18n.t('adminSubmissions.cards.autumn.title'),
      }),
    });

    await user.click(approve);
    await user.click(reject);

    expect(approve).toHaveAttribute('aria-pressed', 'true');
    expect(reject).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches submissions copy to Polish', async () => {
    render(<AdminSubmissionsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Przegląd zgłoszeń' })).toBeInTheDocument();
    expect(screen.getByText('MODERACJA')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wszystkie' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pojedyncze zdjęcie' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Historia 6 zdjęć' })).toBeInTheDocument();
    expect(screen.getByText('Golden Hour Silence')).toBeInTheDocument();
  });
});
