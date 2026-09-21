import { useTranslation } from 'react-i18next';
import React, { memo, useState, forwardRef } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import {
  ADMIN_PROFILE_ASSETS,
  AVATAR_SIZE,
  EYE_ICON_HEIGHT,
  EYE_ICON_WIDTH,
  USER_ICON_SIZE,
  DEFAULT_ADMIN_PROFILE,
} from '@/portals/member/data/profileData';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const labelClass = 'text-[14px] font-normal leading-[1.5] text-[#464646]';
const inputClass =
  'w-full rounded-[8px] border border-[rgba(0,0,0,0.4)] bg-white px-4 py-[14px] text-[14px] font-normal leading-[1.5] text-[#1d1d1d] outline-none placeholder:text-[#989da1] focus:border-[#4048cd]';
const passwordInputClass = `${inputClass} pr-12`;
const sectionTitleClass =
  'font-crimson text-[20px] font-medium leading-normal text-[#4c515b]';
const primaryButtonClass =
  'inline-flex cursor-pointer items-center justify-center rounded-[4px] bg-[#4048cd] px-6 py-3 font-crimson text-[16px] font-normal leading-normal text-white transition hover:bg-[#353cb0]';

const ProfileInput = memo(
  forwardRef(({ id, label, type = 'text', autoComplete, placeholder, error, ...props }, ref) => (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <Input
        id={id}
        ref={ref}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        error={error}
        inputClassName={inputClass}
        labelClassName="hidden"
        {...props}
      />
    </div>
  ))
);

ProfileInput.displayName = 'ProfileInput';

const PasswordInput = memo(
  forwardRef(({
    id,
    label,
    autoComplete,
    placeholder,
    error,
    show,
    onToggleShow,
    ...props
  }, ref) => {
    const { t } = useTranslation();

    return (
      <div className="flex w-full min-w-0 flex-col gap-3">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <div className="relative w-full">
          <Input
            id={id}
            ref={ref}
            type={show ? 'text' : 'password'}
            autoComplete={autoComplete}
            placeholder={placeholder}
            error={error}
            inputClassName={passwordInputClass}
            labelClassName="hidden"
            {...props}
          />
          <button
            type="button"
            onClick={onToggleShow}
            aria-label={show ? t('login.hidePassword') : t('login.showPassword')}
            aria-pressed={show}
            className="absolute right-4 top-1/2 flex h-5 w-6 -translate-y-1/2 cursor-pointer items-center justify-center"
          >
            <img
              src={show ? ADMIN_PROFILE_ASSETS.eyeOff : ADMIN_PROFILE_ASSETS.eye}
              alt=""
              width={EYE_ICON_WIDTH}
              height={EYE_ICON_HEIGHT}
              className="h-3.75 w-5.5 object-contain"
            />
          </button>
        </div>
      </div>
    );
  })
);

PasswordInput.displayName = 'PasswordInput';

/**
 * My Profile — Figma node 339:5727 (admin main area; sidebar from Layout).
 */
const ProfileContent = memo(() => {
  const { t } = useTranslation();
  
  const [displayName, setDisplayName] = useState(DEFAULT_ADMIN_PROFILE.displayName);
  const [displayEmail, setDisplayEmail] = useState(DEFAULT_ADMIN_PROFILE.displayEmail);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: DEFAULT_ADMIN_PROFILE.name,
      email: DEFAULT_ADMIN_PROFILE.email,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPassword,
  } = useForm();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmitProfile = (data) => {
    setDisplayName(data.name.trim());
    setDisplayEmail(data.email.trim());
    toast.success(t('userProfile.account.updateSuccess'));
  };

  const onSubmitPassword = (_data) => {
    resetPassword();
    toast.success(t('userProfile.security.success'));
  };

  return (
    <div className="flex w-full flex-col gap-5 py-2 sm:py-4">
      <header className="flex max-w-178.5 flex-col gap-2">
        <h1 className="font-crimson text-[28px] font-semibold leading-normal text-[#050609] sm:text-[36px]">
          {t('userProfile.title')}
        </h1>
        <p className="font-poppins text-[16px] font-normal leading-normal text-[#464646]">
          {t('userProfile.subtitle')}
        </p>
      </header>

      <section
        aria-label={t('userProfile.cardAria')}
        className="flex w-full flex-col gap-5 overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.2)] bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-10.25 lg:py-13.5"
      >
        <div className="flex flex-col gap-11">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div
              className="flex shrink-0 items-center justify-center rounded-full bg-[#e9eaeb] pb-3.25 pl-3.25 pr-3 pt-3"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            >
              <img
                src={ADMIN_PROFILE_ASSETS.user}
                alt=""
                width={USER_ICON_SIZE}
                height={USER_ICON_SIZE}
                className="size-14"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="font-crimson text-[20px] font-semibold leading-normal text-[#0c0c0c] sm:text-[24px]">
                {displayName}
              </p>
              <p className="font-poppins text-[16px] font-normal leading-normal text-[#464646]">
                {displayEmail}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleProfileSubmit(onSubmitProfile)}
            noValidate
            className="flex w-full flex-col gap-6"
          >
            <h2 className={sectionTitleClass}>{t('userProfile.account.title')}</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileInput
                id="admin-profile-name"
                label={t('userProfile.account.name')}
                autoComplete="organization"
                error={profileErrors.name}
                {...registerProfile('name', { required: t('userProfile.errors.nameRequired') })}
              />
              <ProfileInput
                id="admin-profile-email"
                label={t('userProfile.account.email')}
                type="email"
                autoComplete="email"
                error={profileErrors.email}
                {...registerProfile('email', { 
                  required: t('userProfile.errors.emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('userProfile.errors.emailInvalid')
                  }
                })}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" unstyled={true} className={primaryButtonClass}>
                {t('userProfile.account.update')}
              </Button>
            </div>
          </form>
        </div>

        <form
          onSubmit={handlePasswordSubmit(onSubmitPassword)}
          noValidate
          className="flex w-full flex-col gap-6"
        >
          <h2 className={sectionTitleClass}>{t('userProfile.security.title')}</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <PasswordInput
              id="admin-profile-current-password"
              label={t('userProfile.security.currentPassword')}
              autoComplete="current-password"
              placeholder=".........."
              error={passwordErrors.currentPassword}
              show={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword(s => !s)}
              {...registerPassword('currentPassword', { required: t('userProfile.errors.currentPassword') })}
            />
            <PasswordInput
              id="admin-profile-new-password"
              label={t('userProfile.security.newPassword')}
              autoComplete="new-password"
              placeholder=".........."
              error={passwordErrors.newPassword}
              show={showNewPassword}
              onToggleShow={() => setShowNewPassword(s => !s)}
              {...registerPassword('newPassword', { 
                required: t('userProfile.errors.newPassword'),
                minLength: { value: 8, message: t('userProfile.errors.passwordShort') }
              })}
            />
            <PasswordInput
              id="admin-profile-confirm-password"
              label={t('userProfile.security.confirmPassword')}
              autoComplete="new-password"
              placeholder="........."
              error={passwordErrors.confirmPassword}
              show={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword(s => !s)}
              {...registerPassword('confirmPassword', { 
                required: t('userProfile.errors.confirmPassword'),
                validate: value => value === watchPassword('newPassword') || t('userProfile.errors.passwordMismatch')
              })}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" unstyled={true} className={primaryButtonClass}>
              {t('userProfile.security.changePassword')}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
});

ProfileContent.displayName = 'ProfileContent';

export default ProfileContent;
