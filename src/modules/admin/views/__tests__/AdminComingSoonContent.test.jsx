import React from 'react';
import { act, render, screen } from '@testing-library/react';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminComingSoonContent from '@/modules/admin/views/AdminComingSoonContent';

describe('Admin Coming Soon content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English coming soon copy', () => {
    render(<AdminComingSoonContent />);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminOverview.comingSoon.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminOverview.comingSoon.body'))).toBeInTheDocument();
  });

  it('switches coming soon copy to Polish', async () => {
    render(<AdminComingSoonContent />);

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 1, name: 'Wkrótce' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Ta sekcja panelu administratora jest jeszcze w przygotowaniu. Przegląd jest już gotowy — kolejne narzędzia pojawią się wkrótce.',
      ),
    ).toBeInTheDocument();
  });
});
