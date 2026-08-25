import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/app/store/slices/authSlice';
import { envVar } from '@/shared/config/env';
import { ROUTES } from '@/shared/config';
import { httpMethods } from '@/shared/lib/httpMethods';
import { API_ENDPOINTS } from '@/shared/lib/httpEndpoint';
import AuthPageChrome from '@/portals/auth/components/auth/auth/AuthPageChrome';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, getDemoAccount } from '@/portals/auth/data/demoAccounts';
import { EMAIL_REGEX, LOGIN_ASSETS } from '@/portals/auth/data/loginAssets';

/**
 * Login page UI — Figma node 368:3426 (baracuda260 Copy).
 * Auth behavior preserved from the previous admin login flow.
 */
const LoginContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState(
    envVar('DEV_DEFAULT_EMAIL', '') || DEMO_ACCOUNTS.user.email,
  );
  const [password, setPassword] = useState(
    envVar('DEV_DEFAULT_PASSWORD', '') || DEMO_PASSWORD,
  );
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const goToDashboard = () => {
    const destination = location.state?.from?.pathname ?? ROUTES.ADMIN_DASHBOARD;
    navigate(destination, { replace: true });
  };

  const completeDemoLogin = (account) => {
    dispatch(
      loginSuccess({
        user: {
          email: account.email,
          fullName: account.fullName,
          role: account.role,
          rememberMe,
        },
        token: 'demo',
      }),
    );
    goToDashboard();
  };

  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) {
      nextErrors.email = t('login.emailRequired');
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = t('login.emailInvalid');
    }
    if (!password) {
      nextErrors.password = t('login.passwordRequired');
    }
    return nextErrors;
  };

  const handleDemoQuickLogin = (role) => {
    const account = DEMO_ACCOUNTS[role];
    if (!account) return;
    setErrors({});
    setEmail(account.email);
    setPassword(DEMO_PASSWORD);
    setIsLoading(true);
    try {
      completeDemoLogin(account);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const demoAccount = getDemoAccount(email, password);
      if (demoAccount) {
        completeDemoLogin(demoAccount);
        return;
      }

      if (envVar('DEV_MOCK_AUTH') === 'true') {
        dispatch(
          loginSuccess({
            user: { email, rememberMe, role: 'user', fullName: email },
            token: null,
          }),
        );
        goToDashboard();
        return;
      }

      const { data, error } = await httpMethods.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
        rememberMe,
      });

      if (error) {
        setErrors({
          form: error?.data?.message ?? error?.message ?? t('login.invalidCredentials'),
        });
        return;
      }

      const token = data?.token ?? data?.data?.token ?? data?.accessToken;
      const user = data?.user ?? data?.data?.user ?? null;
      dispatch(loginSuccess({ user, token }));
      goToDashboard();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-root relative min-h-dvh w-full overflow-x-hidden bg-white">
      <AuthPageChrome backLabelKey="login.backHome" />

      <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2">
        {/* Visual panel — stacked banner on mobile/tablet, full-height column on laptop+ */}
        <aside className="relative h-55 overflow-hidden sm:h-75 md:h-90 lg:h-auto lg:min-h-dvh">
          <img
            src={LOGIN_ASSETS.hero}
            alt=""
            width={724}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Mobile/tablet: brand top-left under chrome; desktop: bottom-left */}
          <div className="absolute inset-x-0 top-0 bg-linear-to-b from-black/50 via-black/15 to-transparent px-4 pb-8 pt-16 sm:px-6 sm:pt-18 lg:hidden">
            <div className="max-w-70">
              <p className="text-[28px] font-bold leading-tight tracking-[-0.5px] text-white sm:text-[36px]">
                {t('login.brandTitle')}
              </p>
              <p className="mt-1 text-[12px] font-normal uppercase tracking-[1.8px] text-white/90 sm:text-[14px]">
                {t('login.brandTagline')}
              </p>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 hidden bg-linear-to-t from-black/55 via-black/20 to-transparent p-8 pb-13 pl-11.5 lg:block">
            <div className="max-w-md rounded-2xl px-4 py-2">
              <h1 className="text-[48px] font-bold leading-14 tracking-[-0.96px] text-white">
                {t('login.brandTitle')}
              </h1>
              <p className="mt-2 text-[18px] font-normal uppercase leading-7 tracking-[1.8px] text-white/90">
                {t('login.brandTagline')}
              </p>
            </div>
          </div>
        </aside>

        {/* Form panel — natural height on mobile; centered full column on laptop+ */}
        <section className="relative flex w-full items-start justify-center bg-white px-4 py-8 shadow-none sm:px-8 sm:py-10 md:px-10 lg:min-h-dvh lg:items-center lg:py-12 lg:shadow-[-7px_0_11.4px_rgba(0,0,0,0.25)]">
          <div className="w-full max-w-120 bg-white px-0 py-2 sm:px-2 lg:p-4">
            <header className="mb-6 flex flex-col items-center gap-2 text-center sm:mb-8">
              <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.3px] text-[#161c27] sm:text-[30px]">
                {t('login.welcome')}
              </h2>
              <p className="max-w-88 text-pretty text-[15px] leading-6 text-[#494453] sm:max-w-104 sm:text-[16px]">
                {t('login.subtitle')}
              </p>
            </header>

            <div className="mb-6 flex flex-col gap-3">
              <p className="text-center text-[13px] leading-5 text-[#7a7484]">
                {t('login.demoHint')}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDemoQuickLogin('user')}
                  className="flex-1 rounded-lg border border-[#cbc3d5] bg-white px-4 py-3 text-[14px] font-semibold text-[#161c27] transition hover:border-[#ee1c25] hover:text-[#ee1c25] disabled:opacity-60"
                >
                  {t('login.demoUser')}
                </button>
                {/* <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDemoQuickLogin('admin')}
                  className="flex-1 rounded-lg border border-[#cbc3d5] bg-white px-4 py-3 text-[14px] font-semibold text-[#161c27] transition hover:border-[#ee1c25] hover:text-[#ee1c25] disabled:opacity-60"
                >
                  {t('login.demoAdmin')}
                </button> */}
              </div>
            </div>

            {errors.form ? (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errors.form}
              </div>
            ) : null}

            <form onSubmit={handleLogin} noValidate className="flex flex-col gap-5 sm:gap-6">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block px-1 text-[16px] leading-6 text-[#494453]"
                >
                  {t('login.email')}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-4 w-5 -translate-y-1/2 items-center justify-center overflow-hidden">
                    <img
                      src={LOGIN_ASSETS.mail}
                      alt=""
                      width={20}
                      height={16}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('login.emailPlaceholder')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'login-email-error' : undefined}
                    className={`w-full rounded-lg border bg-white py-4 pl-12.25 pr-4 text-[16px] text-[#161c27] placeholder:text-[#6b7280] outline-none transition focus:border-[#ee1c25] focus:ring-2 focus:ring-[#ee1c25]/20 sm:py-4.5 ${
                      errors.email ? 'border-red-400' : 'border-[#cbc3d5]'
                    }`}
                  />
                </div>
                {errors.email ? (
                  <p id="login-email-error" className="mt-1.5 px-1 text-xs text-red-600">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3 px-1">
                  <label htmlFor="login-password" className="text-[16px] leading-6 text-[#494453]">
                    {t('login.password')}
                  </label>
                  <button
                    type="button"
                    className="shrink-0 text-[15px] leading-6 text-[#ee1c25] sm:text-[16px]"
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-5.25 w-4 -translate-y-1/2 items-center justify-center overflow-hidden">
                    <img
                      src={LOGIN_ASSETS.lock}
                      alt=""
                      width={16}
                      height={21}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'login-password-error' : undefined}
                    className={`w-full rounded-lg border bg-white py-4 pl-12.25 pr-12 text-[16px] text-[#161c27] placeholder:text-[#6b7280] outline-none transition focus:border-[#ee1c25] focus:ring-2 focus:ring-[#ee1c25]/20 sm:py-4.5 ${
                      errors.password ? 'border-red-400' : 'border-[#cbc3d5]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                    className="absolute right-4 top-1/2 flex h-3.75 w-5.5 -translate-y-1/2 items-center justify-center overflow-hidden"
                  >
                    <img
                      src={LOGIN_ASSETS.eye}
                      alt=""
                      width={22}
                      height={15}
                      className={`h-full w-full object-contain ${showPassword ? 'opacity-100' : 'opacity-70'}`}
                    />
                  </button>
                </div>
                {errors.password ? (
                  <p id="login-password-error" className="mt-1.5 px-1 text-xs text-red-600">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <label className="flex cursor-pointer items-center gap-2 px-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="size-4 shrink-0 rounded border border-[#cbc3d5] accent-[#ee1c25]"
                />
                <span className="text-[14px] leading-6 text-[#494453]">
                  {t('login.rememberMe')}
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ee1c25] py-3.5 text-[14px] font-semibold tracking-[0.28px] text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
              >
                {isLoading ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : null}
                <span>{isLoading ? t('login.submitting') : t('login.submit')}</span>
                {!isLoading ? (
                  <span className="inline-flex size-3.25 items-center justify-center overflow-hidden">
                    <img
                      src={LOGIN_ASSETS.arrow}
                      alt=""
                      width={14}
                      height={14}
                      className="h-full w-full object-contain"
                    />
                  </span>
                ) : null}
              </button>
            </form>

            <div className="my-8 flex w-full items-center sm:my-10">
              <div className="h-px flex-1 border-t border-[#cbc3d5]" />
              <span className="px-4 text-[16px] uppercase tracking-[1.6px] text-[#7a7484]">
                {t('login.or')}
              </span>
              <div className="h-px flex-1 border-t border-[#cbc3d5]" />
            </div>

            <p className="pb-4 text-center text-[16px] leading-6 text-[#494453]">
              <span>{t('login.noAccount')} </span>
              <Link to={ROUTES.SIGNUP} className="font-bold text-[#ee1c25]">
                {t('login.createAccount')}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
});

LoginContent.displayName = 'LoginContent';

export default LoginContent;
