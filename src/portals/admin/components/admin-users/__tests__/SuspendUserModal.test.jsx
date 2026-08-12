import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import { isSuspendReasonValid } from '@/portals/admin/data/adminUsersData';
import AdminUsersContent from '@/portals/admin/views/AdminUsersContent';
import SuspendUserModal from '@/portals/admin/components/admin-users/SuspendUserModal';

describe('isSuspendReasonValid', () => {
  it('requires a non-empty trimmed reason', () => {
    expect(isSuspendReasonValid('')).toBe(false);
    expect(isSuspendReasonValid('   ')).toBe(false);
    expect(isSuspendReasonValid('Policy violation')).toBe(true);
  });
});

describe('SuspendUserModal', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English suspend dialog fields and actions', () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    render(<SuspendUserModal open onClose={onClose} onConfirm={onConfirm} />);

    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminUsers.suspendModal.title') }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Reason/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(i18n.t('adminUsers.suspendModal.reasonPlaceholder'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminUsers.suspendModal.cancel') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminUsers.suspendModal.confirm') })).toBeInTheDocument();
  });

  it('requires a reason before confirming', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    render(<SuspendUserModal open onClose={jest.fn()} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: i18n.t('adminUsers.suspendModal.confirm') }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText(i18n.t('adminUsers.suspendModal.reasonRequired'))).toBeInTheDocument();
  });

  it('confirms with a trimmed reason and closes via cancel', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onConfirm = jest.fn();
    render(<SuspendUserModal open onClose={onClose} onConfirm={onConfirm} />);

    await user.type(
      screen.getByPlaceholderText(i18n.t('adminUsers.suspendModal.reasonPlaceholder')),
      '  Spam activity  ',
    );
    await user.click(screen.getByRole('button', { name: i18n.t('adminUsers.suspendModal.confirm') }));

    expect(onConfirm).toHaveBeenCalledWith('Spam activity');

    await user.click(screen.getByRole('button', { name: i18n.t('adminUsers.suspendModal.cancel') }));
    expect(onClose).toHaveBeenCalled();
  });

  it('switches suspend modal copy to Polish', async () => {
    render(<SuspendUserModal open onClose={jest.fn()} onConfirm={jest.fn()} />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 2, name: 'Zawieś użytkownika' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anuluj' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zawieś' })).toBeInTheDocument();
  });
});

describe('Admin Users content with suspend popup', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('opens suspend popup from trash action and suspends after confirm', async () => {
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
      'Guideline breach',
    );
    await user.click(screen.getByRole('button', { name: i18n.t('adminUsers.suspendModal.confirm') }));

    expect(
      screen.queryByRole('heading', { level: 2, name: i18n.t('adminUsers.suspendModal.title') }),
    ).not.toBeInTheDocument();

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

  it('closes suspend popup without changing status on cancel', async () => {
    const user = userEvent.setup();
    render(<AdminUsersContent />);

    const suspendLabel = i18n.t('adminUsers.actions.suspend', {
      name: i18n.t('adminUsers.rows.john.name'),
    });
    await user.click(screen.getAllByRole('button', { name: suspendLabel })[0]);
    await user.click(screen.getByRole('button', { name: i18n.t('adminUsers.suspendModal.cancel') }));

    expect(
      screen.queryByRole('heading', { level: 2, name: i18n.t('adminUsers.suspendModal.title') }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: suspendLabel }).length,
    ).toBeGreaterThan(0);
  });
});
