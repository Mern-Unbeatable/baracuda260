import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/slices/authSlice';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import DashboardContent from '../DashboardContent';
import { DEMO_ACCOUNTS } from '../../login/demoAccounts';

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
    expect(screen.getByRole('tab', { name: i18n.t('dashboard.tabs.user') })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: i18n.t('dashboard.tabs.admin') })).toBeInTheDocument();
  });

  it('switches dashboard copy to Polish', async () => {
    renderDashboard({ fullName: 'Atik Adnan', role: 'user' });

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

  it('renders User/Admin tabs after welcome body and switching Admin updates auth context', async () => {
    const user = userEvent.setup();
    const { store } = renderDashboard();

    expect(screen.getByText(i18n.t('dashboard.welcomeBody'))).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: i18n.t('dashboard.tabs.user') })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(screen.getByRole('tab', { name: i18n.t('dashboard.tabs.admin') }));

    expect(screen.getByRole('tab', { name: i18n.t('dashboard.tabs.admin') })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText(i18n.t('dashboard.welcomeBodyAdmin'))).toBeInTheDocument();
    expect(store.getState().auth.user).toMatchObject({
      role: 'admin',
      email: DEMO_ACCOUNTS.admin.email,
      fullName: DEMO_ACCOUNTS.admin.fullName,
    });
    expect(
      screen.getByRole('heading', { level: 1, name: 'Welcome back, Admin' }),
    ).toBeInTheDocument();
  });
});
