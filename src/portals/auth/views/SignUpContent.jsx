import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import AuthPageChrome from '@/portals/auth/components/auth/auth/AuthPageChrome';
import { SIGNUP_ASSETS } from '@/portals/auth/data/signupAssets';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useSignUp } from '../hooks/useSignUp';

/**
 * Sign Up page UI — Figma node 111:1024 (baracuda260 Copy).
 */
const SignUpContent = memo(() => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    globalError,
    t,
    EMAIL_REGEX,
  } = useSignUp();

  const fieldClass = (hasError) =>
    `h-[52px] w-full rounded-lg bg-[#ecedfa] px-[14px] text-[14px] leading-5 text-[#0c0c0c] placeholder:text-[#8c8c8c] outline-none transition focus:ring-2 focus:ring-[#ee1c25]/25 sm:h-[60px] ${
      hasError ? 'ring-2 ring-red-400' : ''
    }`;
    
  const labelClass = "block text-[15px] font-medium leading-5 text-[#373737] sm:text-[16px] mb-2 sm:mb-2.5";

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

            {globalError ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {globalError}
              </div>
            ) : null}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex w-full flex-col gap-6 sm:gap-7.5"
            >
              <div className="flex w-full flex-col gap-3.5 sm:gap-4">
                <Input
                  id="signup-full-name"
                  type="text"
                  autoComplete="name"
                  label={t('signup.fullName')}
                  placeholder={t('signup.fullNamePlaceholder')}
                  error={errors.fullName}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'signup-full-name-error' : undefined}
                  inputClassName={fieldClass(Boolean(errors.fullName))}
                  labelClassName={labelClass}
                  {...register('fullName', { required: t('signup.fullNameRequired') })}
                />

                <Input
                  id="signup-username"
                  type="text"
                  autoComplete="username"
                  label={t('signup.username')}
                  placeholder={t('signup.usernamePlaceholder')}
                  error={errors.username}
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? 'signup-username-error' : undefined}
                  inputClassName={fieldClass(Boolean(errors.username))}
                  labelClassName={labelClass}
                  {...register('username', { required: t('signup.usernameRequired') })}
                />

                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  label={t('signup.email')}
                  placeholder={t('signup.emailPlaceholder')}
                  error={errors.email}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'signup-email-error' : undefined}
                  inputClassName={fieldClass(Boolean(errors.email))}
                  labelClassName={labelClass}
                  {...register('email', { 
                    required: t('signup.emailRequired'),
                    pattern: { value: EMAIL_REGEX, message: t('signup.emailInvalid') }
                  })}
                />

                <Input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  label={t('signup.phone')}
                  placeholder={t('signup.phonePlaceholder')}
                  error={errors.phone}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'signup-phone-error' : undefined}
                  inputClassName={fieldClass(Boolean(errors.phone))}
                  labelClassName={labelClass}
                  {...register('phone', { required: t('signup.phoneRequired') })}
                />

                <Input
                  id="signup-country"
                  type="text"
                  autoComplete="country-name"
                  label={t('signup.country')}
                  placeholder={t('signup.countryPlaceholder')}
                  error={errors.country}
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={errors.country ? 'signup-country-error' : undefined}
                  inputClassName={fieldClass(Boolean(errors.country))}
                  labelClassName={labelClass}
                  {...register('country', { required: t('signup.countryRequired') })}
                />

                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  label={t('signup.password')}
                  placeholder={t('signup.passwordPlaceholder')}
                  error={errors.password}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'signup-password-error' : undefined}
                  inputClassName={fieldClass(Boolean(errors.password))}
                  labelClassName={labelClass}
                  {...register('password', { 
                    required: t('signup.passwordRequired'),
                    minLength: { value: 8, message: t('signup.passwordTooShort') }
                  })}
                />
              </div>

              <div className="flex w-full flex-col items-center gap-5 pb-4 sm:gap-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  unstyled
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#ee1c25] px-4 py-3 text-[16px] font-medium text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : null}
                  {isSubmitting ? t('signup.submitting') : t('signup.submit')}
                </Button>

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
