import React from 'react';
import { act, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import NotificationsContent from '@/portals/member/views/NotificationsContent';

describe('Notifications page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders notification list', () => {
    render(<NotificationsContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('memberNotifications.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('memberNotifications.items.reviewPublic'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('memberNotifications.items.cohostAccepted'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('memberNotifications.items.emailConfirm'))).toBeInTheDocument();
    expect(screen.getByText('March 1, 2026')).toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    render(<NotificationsContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Powiadomienia' })).toBeInTheDocument();
  });
});
