import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dropzone from '@/components/ui/Dropzone';
import { Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { useSignUp } from '../hooks/useSignUp';

/**
 * Sign Up page UI — New Full-Page Centered Design
 */
const SignUpContent = memo(() => {
  const [showPassword, setShowPassword] = useState(false);

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
    `h-[52px] w-full rounded-md bg-[#eef0f7] px-[14px] text-[14px] leading-5 text-[#0c0c0c] placeholder:text-[#8c8c8c] outline-none transition focus:ring-2 focus:ring-[#ee1c25]/25 sm:h-[56px] ${
      hasError ? 'ring-2 ring-red-400' : ''
    }`;

  const labelClass =
    'block text-[14px] font-semibold leading-5 text-[#373737] mb-2';

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <header className="mb-10 text-left">
          <h2 className="text-[32px] font-bold tracking-tight text-[#111827] sm:text-[40px]">
            Create your Account
          </h2>
        </header>

        {globalError ? (
          <div
            role="alert"
            className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {globalError}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6 sm:gap-8"
        >
          {/* Row 1: Full Name | Username */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              id="signup-full-name"
              type="text"
              autoComplete="name"
              label="Full Name"
              placeholder="Enter your full name"
              error={errors.fullName}
              aria-invalid={Boolean(errors.fullName)}
              inputClassName={fieldClass(Boolean(errors.fullName))}
              labelClassName={labelClass}
              {...register('fullName', {
                required: 'Full Name is required',
                pattern: {
                  value: /^[a-zA-Z\s]*$/,
                  message: 'Full Name can only contain letters and spaces',
                },
              })}
            />
            <Input
              id="signup-username"
              type="text"
              autoComplete="username"
              label="Username"
              placeholder="@username"
              error={errors.username}
              aria-invalid={Boolean(errors.username)}
              inputClassName={fieldClass(Boolean(errors.username))}
              labelClassName={labelClass}
              {...register('username', { required: 'Username is required' })}
            />
          </div>

          {/* Row 2: Email | Phone */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              label="Email"
              placeholder="Enter your email.."
              error={errors.email}
              aria-invalid={Boolean(errors.email)}
              inputClassName={fieldClass(Boolean(errors.email))}
              labelClassName={labelClass}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: EMAIL_REGEX,
                  message: 'Invalid email address',
                },
              })}
            />
            <Input
              id="signup-phone"
              type="tel"
              autoComplete="tel"
              label="Phone Number"
              placeholder="Enter your Phone number.."
              error={errors.phone}
              aria-invalid={Boolean(errors.phone)}
              inputClassName={fieldClass(Boolean(errors.phone))}
              labelClassName={labelClass}
              {...register('phone', {
                required: 'Phone Number is required',
                pattern: {
                  value: /^\+?[0-9\s-]+$/,
                  message:
                    'Phone Number can only contain numbers, spaces, and dashes',
                },
              })}
            />
          </div>

          {/* Country */}
          <Input
            id="signup-country"
            type="text"
            autoComplete="country-name"
            label="Country"
            placeholder="Country Name"
            error={errors.country}
            aria-invalid={Boolean(errors.country)}
            inputClassName={fieldClass(Boolean(errors.country))}
            labelClassName={labelClass}
            {...register('country', { required: 'Country is required' })}
          />

          {/* About */}
          <div>
            <label
              htmlFor="signup-about"
              className="mb-2 block text-[14px] font-semibold leading-5 text-[#373737]"
            >
              About{' '}
              <span className="text-[12px] font-normal uppercase text-gray-500">
                ( MAX 150 WORDS )
              </span>
            </label>
            <textarea
              id="signup-about"
              rows={4}
              placeholder="write about your information"
              className={`w-full rounded-md bg-[#eef0f7] px-[14px] py-[14px] text-[14px] leading-5 text-[#0c0c0c] placeholder:text-[#8c8c8c] outline-none transition focus:ring-2 focus:ring-[#ee1c25]/25 ${
                errors.about ? 'ring-2 ring-red-400' : ''
              }`}
              {...register('about', { required: 'About is required' })}
            />
            {errors.about && (
              <p className="mt-1 text-sm text-red-500">
                {errors.about.message}
              </p>
            )}
          </div>

          {/* Social Media Link */}
          <div>
            <Input
              id="signup-social"
              type="url"
              label="Social Media Link"
              placeholder="https://instagram.com/username"
              error={errors.socialLink}
              aria-invalid={Boolean(errors.socialLink)}
              inputClassName="h-[52px] w-full rounded-md border border-[#e5e7eb] bg-white px-[14px] text-[14px] leading-5 text-[#0c0c0c] placeholder:text-[#8c8c8c] outline-none transition focus:border-[#ee1c25] focus:ring-1 focus:ring-[#ee1c25]"
              labelClassName={labelClass}
              {...register('socialLink')}
            />
            <button
              type="button"
              className="mt-2 text-[14px] font-semibold text-[#ee1c25] transition hover:text-[#d41921]"
            >
              Add Another
            </button>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Profile Photo</label>
              <Dropzone
                id="signup-profile-photo"
                label="Upload Profile Photo"
                sublabel="JPG, PNG or WebP • 400x400px"
                accept="image/jpeg, image/png, image/webp"
                className="h-32"
                {...register('profilePhoto')}
              />
            </div>
            <div>
              <label className={labelClass}>Cover Photo</label>
              <Dropzone
                id="signup-cover-photo"
                label="Upload Cover Photo"
                sublabel="JPG, PNG or WebP • 1600x600px"
                accept="image/jpeg, image/png, image/webp"
                className="h-32"
                {...register('coverPhoto')}
              />
            </div>
          </div>

          {/* Video */}
          <div>
            <label className={labelClass}>Introduction Video</label>
            <Dropzone
              id="signup-video"
              label="Upload Video"
              sublabel="MP4 • maximum 3 minute video"
              accept="video/mp4"
              className="h-40"
              {...register('video')}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              label="Password"
              placeholder="write a strong password"
              error={errors.password}
              aria-invalid={Boolean(errors.password)}
              inputClassName={`${fieldClass(Boolean(errors.password))} pr-12`}
              labelClassName={labelClass}
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
              className="absolute right-4 top-[38px] flex h-[24px] w-[24px] items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none sm:top-[40px]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </div>

          {/* Submit */}
          <div className="mt-4 flex w-full flex-col items-center gap-5 sm:gap-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              unstyled
              className="inline-flex h-[52px] w-full items-center justify-center rounded-md bg-[#ee1c25] px-4 py-3 text-[16px] font-medium text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              Sign UP
            </Button>

            <p className="text-center text-[15px] leading-normal text-[#111827] sm:text-[16px]">
              Already Have an account{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-bold text-[#ee1c25] hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
});

SignUpContent.displayName = 'SignUpContent';

export default SignUpContent;
