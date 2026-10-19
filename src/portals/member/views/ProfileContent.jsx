import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import React, { forwardRef, memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import {
  ADMIN_PROFILE_ASSETS,
  AVATAR_SIZE,
  DEFAULT_ADMIN_PROFILE,
  EYE_ICON_HEIGHT,
  EYE_ICON_WIDTH,
  USER_ICON_SIZE,
} from '@/portals/member/data/profileData';
import useUserProfileMe from '@/portals/member/hooks/useUserProfileMe';
import { changePasswordApi } from '@/shared/api/auth.api';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  updateUserProfileApi,
  USER_PROFILE_ME_QUERY_KEY,
} from '@/shared/api/userProfile.api';

const labelClass = 'text-[14px] font-normal leading-[1.5] text-[#464646]';
const inputClass =
  'w-full rounded-[8px] border border-[rgba(0,0,0,0.4)] bg-white px-4 py-[14px] text-[14px] font-normal leading-[1.5] text-[#1d1d1d] outline-none placeholder:text-[#989da1] focus:border-[#4048cd]';
const passwordInputClass = `${inputClass} pr-12`;
const sectionTitleClass =
  'font-crimson text-[20px] font-medium leading-normal text-[#4c515b]';
const primaryButtonClass =
  'inline-flex cursor-pointer items-center justify-center rounded-[4px] bg-[#4048cd] px-6 py-3 font-crimson text-[16px] font-normal leading-normal text-white transition hover:bg-[#353cb0] disabled:opacity-60';

const readOnlyInputClass =
  'w-full cursor-not-allowed rounded-[8px] border border-[#d6d8dd] bg-[#f4f5f7] px-4 py-[14px] text-[14px] font-medium leading-[1.5] text-[#6b7280] outline-none select-none';

const ProfileInput = memo(
  forwardRef(
    (
      {
        id,
        label,
        type = 'text',
        autoComplete,
        placeholder,
        error,
        readOnly = false,
        disabled = false,
        badge,
        helperText,
        ...props
      },
      ref,
    ) => (
      <div className="flex w-full min-w-0 flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
          {badge}
        </div>
        <Input
          id={id}
          ref={ref}
          type={type}
          readOnly={readOnly}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          error={error}
          inputClassName={readOnly ? readOnlyInputClass : inputClass}
          labelClassName="hidden"
          {...props}
        />
        {helperText ? (
          <p className="text-[12px] leading-4 text-[#8c93a0]">{helperText}</p>
        ) : null}
      </div>
    ),
  ),
);

ProfileInput.displayName = 'ProfileInput';

const PasswordInput = memo(
  forwardRef(
    (
      {
        id,
        label,
        autoComplete,
        placeholder,
        error,
        show,
        onToggleShow,
        ...props
      },
      ref,
    ) => {
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
            <Button
              unstyled
              type="button"
              onClick={onToggleShow}
              aria-label={
                show ? t('login.hidePassword') : t('login.showPassword')
              }
              aria-pressed={show}
              className="absolute right-4 top-1/2 flex h-5 w-6 -translate-y-1/2 cursor-pointer items-center justify-center"
            >
              <Image
                src={
                  show ? ADMIN_PROFILE_ASSETS.eyeOff : ADMIN_PROFILE_ASSETS.eye
                }
                alt=""
                width={EYE_ICON_WIDTH}
                height={EYE_ICON_HEIGHT}
                className="h-3.75 w-5.5 object-contain"
              />
            </Button>
          </div>
        </div>
      );
    },
  ),
);

PasswordInput.displayName = 'PasswordInput';

/**
 * My Profile — Figma node 339:5727 (admin main area; sidebar from Layout).
 */
