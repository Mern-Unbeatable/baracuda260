import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminPayoutsContent from '@/portals/admin/views/AdminPayoutsContent';

describe('Admin Payouts content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English header, table, and pagination', () => {
    render(<AdminPayoutsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminPayouts.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminPayouts.eyebrow'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminPayouts.subtitle'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminPayouts.sortBy'))).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: i18n.t('adminPayouts.columns.winner') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: i18n.t('adminPayouts.columns.withdrawAmount') }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(i18n.t('adminPayouts.rows.kofi.name')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminPayouts.rows.nguyen.name')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminPayouts.rows.tara.name')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminPayouts.status.pending')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminPayouts.status.processing')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminPayouts.status.paid')).length).toBeGreaterThan(0);
    expect(screen.getByTestId('payouts-mobile-cards')).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('adminPayouts.pagination.showing', { count: 7, total: '2,480' })),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminPayouts.pagination.page', { page: 1 }) })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: i18n.t('adminPayouts.pagination.page', { page: 2 }) })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminPayouts.pagination.page', { page: 3 }) })).toBeInTheDocument();
  });

  it('filters the table by pending status', async () => {
    const user = userEvent.setup();
    render(<AdminPayoutsContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminPayouts.filters.aria') }));
    await user.click(screen.getByRole('option', { name: i18n.t('adminPayouts.filters.pending') }));

    expect(screen.getAllByText(i18n.t('adminPayouts.rows.kofi.name')).length).toBeGreaterThan(0);
    expect(screen.queryByText(i18n.t('adminPayouts.rows.nguyen.name'))).not.toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('adminPayouts.pagination.showing', { count: 1, total: '1' })),
    ).toBeInTheDocument();
  });

  it('opens action menu and updates row status', async () => {
    const user = userEvent.setup();
    render(<AdminPayoutsContent />);

    const actionLabel = i18n.t('adminPayouts.actions.menu', {
      name: i18n.t('adminPayouts.rows.kofi.name'),
    });
    await user.click(screen.getAllByRole('button', { name: actionLabel })[0]);

    const menu = screen.getAllByRole('listbox', {
      name: i18n.t('adminPayouts.actions.menuAria', {
        name: i18n.t('adminPayouts.rows.kofi.name'),
      }),
    })[0];

    expect(within(menu).getByRole('option', { name: i18n.t('adminPayouts.filters.pending') })).toBeInTheDocument();
    expect(within(menu).getByRole('option', { name: i18n.t('adminPayouts.filters.processing') })).toBeInTheDocument();
    expect(within(menu).getByRole('option', { name: i18n.t('adminPayouts.filters.paid') })).toBeInTheDocument();

    await user.click(within(menu).getByRole('option', { name: i18n.t('adminPayouts.filters.paid') }));

    expect(screen.getAllByText(i18n.t('adminPayouts.status.paid')).length).toBeGreaterThan(5);
  });

  it('switches payouts copy to Polish', async () => {
    render(<AdminPayoutsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Wypłaty nagród' })).toBeInTheDocument();
    expect(screen.getByText('WYPŁATY')).toBeInTheDocument();
    expect(screen.getByText('Sortuj według:')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Zwycięzca' })).toBeInTheDocument();
    expect(screen.getAllByText('Kofi Agyeman').length).toBeGreaterThan(0);
  });
});
