import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Image from '@/components/ui/Image';
import AuthPageChrome from '@/portals/auth/components/auth/auth/AuthPageChrome';
import { LOGIN_ASSETS } from '@/portals/auth/data/loginAssets';
import { ROUTES } from '@/shared/config';
import { EMAIL_REGEX } from '@/portals/auth/data/signupAssets';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';

const PasswordRecoveryContent = memo(() => {
  const {
    step,
    globalError,
    isSubmitting,
    register,
    errors,
    emailValue,
    handlers: { submitEmail, submitOtp, submitReset, goToLogin },
  } = usePasswordRecovery();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fieldClass = (hasError) =>
    `w-full rounded-lg border bg-white py-4 px-4 text-[16px] text-[#161c27] placeholder:text-[#6b7280] outline-none transition focus:border-[#ee1c25] focus:ring-2 focus:ring-[#ee1c25]/20 sm:py-4.5 ${
      hasError ? 'border-red-400' : 'border-[#cbc3d5]'
    }`;

  const labelClass = 'mb-2 block text-[16px] leading-6 text-[#494453]';

  return (
    <div className="login-page-root relative min-h-dvh w-full overflow-x-hidden bg-white">
      <AuthPageChrome backLabelKey="login.backHome" />

      <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2">
        {/* Left Side Image Banner */}
        <aside className="relative h-55 overflow-hidden sm:h-75 md:h-90 lg:h-auto lg:min-h-dvh">
          <Image
            src={LOGIN_ASSETS.hero}
            alt=""
            width={724}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-x-0 top-0 bg-linear-to-b from-black/50 via-black/15 to-transparent px-4 pb-8 pt-16 sm:px-6 sm:pt-18 lg:hidden">
            <div className="max-w-70">
              <p className="text-[28px] font-bold leading-tight tracking-[-0.5px] text-white sm:text-[36px]">
                My12Photos
              </p>
              <p className="mt-1 text-[12px] font-normal uppercase tracking-[1.8px] text-white/90 sm:text-[14px]">
                Showcase Your Best Works
              </p>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 hidden bg-linear-to-t from-black/55 via-black/20 to-transparent p-8 pb-13 pl-11.5 lg:block">
            <div className="max-w-md rounded-2xl px-4 py-2">
              <h1 className="text-[48px] font-bold leading-14 tracking-[-0.96px] text-white">
                My12Photos
              </h1>
              <p className="mt-2 text-[18px] font-normal uppercase leading-7 tracking-[1.8px] text-white/90">
                Showcase Your Best Works
              </p>
            </div>
          </div>
        </aside>

        {/* Right Side Form Panel */}
        <section className="relative flex w-full items-start justify-center bg-white px-4 py-8 shadow-none sm:px-8 sm:py-10 md:px-10 lg:min-h-dvh lg:items-center lg:py-12 lg:shadow-[-7px_0_11.4px_rgba(0,0,0,0.25)]">
          <div className="w-full max-w-120 bg-white px-0 py-2 sm:px-2 lg:p-4">
            {step !== 'SUCCESS' && (
              <Link
                to={ROUTES.LOGIN}
                className="mb-6 flex w-fit items-center text-sm font-medium text-gray-500 transition hover:text-[#ee1c25]"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to login
              </Link>
            )}

            <header className="mb-6 flex flex-col items-start gap-2 text-left sm:mb-8">
              <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.3px] text-[#161c27] sm:text-[30px]">
                {step === 'EMAIL' && 'Reset Password'}
                {step === 'OTP' && 'Verify Email'}
                {step === 'RESET' && 'Set New Password'}
                {step === 'SUCCESS' && 'Password Reset'}
              </h2>
              <p className="max-w-88 text-pretty text-[15px] leading-6 text-[#494453] sm:max-w-104 sm:text-[16px]">
                {step === 'EMAIL' &&
                  'Enter your email address and we will send you a code to reset your password.'}
                {step === 'OTP' &&
                  `We sent a verification code to ${emailValue || 'your email'}.`}
                {step === 'RESET' &&
                  'Please enter a new secure password for your account.'}
                {step === 'SUCCESS' &&
                  'Your password has been successfully reset. You can now log in with your new password.'}
              </p>
            </header>

            {globalError && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {globalError}
              </div>
            )}

            {/* STEP 1: EMAIL */}
            {step === 'EMAIL' && (
              <form
                onSubmit={submitEmail}
                noValidate
                className="flex flex-col gap-6"
              >
                <div>
                  <label htmlFor="recovery-email" className={labelClass}>
                    Email Address
                  </label>
                  <Input
                    id="recovery-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email.."
                    error={errors.email}
                    aria-invalid={Boolean(errors.email)}
                    inputClassName={fieldClass(Boolean(errors.email))}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: EMAIL_REGEX,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-[56px] w-full items-center justify-center rounded-lg bg-[#ee1c25] text-[16px] font-medium text-white transition hover:bg-[#d41921]"
                >
                  {isSubmitting ? (
                    <span className="mr-2 size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : null}
                  Send Verification Code
                </Button>
              </form>
            )}

            {/* STEP 2: OTP */}
            {step === 'OTP' && (
              <form
                onSubmit={submitOtp}
                noValidate
                className="flex flex-col gap-6"
              >
                <div>
                  <label htmlFor="recovery-otp" className={labelClass}>
                    Verification Code (OTP)
                  </label>
                  <Input
                    id="recovery-otp"
                    type="text"
                    autoComplete="one-time-code"
                    placeholder="Enter the 4-digit code"
                    error={errors.otp}
                    aria-invalid={Boolean(errors.otp)}
                    inputClassName={fieldClass(Boolean(errors.otp))}
                    {...register('otp', {
                      required: 'Verification code is required',
                    })}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-[56px] w-full items-center justify-center rounded-lg bg-[#ee1c25] text-[16px] font-medium text-white transition hover:bg-[#d41921]"
                >
                  {isSubmitting ? (
                    <span className="mr-2 size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : null}
                  Verify Code
                </Button>
              </form>
            )}

            {/* STEP 3: RESET PASSWORD */}
            {step === 'RESET' && (
              <form
                onSubmit={submitReset}
                noValidate
                className="flex flex-col gap-6"
              >
                <div>
                  <label htmlFor="recovery-password" className={labelClass}>
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="recovery-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      error={errors.password}
                      aria-invalid={Boolean(errors.password)}
                      inputClassName={`${fieldClass(Boolean(errors.password))} pr-12`}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[#6b7280] transition hover:text-[#161c27]"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="recovery-confirm-password"
                    className={labelClass}
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="recovery-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      error={errors.confirmPassword}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      inputClassName={`${fieldClass(Boolean(errors.confirmPassword))} pr-12`}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[#6b7280] transition hover:text-[#161c27]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-[56px] w-full items-center justify-center rounded-lg bg-[#ee1c25] text-[16px] font-medium text-white transition hover:bg-[#d41921]"
                >
                  {isSubmitting ? (
                    <span className="mr-2 size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : null}
                  Reset Password
                </Button>
              </form>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 'SUCCESS' && (
              <div className="flex flex-col items-center py-4 text-center">
                <CheckCircle2 className="mb-6 size-16 text-green-500" />
                <Button
                  onClick={goToLogin}
                  className="flex h-[56px] w-full items-center justify-center rounded-lg bg-[#ee1c25] text-[16px] font-medium text-white transition hover:bg-[#d41921]"
                >
                  Back to Login
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
});

PasswordRecoveryContent.displayName = 'PasswordRecoveryContent';

export default PasswordRecoveryContent;
