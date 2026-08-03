import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../../store/slices/authSlice';
import i18n, { changeAppLanguage, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../../../i18n';
import SignUpContent from '../SignUpContent';

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
}));

const renderSignUp = () => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <SignUpContent />
    </Provider>,
  );
};

describe('Sign Up page', () => {
  afterEach(async () => {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    await act(async () => {
      await changeAppLanguage(DEFAULT_LOCALE);
    });
  });

  it('renders English title and form labels', () => {
    renderSignUp();

    expect(screen.getByRole('heading', { level: 2, name: i18n.t('signup.title') })).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('signup.fullName'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('signup.username'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('signup.email'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('signup.phone'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('signup.country'))).toBeInTheDocument();
    expect(screen.getByLabelText(i18n.t('signup.password'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('signup.submit') })).toBeInTheDocument();
    expect(screen.getByText(i18n.t('signup.logIn'))).toBeInTheDocument();
  });

  it('switches copy to Polish', async () => {
    renderSignUp();
    await act(async () => {
      await changeAppLanguage('pl');
    });

    expect(screen.getByRole('heading', { level: 2, name: 'Stwórz swoje konto' })).toBeInTheDocument();
    expect(screen.getByLabelText('Imię i nazwisko')).toBeInTheDocument();
    expect(screen.getByLabelText('Nazwa użytkownika')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Numer telefonu')).toBeInTheDocument();
    expect(screen.getByLabelText('Kraj')).toBeInTheDocument();
    expect(screen.getByLabelText('Hasło')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zarejestruj się' })).toBeInTheDocument();
    expect(screen.getByText('Zaloguj się')).toBeInTheDocument();
  });

  it('shows validation errors for empty submit', async () => {
    const user = userEvent.setup();
    renderSignUp();

    await user.click(screen.getByRole('button', { name: i18n.t('signup.submit') }));

    expect(await screen.findByText(i18n.t('signup.fullNameRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('signup.usernameRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('signup.emailRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('signup.phoneRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('signup.countryRequired'))).toBeInTheDocument();
    expect(screen.getByText(i18n.t('signup.passwordRequired'))).toBeInTheDocument();
  });
});
