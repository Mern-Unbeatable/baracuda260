import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginSuccess } from '@/app/store/slices/authSlice';
import { ROUTES } from '@/shared/config';
import { httpMethods } from '@/shared/lib/httpMethods';
import { API_ENDPOINTS } from '@/shared/lib/httpEndpoint';
import AuthPageChrome from '@/modules/auth/components/auth/auth/AuthPageChrome';
import { EMAIL_REGEX, SIGNUP_ASSETS } from '@/modules/auth/data/signupAssets';

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
          form: error?.data?.message ?? error?.message ?? t('signup.registerFailed'),
        });
        return;
      }

      const token = data?.token ?? data?.data?.token ?? data?.accessToken;
      const user = data?.user ??
        data?.data?.user ?? {
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
    `h-[52px] w-full rounded-lg bg-[#ecedfa] px-[14px] text-[14px] leading-5 text-[#0c0c0c] placeholder:text-[#8c8c8c] outline-none transition focus:ring-2 focus:ring-[#ee1c25]/25 sm:h-[60px] ${
      hasError ? 'ring-2 ring-red-400' : ''
    }`;

  return (
    <div className="signup-page-root relative min-h-dvh w-full overflow-x-hidden bg-white">
      <AuthPageChrome backLabelKey="signup.backHome" />

      <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[minmax(0,724fr)_minmax(0,720fr)]">
        <aside className="relative h-55 overflow-hidden sm:h-75 md:h-90 lg:h-auto lg:min-h-dvh">
          <img
            src={SIGNUP_ASSETS.hero}
            alt=""
            width={724}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-x-0 top-0 bg-linear-to-b from-black/50 via-black/15 to-transparent px-4 pb-8 pt-16 sm:px-6 sm:pt-18 lg:hidden">
            <div className="max-w-70">
              <p className="text-[28px] font-bold leading-tight tracking-[-0.5px] text-white sm:text-[36px]">
                {t('signup.brandTitle')}
              </p>
              <p className="mt-1 text-[11px] font-normal uppercase tracking-[1.4px] text-white/90 sm:text-[14px] sm:tracking-[1.8px]">
                {t('signup.brandTagline')}
              </p>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 hidden bg-linear-to-t from-black/55 via-black/20 to-transparent p-8 pb-13 pl-11.5 lg:block">
            <div className="max-w-md rounded-2xl px-4 py-2">
              <h1 className="text-[48px] font-bold leading-14 tracking-[-0.96px] text-white">
                {t('signup.brandTitle')}
              </h1>
              <p className="mt-2 text-[18px] font-normal uppercase leading-7 tracking-[1.8px] text-white/90">
                {t('signup.brandTagline')}
              </p>
            </div>
          </div>
        </aside>

        <section className="relative flex w-full items-start justify-center bg-white px-4 py-8 shadow-none sm:px-8 sm:py-10 md:px-10 lg:min-h-dvh lg:items-center lg:py-12 lg:shadow-[-7px_0_11.4px_rgba(0,0,0,0.25)]">
          <div className="flex w-full max-w-153.75 flex-col gap-7 sm:gap-9">
            <header>
              <h2 className="text-center text-[26px] font-semibold leading-normal text-[#0c0c0c] sm:text-[32px] lg:text-[40px]">
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

            <form
              onSubmit={handleSignUp}
              noValidate
              className="flex w-full flex-col gap-6 sm:gap-7.5"
            >
              <div className="flex w-full flex-col gap-3.5 sm:gap-4">
                <div className="flex w-full flex-col gap-2 sm:gap-2.5">
                  <label
                    htmlFor="signup-full-name"
                    className="block text-[15px] font-medium leading-5 text-[#373737] sm:text-[16px]"
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

                <div className="flex w-full flex-col gap-2 sm:gap-2.5">
                  <label
                    htmlFor="signup-username"
                    className="block text-[15px] font-medium leading-5 text-[#373737] sm:text-[16px]"
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

                <div className="flex w-full flex-col gap-2 sm:gap-2.5">
                  <label
                    htmlFor="signup-email"
                    className="block text-[15px] font-medium leading-5 text-[#373737] sm:text-[16px]"
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

                <div className="flex w-full flex-col gap-2 sm:gap-2.5">
                  <label
                    htmlFor="signup-phone"
                    className="block text-[15px] font-medium leading-5 text-[#373737] sm:text-[16px]"
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

                <div className="flex w-full flex-col gap-2 sm:gap-2.5">
                  <label
                    htmlFor="signup-country"
                    className="block text-[15px] font-medium leading-5 text-[#373737] sm:text-[16px]"
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

                <div className="flex w-full flex-col gap-2 sm:gap-2.5">
                  <label
                    htmlFor="signup-password"
                    className="block text-[15px] font-medium leading-5 text-[#373737] sm:text-[16px]"
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

              <div className="flex w-full flex-col items-center gap-5 pb-4 sm:gap-6">
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

                <p className="text-center text-[15px] leading-normal text-[#a7a7a7] sm:text-[16px]">
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
