import React, { memo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginSuccess } from '../../store/slices/authSlice';
import { ROUTES } from '../../config';
import { httpMethods } from '../../services/httpMethods';
import { API_ENDPOINTS } from '../../services/httpEndpoint';
import { LanguageSwitcher } from '../site';
import { EMAIL_REGEX, LOGIN_ASSETS } from './loginAssets';

/**
 * Login page UI — Figma node 368:3426 (baracuda260 Copy).
 * Auth behavior preserved from the previous admin login flow.
 */
const LoginContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState(process.env.REACT_APP_DEV_DEFAULT_EMAIL || '');
  const [password, setPassword] = useState(process.env.REACT_APP_DEV_DEFAULT_PASSWORD || '');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
      if (process.env.REACT_APP_DEV_MOCK_AUTH === 'true') {
        dispatch(loginSuccess({ user: { email, rememberMe }, token: null }));
        const destination = location.state?.from?.pathname ?? ROUTES.ADMIN_DASHBOARD;
        navigate(destination, { replace: true });
        return;
      }

      const { data, error } = await httpMethods.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
        rememberMe,
      });

      if (error) {
        setErrors({
          form:
            error?.data?.message ?? error?.message ?? t('login.invalidCredentials'),
        });
        return;
      }

      const token = data?.token ?? data?.data?.token ?? data?.accessToken;
      const user = data?.user ?? data?.data?.user ?? null;
      dispatch(loginSuccess({ user, token }));
      const destination = location.state?.from?.pathname ?? ROUTES.ADMIN_DASHBOARD;
      navigate(destination, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-root relative min-h-dvh w-full overflow-x-hidden bg-[#b2e3f0] lg:bg-white">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <LanguageSwitcher />
      </div>

      <div className="grid min-h-dvh w-full lg:grid-cols-2">
        {/* Visual panel */}
        <aside className="relative block min-h-[220px] overflow-hidden sm:min-h-[360px] lg:min-h-dvh">
          <img
            src={LOGIN_ASSETS.hero}
            alt=""
            width={724}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-6 pb-10 sm:p-8 lg:pb-[52px] lg:pl-[46px]">
            <div className="max-w-[448px] rounded-2xl px-4 py-2 backdrop-blur-[2px]">
              <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-0.96px] text-white sm:text-[40px] lg:text-[48px] lg:leading-[56px]">
                {t('login.brandTitle')}
              </h1>
              <p className="mt-2 text-[14px] font-normal uppercase tracking-[1.8px] text-white/90 sm:text-[16px] lg:text-[18px] lg:leading-7">
                {t('login.brandTagline')}
              </p>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <section className="relative flex min-h-dvh items-center justify-center bg-white px-4 py-16 shadow-[-7px_0_11.4px_rgba(0,0,0,0.25)] sm:px-8 lg:py-12">
          <div className="w-full max-w-[480px] rounded-xl bg-white p-6 sm:p-10 lg:p-12">
            <header className="mb-10 flex flex-col items-center gap-2 text-center sm:mb-12">
              <h2 className="pt-2 text-[26px] font-semibold leading-[38px] tracking-[-0.3px] text-[#161c27] sm:text-[30px]">
                {t('login.welcome')}
              </h2>
              <p className="whitespace-nowrap text-[15px] leading-6 text-[#494453] sm:text-[16px]">
                {t('login.subtitle')}
              </p>
            </header>

            {errors.form ? (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errors.form}
              </div>
            ) : null}

            <form onSubmit={handleLogin} noValidate className="flex flex-col gap-6">
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
                    className={`w-full rounded-lg border bg-white py-[18px] pl-[49px] pr-4 text-[16px] text-[#161c27] placeholder:text-[#6b7280] outline-none transition focus:border-[#ee1c25] focus:ring-2 focus:ring-[#ee1c25]/20 ${
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
                  <label
                    htmlFor="login-password"
                    className="text-[16px] leading-6 text-[#494453]"
                  >
                    {t('login.password')}
                  </label>
                  <button type="button" className="shrink-0 text-[16px] leading-6 text-[#ee1c25]">
                    {t('login.forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 flex h-[21px] w-4 -translate-y-1/2 items-center justify-center overflow-hidden">
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
                    className={`w-full rounded-lg border bg-white py-[18px] pl-[49px] pr-12 text-[16px] text-[#161c27] placeholder:text-[#6b7280] outline-none transition focus:border-[#ee1c25] focus:ring-2 focus:ring-[#ee1c25]/20 ${
                      errors.password ? 'border-red-400' : 'border-[#cbc3d5]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                    className="absolute right-4 top-1/2 flex h-[15px] w-[22px] -translate-y-1/2 items-center justify-center overflow-hidden"
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
                <span className="text-[14px] leading-6 text-[#494453]">{t('login.rememberMe')}</span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ee1c25] py-4 text-[14px] font-semibold tracking-[0.28px] text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : null}
                <span>{isLoading ? t('login.submitting') : t('login.submit')}</span>
                {!isLoading ? (
                  <span className="inline-flex size-[13px] items-center justify-center overflow-hidden">
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

            <div className="my-10 flex w-full items-center">
              <div className="h-px flex-1 border-t border-[#cbc3d5]" />
              <span className="px-4 text-[16px] uppercase tracking-[1.6px] text-[#7a7484]">
                {t('login.or')}
              </span>
              <div className="h-px flex-1 border-t border-[#cbc3d5]" />
            </div>

            <p className="text-center text-[16px] leading-6 text-[#494453]">
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
