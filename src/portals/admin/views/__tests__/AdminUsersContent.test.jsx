import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminUsersContent from '@/portals/admin/views/AdminUsersContent';

const johnMenuLabel = () =>
  i18n.t('adminUsers.actions.menu', { name: i18n.t('adminUsers.rows.john.name') });

const openJohnMenu = async (user, table) => {
  const btns = within(table).getAllByRole('button', { name: johnMenuLabel() });
  await user.click(btns[0]);
};

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

  it('opens action menu with Active and Suspend options', async () => {
    const user = userEvent.setup();
    render(<AdminUsersContent />);

    const table = screen.getByRole('table');
    await openJohnMenu(user, table);

    const menu = within(table).getByRole('menu');
    expect(within(menu).getByRole('menuitem', { name: i18n.t('adminUsers.actions.active') })).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: i18n.t('adminUsers.actions.suspendOption') })).toBeInTheDocument();
  });

  it('suspends an active user through the action menu and Suspend User popup', async () => {
    const user = userEvent.setup();
    render(<AdminUsersContent />);

    const table = screen.getByRole('table');
    await openJohnMenu(user, table);

    const suspendBtn = within(table).getByRole('menuitem', { name: i18n.t('adminUsers.actions.suspendOption') });
    fireEvent.click(suspendBtn);

    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminUsers.suspendModal.title') }),
    ).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText(i18n.t('adminUsers.suspendModal.reasonPlaceholder')),
      'Abuse reports',
    );
    await user.click(screen.getByRole('button', { name: i18n.t('adminUsers.suspendModal.confirm') }));

    const johnNode = within(table).getAllByText(i18n.t('adminUsers.rows.john.name'))[0];
    const johnRow = johnNode.closest('tr');
    expect(within(johnRow).getByText(i18n.t('adminUsers.status.suspended'))).toBeInTheDocument();
  });

  it('reactivates a suspended user from the action menu', async () => {
    const user = userEvent.setup();
    render(<AdminUsersContent />);

    const table = screen.getByRole('table');
    const emilyMenuLabel = i18n.t('adminUsers.actions.menu', {
      name: i18n.t('adminUsers.rows.emily.name'),
    });
    await user.click(within(table).getAllByRole('button', { name: emilyMenuLabel })[0]);

    const activeBtn = within(table).getByRole('menuitem', { name: i18n.t('adminUsers.actions.active') });
    fireEvent.click(activeBtn);

    const emilyNode = within(table).getAllByText(i18n.t('adminUsers.rows.emily.name'))[0];
    const emilyRow = emilyNode.closest('tr');
    expect(within(emilyRow).getByText(i18n.t('adminUsers.status.active'))).toBeInTheDocument();
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