const ProfileContent = memo(() => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data: userProfile } = useUserProfileMe();

  const [displayName, setDisplayName] = useState(
    userProfile?.name || DEFAULT_ADMIN_PROFILE.displayName,
  );
  const [displayEmail, setDisplayEmail] = useState(
    userProfile?.email || DEFAULT_ADMIN_PROFILE.displayEmail,
  );

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: userProfile?.name || DEFAULT_ADMIN_PROFILE.name,
      email: userProfile?.email || DEFAULT_ADMIN_PROFILE.email,
    },
  });

  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setDisplayName(userProfile.name);
      if (userProfile.email) setDisplayEmail(userProfile.email);
      resetProfile({
        name: userProfile.name || '',
        email: userProfile.email || '',
      });
    }
  }, [userProfile, resetProfile]);

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

  const updateProfileMutation = useMutation({
    mutationFn: (formData) => updateUserProfileApi(formData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_ME_QUERY_KEY });
      const updatedUser = response?.data || response;
      if (updatedUser) {
        try {
          const stored = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem(
            'user',
            JSON.stringify({ ...stored, ...updatedUser }),
          );
        } catch {
          // ignore
        }
        dispatch(updateUser(updatedUser));
      }
      toast.success(
        response?.message || t('userProfile.account.updateSuccess'),
      );
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('common.error', 'Failed to update profile. Please try again.'),
        ),
      );
    },
  });

  const onSubmitProfile = (data) => {
    setDisplayName(data.name.trim());
    setDisplayEmail(data.email.trim());

    const formData = new FormData();
    formData.append('name', data.name.trim());
    formData.append('email', data.email.trim());
    if (userProfile?.username) {
      formData.append('username', userProfile.username);
    }
    if (userProfile?.phone) {
      formData.append('phone', userProfile.phone);
    }

    updateProfileMutation.mutate(formData);
  };

  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      changePasswordApi({ currentPassword, newPassword }),
    onSuccess: (response) => {
      resetPassword();
      toast.success(
        response?.message || t('userProfile.security.success'),
      );
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t(
            'userProfile.errors.passwordChangeFailed',
            'Failed to change password. Please check your current password.',
          ),
        ),
      );
    },
  });

  const onSubmitPassword = (data) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
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
              <Image
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
            <h2 className={sectionTitleClass}>
              {t('userProfile.account.title')}
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileInput
                id="admin-profile-name"
                label={t('userProfile.account.name')}
                autoComplete="organization"
                error={profileErrors.name}
                {...registerProfile('name', {
                  required: t('userProfile.errors.nameRequired'),
                })}
              />
              <ProfileInput
                id="admin-profile-email"
                label={t('userProfile.account.email')}
                type="email"
                readOnly={true}
                disabled={true}
                autoComplete="email"
                badge={
                  <span className="inline-flex items-center gap-1 rounded bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-semibold text-[#6b7280]">
                    <Lock size={11} aria-hidden="true" />
                    {t('common.readOnly', 'Not changeable')}
                  </span>
                }
                helperText={t(
                  'memberSettings.profile.emailNotChangeable',
                  'Email address cannot be changed.',
                )}
                error={profileErrors.email}
                {...registerProfile('email')}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                unstyled={true}
                disabled={updateProfileMutation.isPending}
                className={primaryButtonClass}
              >
                {updateProfileMutation.isPending
                  ? t('common.saving', 'Saving...')
                  : t('userProfile.account.update')}
              </Button>
            </div>
          </form>
        </div>

        <form
          onSubmit={handlePasswordSubmit(onSubmitPassword)}
          noValidate
          className="flex w-full flex-col gap-6"
        >
          <h2 className={sectionTitleClass}>
            {t('userProfile.security.title')}
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <PasswordInput
              id="admin-profile-current-password"
              label={t('userProfile.security.currentPassword')}
              autoComplete="current-password"
              placeholder=".........."
              error={passwordErrors.currentPassword}
              show={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword((s) => !s)}
              {...registerPassword('currentPassword', {
                required: t('userProfile.errors.currentPassword'),
              })}
            />
            <PasswordInput
              id="admin-profile-new-password"
              label={t('userProfile.security.newPassword')}
              autoComplete="new-password"
              placeholder=".........."
              error={passwordErrors.newPassword}
              show={showNewPassword}
              onToggleShow={() => setShowNewPassword((s) => !s)}
              {...registerPassword('newPassword', {
                required: t('userProfile.errors.newPassword'),
                minLength: {
                  value: 8,
                  message: t('userProfile.errors.passwordShort'),
                },
              })}
            />
            <PasswordInput
              id="admin-profile-confirm-password"
              label={t('userProfile.security.confirmPassword')}
              autoComplete="new-password"
              placeholder="........."
              error={passwordErrors.confirmPassword}
              show={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword((s) => !s)}
              {...registerPassword('confirmPassword', {
                required: t('userProfile.errors.confirmPassword'),
                validate: (value) =>
                  value === watchPassword('newPassword') ||
                  t('userProfile.errors.passwordMismatch'),
              })}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              unstyled={true}
              disabled={changePasswordMutation.isPending}
              className={primaryButtonClass}
            >
              {changePasswordMutation.isPending
                ? t('common.saving', 'Saving...')
                : t('userProfile.security.changePassword')}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
});

ProfileContent.displayName = 'ProfileContent';

export default ProfileContent;
