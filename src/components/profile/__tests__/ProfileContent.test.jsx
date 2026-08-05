import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import ProfileContent from '../ProfileContent';
import { DEFAULT_ADMIN_PROFILE } from '../profileData';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('My Profile page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    jest.clearAllMocks();
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English profile header, account, and password sections', () => {
    render(<ProfileContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('userProfile.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('userProfile.subtitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('userProfile.account.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('userProfile.security.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_ADMIN_PROFILE.displayName)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_ADMIN_PROFILE.displayEmail)).toBeInTheDocument();
    expect(screen.getByDisplayValue(DEFAULT_ADMIN_PROFILE.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(DEFAULT_ADMIN_PROFILE.email)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('userProfile.account.update') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('userProfile.security.changePassword') }),
    ).toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    render(<ProfileContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Mój profil' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Informacje o koncie' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Zmień hasło' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zaktualizuj profil' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zmień hasło' })).toBeInTheDocument();
  });

  it('shows validation errors for empty password form', async () => {
    const user = userEvent.setup();
    render(<ProfileContent />);

    await user.click(
      screen.getByRole('button', { name: i18n.t('userProfile.security.changePassword') }),
    );

    expect(
      await screen.findByText(i18n.t('userProfile.errors.currentRequired')),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('userProfile.errors.newRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('userProfile.errors.confirmRequired'))).toBeInTheDocument();
  });

  it('changes password when form is valid', async () => {
    const user = userEvent.setup();
    render(<ProfileContent />);

    await user.type(
      screen.getByLabelText(i18n.t('userProfile.security.currentPassword')),
      'oldpass12',
    );
    await user.type(
      screen.getByLabelText(i18n.t('userProfile.security.newPassword')),
      'newpass12',
    );
    await user.type(
      screen.getByLabelText(i18n.t('userProfile.security.confirmPassword')),
      'newpass12',
    );
    await user.click(
      screen.getByRole('button', { name: i18n.t('userProfile.security.changePassword') }),
    );

    expect(toast.success).toHaveBeenCalledWith(i18n.t('userProfile.security.success'));
  });

  it('updates profile display name and email', async () => {
    const user = userEvent.setup();
    render(<ProfileContent />);

    const nameInput = screen.getByLabelText(i18n.t('userProfile.account.name'));
    const emailInput = screen.getByLabelText(i18n.t('userProfile.account.email'));

    await user.clear(nameInput);
    await user.type(nameInput, 'New Studio');
    await user.clear(emailInput);
    await user.type(emailInput, 'new@studio.com');
    await user.click(screen.getByRole('button', { name: i18n.t('userProfile.account.update') }));

    expect(toast.success).toHaveBeenCalledWith(i18n.t('userProfile.account.updateSuccess'));
    expect(screen.getByText('New Studio')).toBeInTheDocument();
    expect(screen.getByText('new@studio.com')).toBeInTheDocument();
  });

  it('toggles password visibility with eye / eye-off icons', async () => {
    const user = userEvent.setup();
    render(<ProfileContent />);

    const currentInput = screen.getByLabelText(i18n.t('userProfile.security.currentPassword'));
    expect(currentInput).toHaveAttribute('type', 'password');

    const showButtons = screen.getAllByRole('button', {
      name: i18n.t('login.showPassword'),
    });
    expect(showButtons).toHaveLength(3);
    expect(showButtons[0].querySelector('img')).toHaveAttribute(
      'src',
      '/assets/admin-profile/icon-eye.svg',
    );

    await user.click(showButtons[0]);
    expect(currentInput).toHaveAttribute('type', 'text');

    const hideButton = screen.getByRole('button', { name: i18n.t('login.hidePassword') });
    expect(hideButton.querySelector('img')).toHaveAttribute(
      'src',
      '/assets/admin-profile/icon-eye-off.svg',
    );

    await user.click(hideButton);
    expect(currentInput).toHaveAttribute('type', 'password');
  });
});
