import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/app/store/slices/authSlice';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '@/shared/i18n';
import Sidebar from '@/layouts/AppShellLayout/adminSidebar/Sidebar';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className, onClick, title }) => (
    <a href={typeof to === 'string' ? to : '#'} className={className} onClick={onClick} title={title}>
      {children}
    </a>
  ),
  NavLink: ({ children, to, className, title, onClick, end: _end }) => {
    const resolvedClass =
      typeof className === 'function' ? className({ isActive: to === '/admin/dashboard' }) : className;
    const content =
      typeof children === 'function' ? children({ isActive: to === '/admin/dashboard' }) : children;
    return (
      <a href={typeof to === 'string' ? to : '#'} className={resolvedClass} title={title} onClick={onClick}>
        {content}
      </a>
    );
  },
  useNavigate: () => jest.fn(),
}));

const renderSidebar = (props = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: { fullName: 'Atik Adnan', email: 'atik@example.com' },
        isAuthenticated: true,
        token: 'test-token',
        loading: false,
      },
    },
  });

  return render(
    <Provider store={store}>
      <Sidebar
        onClose={jest.fn()}
        onDesktopClose={jest.fn()}
        onAutoCollapse={jest.fn()}
        isCollapsed={false}
        onExpand={jest.fn()}
        {...props}
      />
    </Provider>,
  );
};

describe('User Dashboard sidebar', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English nav labels and user card', () => {
    renderSidebar();

    expect(screen.getByText(i18n.t('dashboard.sidebar.mainMenu'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('dashboard.nav.dashboard'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('dashboard.nav.uploadPhotos'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('dashboard.nav.myCompetitions'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('dashboard.nav.businessPhotos'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('dashboard.nav.chat'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('dashboard.nav.prizePayments'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('dashboard.nav.profile'))).toBeInTheDocument();
    expect(screen.getByText('Atik Adnan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('dashboard.nav.logOut') })).toBeInTheDocument();
  });

  it('switches sidebar copy to Polish', async () => {
    renderSidebar();

    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByText('Menu główne')).toBeInTheDocument();
    expect(screen.getByText('Prześlij zdjęcia')).toBeInTheDocument();
    expect(screen.getByText('Moje konkursy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wyloguj się' })).toBeInTheDocument();
  });
});
