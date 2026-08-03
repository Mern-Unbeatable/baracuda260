import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/slices/authSlice';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import DashboardContent from '../DashboardContent';

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, 'aria-label': ariaLabel }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

const renderDashboard = (user = { fullName: 'Sarah Jenkins', email: 'sarah@example.com' }) => {
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

  return render(
    <Provider store={store}>
      <DashboardContent />
    </Provider>,
  );
};

describe('User Dashboard content', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English welcome, stats, and competitions', () => {
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
    expect(
      screen.getByText(i18n.t('dashboard.competitions.items.celestial.title')),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: i18n.t('dashboard.uploadCta') })).toBeInTheDocument();
  });

  it('switches dashboard copy to Polish', async () => {
    renderDashboard({ fullName: 'Atik Adnan' });

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Witaj ponownie, Atik Adnan' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Aktualna pozycja')).toBeInTheDocument();
    expect(screen.getByText('Udział w konkursach')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Prześlij nowe zdjęcie' })).toBeInTheDocument();
  });
});
