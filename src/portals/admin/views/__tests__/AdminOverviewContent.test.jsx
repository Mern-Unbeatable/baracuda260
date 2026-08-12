import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/app/store/slices/authSlice';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import AdminOverviewContent from '@/portals/admin/views/AdminOverviewContent';

const renderOverview = (user = { fullName: 'Adriana', email: 'admin@gmail.com', role: 'admin' }) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user,
        isAuthenticated: true,
        token: 'demo',
        loading: false,
      },
    },
  });

  return render(
    <Provider store={store}>
      <AdminOverviewContent />
    </Provider>,
  );
};

describe('Admin Overview content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English greeting, stats, analytics, pending, and community', () => {
    renderOverview();

    expect(screen.getByText('GOOD MORNING, ADRIANA')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminOverview.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminOverview.stats.registeredUsers'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminOverview.stats.registeredUsersValue'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminOverview.analytics.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminOverview.analytics.total'))).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminOverview.pending.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminOverview.pending.items.river.title'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('adminOverview.pending.openQueue') })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: i18n.t('adminOverview.community.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminOverview.community.countries.us'))).toBeInTheDocument();
  });

  it('switches Overview copy to Polish', async () => {
    renderOverview({ fullName: 'Adriana', role: 'admin' });

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByText('DZIEŃ DOBRY, ADRIANA')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Oto puls Twoich konkursów.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Zarejestrowani użytkownicy')).toBeInTheDocument();
    expect(screen.getByText('Analityka odwiedzin')).toBeInTheDocument();
    expect(screen.getByText('Oczekujące na przegląd')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Otwórz kolejkę przeglądu' })).toBeInTheDocument();
    expect(screen.getByText('Zasięg społeczności')).toBeInTheDocument();
  });
});
