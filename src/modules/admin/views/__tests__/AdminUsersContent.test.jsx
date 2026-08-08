import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminUsersContent from '@/modules/admin/views/AdminUsersContent';

describe('Admin Users content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title, table headers, rows, and pagination', () => {
    render(<AdminUsersContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminUsers.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminUsers.eyebrow'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminUsers.sortBy'))).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: i18n.t('adminUsers.columns.name') })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: i18n.t('adminUsers.columns.email') })).toBeInTheDocument();
    expect(screen.getAllByText(i18n.t('adminUsers.rows.john.name')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(i18n.t('adminUsers.rows.emily.name')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('john.anderson@company.com').length).toBeGreaterThan(0);
    expect(screen.getByTestId('users-mobile-cards')).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('adminUsers.pagination.showing', { from: 1, to: 6, total: 6 })),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminUsers.pagination.previous') })).toBeDisabled();
    expect(screen.getByRole('button', { name: i18n.t('adminUsers.pagination.next') })).toBeDisabled();
  });

  it('filters the table by suspended status', async () => {
    const user = userEvent.setup();
    render(<AdminUsersContent />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminUsers.filters.aria') }));
    await user.click(screen.getByRole('option', { name: i18n.t('adminUsers.filters.suspended') }));

    expect(screen.getAllByText(i18n.t('adminUsers.rows.emily.name')).length).toBeGreaterThan(0);
    expect(screen.queryByText(i18n.t('adminUsers.rows.john.name'))).not.toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('adminUsers.pagination.showing', { from: 1, to: 1, total: 1 })),
    ).toBeInTheDocument();
  });

  it('suspends an active user through the Suspend User popup', async () => {
    const user = userEvent.setup();
    render(<AdminUsersContent />);

    const suspendLabel = i18n.t('adminUsers.actions.suspend', {
      name: i18n.t('adminUsers.rows.john.name'),
    });
    await user.click(screen.getAllByRole('button', { name: suspendLabel })[0]);

    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminUsers.suspendModal.title') }),
    ).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText(i18n.t('adminUsers.suspendModal.reasonPlaceholder')),
      'Abuse reports',
    );
    await user.click(screen.getByRole('button', { name: i18n.t('adminUsers.suspendModal.confirm') }));

    expect(
      screen.getAllByRole('button', {
        name: i18n.t('adminUsers.actions.reactivate', {
          name: i18n.t('adminUsers.rows.john.name'),
        }),
      }).length,
    ).toBeGreaterThan(0);

    const section = screen.getByLabelText(i18n.t('adminUsers.tableAria'));
    const johnNode = within(section).getAllByText(i18n.t('adminUsers.rows.john.name'))[0];
    const johnRow = johnNode.closest('tr') || johnNode.closest('article');
    expect(within(johnRow).getByText(i18n.t('adminUsers.status.suspended'))).toBeInTheDocument();
  });

  it('switches users copy to Polish', async () => {
    render(<AdminUsersContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Zarządzanie użytkownikami' }),
    ).toBeInTheDocument();
    expect(screen.getByText('SPOŁECZNOŚĆ')).toBeInTheDocument();
    expect(screen.getByText('Sortuj według:')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Imię i nazwisko' })).toBeInTheDocument();
    expect(screen.getAllByText('John Anderson').length).toBeGreaterThan(0);
  });
});
