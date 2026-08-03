import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginSuccess } from '../../store/slices/authSlice';
import { ROUTES } from '../../config';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';
import { LanguageSwitcher } from '../site';
import { EMAIL_REGEX, SIGNUP_ASSETS } from './signupAssets';

const INITIAL_FORM = {
  fullName: '',
  username: '',
  email: '',
  phone: '',
  country: '',
  password: '',
};

/**
 * Sign Up page UI — Figma node 111:1024 (baracuda260 Copy).
 */
const SignUpContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = t('signup.fullNameRequired');
    }
    if (!form.username.trim()) {
      nextErrors.username = t('signup.usernameRequired');
    }
    if (!form.email.trim()) {
      nextErrors.email = t('signup.emailRequired');
    } else if (!EMAIL_REGEX.test(form.email)) {
      nextErrors.email = t('signup.emailInvalid');
    }
    if (!form.phone.trim()) {
      nextErrors.phone = t('signup.phoneRequired');
    }
    if (!form.country.trim()) {
      nextErrors.country = t('signup.countryRequired');
    }
    if (!form.password) {
      nextErrors.password = t('signup.passwordRequired');
    } else if (form.password.length < 8) {
      nextErrors.password = t('signup.passwordTooShort');
    }

    return nextErrors;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const payload = {
      fullName: form.fullName.trim(),
      username: form.username.trim().replace(/^@/, ''),
      email: form.email.trim(),
      phone: form.phone.trim(),
      country: form.country.trim(),
      password: form.password,
    };

    try {
      if (process.env.REACT_APP_DEV_MOCK_AUTH === 'true') {
        dispatch(
          loginSuccess({
            user: {
              email: payload.email,
              fullName: payload.fullName,
              username: payload.username,
            },
            token: null,
          }),
        );
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        return;
      }

      const { data, error } = await httpMethods.post(API_ENDPOINTS.AUTH.REGISTER, payload);

      if (error) {
        setErrors({
          form:
            error?.data?.message ?? error?.message ?? t('signup.registerFailed'),
        });
        return;
      }

      const token = data?.token ?? data?.data?.token ?? data?.accessToken;
      const user = data?.user ?? data?.data?.user ?? {
        email: payload.email,
        fullName: payload.fullName,
        username: payload.username,
      };
      dispatch(loginSuccess({ user, token }));
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = (hasError) =>
    `h-[60px] w-full rounded-lg bg-[#ecedfa] px-[14px] text-[14px] leading-5 text-[#0c0c0c] placeholder:text-[#8c8c8c] outline-none transition focus:ring-2 focus:ring-[#ee1c25]/25 ${
      hasError ? 'ring-2 ring-red-400' : ''
    }`;

  return (
    <div className="signup-page-root relative min-h-dvh w-full overflow-x-hidden bg-[#b2e3f0] lg:bg-white">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <LanguageSwitcher />
      </div>

      <div className="grid min-h-dvh w-full lg:grid-cols-[minmax(0,724fr)_minmax(0,720fr)]">
        <aside className="relative block min-h-[220px] overflow-hidden sm:min-h-[360px] lg:min-h-dvh">
          <img
            src={SIGNUP_ASSETS.hero}
            alt=""
            width={724}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-6 pb-10 sm:p-8 lg:pb-[52px] lg:pl-[46px]">
            <div className="max-w-[448px] rounded-2xl px-4 py-2">
              <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-0.96px] text-white sm:text-[40px] lg:text-[48px] lg:leading-[56px]">
                {t('signup.brandTitle')}
              </h1>
              <p className="mt-2 text-[14px] font-normal uppercase tracking-[1.8px] text-white/90 sm:text-[16px] lg:text-[18px] lg:leading-7">
                {t('signup.brandTagline')}
              </p>
            </div>
          </div>
        </aside>

        <section className="relative flex min-h-dvh items-center justify-center bg-white px-4 py-16 shadow-[-7px_0_11.4px_rgba(0,0,0,0.25)] sm:px-8 lg:py-12">
          <div className="flex w-full max-w-[615px] flex-col gap-9">
            <header>
              <h2 className="text-center text-[28px] font-semibold leading-normal text-[#0c0c0c] sm:text-[36px] lg:text-[40px]">
                {t('signup.title')}
              </h2>
            </header>

            {errors.form ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errors.form}
              </div>
            ) : null}

            <form onSubmit={handleSignUp} noValidate className="flex w-full flex-col gap-[30px]">
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-col gap-2.5">
                  <label
                    htmlFor="signup-full-name"
                    className="block text-[16px] font-medium leading-5 text-[#373737]"
                  >
                    {t('signup.fullName')}
                  </label>
                  <input
                    id="signup-full-name"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={updateField('fullName')}
                    placeholder={t('signup.fullNamePlaceholder')}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? 'signup-full-name-error' : undefined}
                    className={fieldClass(Boolean(errors.fullName))}
                  />
                  {errors.fullName ? (
                    <p id="signup-full-name-error" className="text-xs text-red-600">
                      {errors.fullName}
                    </p>
                  ) : null}
                </div>

                <div className="flex w-full flex-col gap-2.5">
                  <label
                    htmlFor="signup-username"
                    className="block text-[16px] font-medium leading-5 text-[#373737]"
                  >
                    {t('signup.username')}
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    autoComplete="username"
                    value={form.username}
                    onChange={updateField('username')}
                    placeholder={t('signup.usernamePlaceholder')}
                    aria-invalid={Boolean(errors.username)}
                    aria-describedby={errors.username ? 'signup-username-error' : undefined}
                    className={fieldClass(Boolean(errors.username))}
                  />
                  {errors.username ? (
                    <p id="signup-username-error" className="text-xs text-red-600">
                      {errors.username}
                    </p>
                  ) : null}
                </div>

                <div className="flex w-full flex-col gap-2.5">
                  <label
                    htmlFor="signup-email"
                    className="block text-[16px] font-medium leading-5 text-[#373737]"
                  >
                    {t('signup.email')}
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={updateField('email')}
                    placeholder={t('signup.emailPlaceholder')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'signup-email-error' : undefined}
                    className={fieldClass(Boolean(errors.email))}
                  />
                  {errors.email ? (
                    <p id="signup-email-error" className="text-xs text-red-600">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div className="flex w-full flex-col gap-2.5">
                  <label
                    htmlFor="signup-phone"
                    className="block text-[16px] font-medium leading-5 text-[#373737]"
                  >
                    {t('signup.phone')}
                  </label>
                  <input
                    id="signup-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={updateField('phone')}
                    placeholder={t('signup.phonePlaceholder')}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'signup-phone-error' : undefined}
                    className={fieldClass(Boolean(errors.phone))}
                  />
                  {errors.phone ? (
                    <p id="signup-phone-error" className="text-xs text-red-600">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>

                <div className="flex w-full flex-col gap-2.5">
                  <label
                    htmlFor="signup-country"
                    className="block text-[16px] font-medium leading-5 text-[#373737]"
                  >
                    {t('signup.country')}
                  </label>
                  <input
                    id="signup-country"
                    type="text"
                    autoComplete="country-name"
                    value={form.country}
                    onChange={updateField('country')}
                    placeholder={t('signup.countryPlaceholder')}
                    aria-invalid={Boolean(errors.country)}
                    aria-describedby={errors.country ? 'signup-country-error' : undefined}
                    className={fieldClass(Boolean(errors.country))}
                  />
                  {errors.country ? (
                    <p id="signup-country-error" className="text-xs text-red-600">
                      {errors.country}
                    </p>
                  ) : null}
                </div>

                <div className="flex w-full flex-col gap-2.5">
                  <label
                    htmlFor="signup-password"
                    className="block text-[16px] font-medium leading-5 text-[#373737]"
                  >
                    {t('signup.password')}
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={updateField('password')}
                    placeholder={t('signup.passwordPlaceholder')}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'signup-password-error' : undefined}
                    className={fieldClass(Boolean(errors.password))}
                  />
                  {errors.password ? (
                    <p id="signup-password-error" className="text-xs text-red-600">
                      {errors.password}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex w-full flex-col items-center gap-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#ee1c25] px-4 py-3 text-[16px] font-medium text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : null}
                  {isLoading ? t('signup.submitting') : t('signup.submit')}
                </button>

                <p className="text-center text-[16px] leading-normal text-[#a7a7a7]">
                  <span className="text-[#0c0c0c]">{t('signup.haveAccount')} </span>
                  <Link to={ROUTES.LOGIN} className="font-semibold text-[#ee1c25]">
                    {t('signup.logIn')}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
});

SignUpContent.displayName = 'SignUpContent';

export default SignUpContent;
