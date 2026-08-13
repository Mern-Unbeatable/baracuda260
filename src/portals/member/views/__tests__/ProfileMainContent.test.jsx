import React from 'react';
import { act, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import ProfileMainContent from '@/portals/member/views/ProfileMainContent';
import { MEMBER_PROFILE } from '@/portals/member/data/memberProfileData';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, 'aria-label': ariaLabel }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe('ProfileMainContent', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders profile showcase sections', () => {
    render(<ProfileMainContent />);

    expect(screen.getByRole('heading', { level: 1, name: MEMBER_PROFILE.name })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('photographerProfile.aboutTitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('photographerProfile.artwork.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('photographerProfile.premium.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('photographerProfile.messages.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('photographerProfile.shareBanner.title'))).toBeInTheDocument();
    expect(screen.getByText('320')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: i18n.t('memberProfile.editProfile') }),
    ).toHaveAttribute('href', '/admin/settings');
  });
});
