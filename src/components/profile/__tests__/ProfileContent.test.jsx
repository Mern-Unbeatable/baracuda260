import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import ProfileContent from '../ProfileContent';
import { DEFAULT_PROFILE } from '../profileData';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Profile page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    jest.clearAllMocks();
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English profile and security sections', () => {
    render(<ProfileContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('userProfile.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('userProfile.subtitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('userProfile.photographer.title'),
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('userProfile.security.title'),
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_PROFILE.fullName)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_PROFILE.phone)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_PROFILE.email)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_PROFILE.profileLink)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('userProfile.photographer.edit') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('userProfile.photographer.copy') }),
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

    expect(
      screen.getByRole('heading', { level: 1, name: 'Edytor szczegółów profilu' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Twój profil fotografa' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Bezpieczeństwo konta' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edytuj profil' })).toBeInTheDocument();
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

  it('shows copy success toast when Copy is clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileContent />);

    await user.click(
      screen.getByRole('button', { name: i18n.t('userProfile.photographer.copy') }),
    );

    expect(toast.success).toHaveBeenCalledWith(i18n.t('userProfile.photographer.copySuccess'));
  });
});
