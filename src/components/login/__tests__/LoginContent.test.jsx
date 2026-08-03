import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/slices/authSlice';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import LoginContent from '../LoginContent';

jest.mock('../../site', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <span role="link" data-to={typeof to === 'string' ? to : ''} className={className}>
      {children}
    </span>
  ),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/login', state: null }),
}));

const renderLogin = () => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <LoginContent />
    </Provider>,
  );
};

describe('Login page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English welcome and form labels', () => {
    renderLogin();

    expect(screen.getByRole('heading', { level: 2, name: i18n.t('login.welcome') })).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('login.email'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('login.password'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('login.submit') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('login.or'))).toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    renderLogin();
    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 2, name: 'Witamy z powrotem' })).toBeInTheDocument();
    expect(screen.getByLabelText('Adres e-mail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zaloguj się' })).toBeInTheDocument();
    expect(screen.getByText('LUB')).toBeInTheDocument();
  });

  it('shows validation errors for empty submit', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.clear(screen.getByLabelText(i18n.t('login.email')));
    await user.clear(screen.getByLabelText(i18n.t('login.password')));
    await user.click(screen.getByRole('button', { name: i18n.t('login.submit') }));

    expect(await screen.findByText(i18n.t('login.emailRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('login.passwordRequired'))).toBeInTheDocument();
  });
});
