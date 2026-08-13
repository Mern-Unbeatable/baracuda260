import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import SettingsContent from '@/portals/member/views/SettingsContent';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Settings page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    jest.clearAllMocks();
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders profile, portfolio, uploads, and security sections', () => {
    render(<SettingsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('memberSettings.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('memberSettings.subtitle'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('memberSettings.profile.fullName'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('memberSettings.profile.username'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('memberSettings.portfolio.website'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('memberSettings.coverPhoto.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('memberSettings.profilePhoto.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('memberSettings.security.title') }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: i18n.t('memberSettings.save') })).toHaveLength(2);
  });

  it('shows profile validation errors when saving empty required fields', async () => {
    const user = userEvent.setup();
    render(<SettingsContent />);

    await user.clear(screen.getByLabelText(i18n.t('memberSettings.profile.fullName')));
    await user.clear(screen.getByLabelText(i18n.t('memberSettings.profile.username')));
    await user.clear(screen.getByLabelText(i18n.t('memberSettings.profile.phone')));
    await user.clear(screen.getByLabelText(i18n.t('memberSettings.profile.email')));
    await user.click(screen.getAllByRole('button', { name: i18n.t('memberSettings.save') })[0]);

    expect(
      await screen.findByText(i18n.t('memberSettings.errors.fullNameRequired')),
    ).toBeInTheDocument();
  });

  it('shows success toast when profile is saved', async () => {
    const user = userEvent.setup();
    render(<SettingsContent />);

    await user.click(screen.getAllByRole('button', { name: i18n.t('memberSettings.save') })[0]);

    expect(toast.success).toHaveBeenCalledWith(i18n.t('memberSettings.profile.saved'));
  });
});
