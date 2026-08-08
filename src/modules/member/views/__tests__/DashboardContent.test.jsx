import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/app/store/slices/authSlice';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import DashboardContent from '@/modules/member/views/DashboardContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, 'aria-label': ariaLabel }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

const renderDashboard = (
  user = { fullName: 'Sarah Jenkins', email: 'user@gmail.com', role: 'user' },
) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user,
        isAuthenticated: true,
        token: 'test-token',
        loading: false,
      },
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <DashboardContent />
      </Provider>,
    ),
  };
};

describe('Dashboard content by role', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders user dashboard for user role', () => {
    renderDashboard();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Welcome back, Sarah Jenkins',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('dashboard.stats.rank'))).toBeInTheDocument();
    expect(screen.getByText('#42')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('dashboard.competitions.title'))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: i18n.t('dashboard.uploadCta') })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: i18n.t('dashboard.tabs.user') })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: i18n.t('dashboard.tabs.admin') })).not.toBeInTheDocument();
  });

  it('switches user dashboard copy to Polish', async () => {
    renderDashboard({ fullName: 'Atik Adnan', role: 'user' });

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Witaj ponownie, Atik Adnan' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Aktualna pozycja')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Prześlij nowe zdjęcie' })).toBeInTheDocument();
  });

  it('renders admin Overview for admin role (no role tabs)', () => {
    renderDashboard({
      fullName: 'Admin',
      email: 'admin@gmail.com',
      role: 'admin',
    });

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('adminOverview.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t('adminOverview.stats.registeredUsers'))).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });
});
