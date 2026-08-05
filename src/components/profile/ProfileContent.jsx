import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  ADMIN_PROFILE_ASSETS,
  AVATAR_SIZE,
  EYE_ICON_HEIGHT,
  EYE_ICON_WIDTH,
  USER_ICON_SIZE,
} from './profileData';
import useAdminProfile from './useAdminProfile';

const labelClass = 'text-[14px] font-normal leading-[1.5] text-[#464646]';
const inputClass =
  'w-full rounded-[8px] border border-[rgba(0,0,0,0.4)] bg-white px-4 py-[14px] text-[14px] font-normal leading-[1.5] text-[#1d1d1d] outline-none placeholder:text-[#989da1] focus:border-[#4048cd]';
const passwordInputClass = `${inputClass} pr-12`;
const sectionTitleClass =
  'font-crimson text-[20px] font-medium leading-normal text-[#4c515b]';
const primaryButtonClass =
  'inline-flex cursor-pointer items-center justify-center rounded-[4px] bg-[#4048cd] px-6 py-3 font-crimson text-[16px] font-normal leading-normal text-white transition hover:bg-[#353cb0]';

/**
 * @param {{
 *   id: string,
 *   label: string,
 *   value: string,
 *   onChange: (value: string) => void,
 *   type?: string,
 *   autoComplete?: string,
 *   placeholder?: string,
 *   error?: string,
 * }} props
 */
const ProfileInput = memo(
  ({ id, label, value, onChange, type = 'text', autoComplete, placeholder, error }) => (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={inputClass}
      />
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  ),
);

ProfileInput.displayName = 'ProfileInput';

/**
 * @param {{
 *   id: string,
 *   label: string,
 *   value: string,
 *   onChange: (value: string) => void,
 *   autoComplete?: string,
 *   placeholder?: string,
 *   error?: string,
 *   show: boolean,
 *   onToggleShow: () => void,
 * }} props
 */
const PasswordInput = memo(
  ({
    id,
    label,
    value,
    onChange,
    autoComplete,
    placeholder,
    error,
    show,
    onToggleShow,
  }) => {
    const { t } = useTranslation();

    return (
      <div className="flex w-full min-w-0 flex-col gap-3">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <div className="relative w-full">
          <input
            id={id}
            type={show ? 'text' : 'password'}
            autoComplete={autoComplete}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            className={passwordInputClass}
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
              className="h-[15px] w-[22px] object-contain"
            />
          </button>
        </div>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

/**
 * My Profile — Figma node 339:5727 (admin main area; sidebar from Layout).
 */
const ProfileContent = memo(() => {
  const { t } = useTranslation();
  const {
    displayName,
    displayEmail,
    name,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
    profileErrors,
    passwordErrors,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    handleNameChange,
    handleEmailChange,
    handleCurrentPasswordChange,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleToggleShowCurrentPassword,
    handleToggleShowNewPassword,
    handleToggleShowConfirmPassword,
    submitProfile,
    submitPassword,
  } = useAdminProfile();

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    if (!submitProfile(t)) return;
    toast.success(t('userProfile.account.updateSuccess'));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (!submitPassword(t)) return;
    toast.success(t('userProfile.security.success'));
  };

  return (
    <div className="flex w-full flex-col gap-5 py-2 sm:py-4">
      <header className="flex max-w-[714px] flex-col gap-2">
        <h1 className="font-crimson text-[28px] font-semibold leading-normal text-[#050609] sm:text-[36px]">
          {t('userProfile.title')}
        </h1>
        <p className="font-poppins text-[16px] font-normal leading-[1.5] text-[#464646]">
          {t('userProfile.subtitle')}
        </p>
      </header>

      <section
        aria-label={t('userProfile.cardAria')}
        className="flex w-full flex-col gap-5 overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.2)] bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-[41px] lg:py-[54px]"
      >
        <div className="flex flex-col gap-11">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div
              className="flex shrink-0 items-center justify-center rounded-full bg-[#e9eaeb] pb-[13px] pl-[13px] pr-3 pt-3"
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
              <p className="font-poppins text-[16px] font-normal leading-[1.5] text-[#464646]">
                {displayEmail}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleProfileSubmit}
            noValidate
            className="flex w-full flex-col gap-6"
          >
            <h2 className={sectionTitleClass}>{t('userProfile.account.title')}</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileInput
                id="admin-profile-name"
                label={t('userProfile.account.name')}
                value={name}
                onChange={handleNameChange}
                autoComplete="organization"
                error={profileErrors.name}
              />
              <ProfileInput
                id="admin-profile-email"
                label={t('userProfile.account.email')}
                value={email}
                onChange={handleEmailChange}
                type="email"
                autoComplete="email"
                error={profileErrors.email}
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className={primaryButtonClass}>
                {t('userProfile.account.update')}
              </button>
            </div>
          </form>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          noValidate
          className="flex w-full flex-col gap-6"
        >
          <h2 className={sectionTitleClass}>{t('userProfile.security.title')}</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <PasswordInput
              id="admin-profile-current-password"
              label={t('userProfile.security.currentPassword')}
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              autoComplete="current-password"
              placeholder=".........."
              error={passwordErrors.currentPassword}
              show={showCurrentPassword}
              onToggleShow={handleToggleShowCurrentPassword}
            />
            <PasswordInput
              id="admin-profile-new-password"
              label={t('userProfile.security.newPassword')}
              value={newPassword}
              onChange={handleNewPasswordChange}
              autoComplete="new-password"
              placeholder=".........."
              error={passwordErrors.newPassword}
              show={showNewPassword}
              onToggleShow={handleToggleShowNewPassword}
            />
            <PasswordInput
              id="admin-profile-confirm-password"
              label={t('userProfile.security.confirmPassword')}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              autoComplete="new-password"
              placeholder="........."
              error={passwordErrors.confirmPassword}
              show={showConfirmPassword}
              onToggleShow={handleToggleShowConfirmPassword}
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className={primaryButtonClass}>
              {t('userProfile.security.changePassword')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
});

ProfileContent.displayName = 'ProfileContent';

export default ProfileContent;
