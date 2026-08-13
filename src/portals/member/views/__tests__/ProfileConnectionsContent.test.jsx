import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import ProfileConnectionsContent from '@/portals/member/views/ProfileConnectionsContent';
import { PROFILE_FOLLOWING, PROFILE_CONNECTIONS_PAGE_SIZE } from '@/portals/member/data/profileConnectionsData';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className}>
      {children}
    </a>
  ),
}));

const renderFollowing = () =>
  render(
    <ProfileConnectionsContent
      titleKey="profileConnections.following.title"
      subtitleKey="profileConnections.following.subtitle"
      photographers={PROFILE_FOLLOWING}
    />,
  );

describe('Profile connections pages', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders following grid with pagination footer', () => {
    renderFollowing();

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('profileConnections.following.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('profileConnections.backToSelection'))).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(PROFILE_CONNECTIONS_PAGE_SIZE);
    expect(
      screen.getByText(
        i18n.t('profileConnections.showing', {
          from: 1,
          to: PROFILE_CONNECTIONS_PAGE_SIZE,
          total: PROFILE_FOLLOWING.length,
        }),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: i18n.t('profileConnections.paginationAria') }),
    ).toBeInTheDocument();
  });

  it('moves to the next page of photographers', async () => {
    const user = userEvent.setup();
    renderFollowing();

    await user.click(screen.getByRole('button', { name: i18n.t('gallery.nextPage') }));

    expect(
      screen.getByText(
        i18n.t('profileConnections.showing', {
          from: PROFILE_CONNECTIONS_PAGE_SIZE + 1,
          to: PROFILE_FOLLOWING.length,
          total: PROFILE_FOLLOWING.length,
        }),
      ),
    ).toBeInTheDocument();
  });
});
