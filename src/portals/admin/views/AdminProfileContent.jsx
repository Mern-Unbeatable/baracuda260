import { Lock } from 'lucide-react';
import React, { forwardRef, memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { selectUser, updateUser } from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import {
  ADMIN_PROFILE_ASSETS,
  AVATAR_SIZE,
  EYE_ICON_HEIGHT,
  EYE_ICON_WIDTH,
  USER_ICON_SIZE,
} from '@/portals/member/data/profileData';
import {
  ADMIN_PROFILE_QUERY_KEY,
  changeAdminPasswordApi,
  getAdminProfileApi,
  updateAdminProfileApi,
} from '@/shared/api/adminProfile.api';
import { getApiErrorMessage } from '@/shared/api/client';

const labelClass = 'text-[14px] font-normal leading-[1.5] text-[#464646]';
const inputClass =
  'w-full rounded-[8px] border border-[rgba(0,0,0,0.4)] bg-white px-4 py-[14px] text-[14px] font-normal leading-[1.5] text-[#1d1d1d] outline-none placeholder:text-[#989da1] focus:border-[#4048cd]';
const readOnlyInputClass =
  'w-full cursor-not-allowed rounded-[8px] border border-[#d6d8dd] bg-[#f4f5f7] px-4 py-[14px] text-[14px] font-medium leading-[1.5] text-[#6b7280] outline-none select-none';
const passwordInputClass = `${inputClass} pr-12`;
const sectionTitleClass =
  'font-crimson text-[20px] font-medium leading-normal text-[#4c515b]';
const primaryButtonClass =
  'inline-flex cursor-pointer items-center justify-center rounded-[4px] bg-[#4048cd] px-6 py-3 font-crimson text-[16px] font-normal leading-normal text-white transition hover:bg-[#353cb0] disabled:cursor-not-allowed disabled:opacity-50';

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
        helperText,
        badge,
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
          autoComplete={autoComplete}
          placeholder={placeholder}
          error={error}
          readOnly={readOnly}
          disabled={disabled}
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
              type="button"
              unstyled={true}
              onClick={onToggleShow}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#8b8e93] hover:text-[#464646]"
              aria-label={
                show
                  ? t('userProfile.security.hidePassword')
                  : t('userProfile.security.showPassword')
              }
            >
              <Image
                src={
                  show ? ADMIN_PROFILE_ASSETS.eyeOff : ADMIN_PROFILE_ASSETS.eye
                }
                alt=""
                width={EYE_ICON_WIDTH}
                height={EYE_ICON_HEIGHT}
                className="h-[15px] w-[22px]"
              />
            </Button>
          </div>
        </div>
      );
    },
  ),
);

PasswordInput.displayName = 'PasswordInput';

const AdminProfileContent = memo(() => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const reduxUser = useSelector(selectUser);

  // 1. Fetch remote admin profile or fallback to Redux/localStorage
  const { data: profileData } = useQuery({
    queryKey: ADMIN_PROFILE_QUERY_KEY,
    queryFn: getAdminProfileApi,
    staleTime: 60 * 1000,
  });

  const currentUser = profileData || reduxUser || {};
  const currentName = currentUser.name || 'Chowdhury Group Of Industries';
  const currentEmail = currentUser.email || 'admin@my12photos.com';

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: currentName,
      email: currentEmail,
    },
  });

  useEffect(() => {
    if (currentUser.name || currentUser.email) {
      resetProfile({
        name: currentUser.name || currentName,
        email: currentUser.email || currentEmail,
      });
    }
  }, [currentUser.name, currentUser.email, resetProfile, currentName, currentEmail]);

  // 2. Profile Update Mutation (PATCH /api/v1/admin/profile)
  const updateMutation = useMutation({
    mutationFn: ({ name }) => updateAdminProfileApi({ name }),
    onSuccess: (response) => {
      const payload = response?.data !== undefined ? response.data : response;
      const updatedUser = {
        ...(currentUser || {}),
        ...(payload || {}),
        name: payload?.name || payload?.name,
      };

      dispatch(updateUser(updatedUser));
      try {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem(
          'user',
          JSON.stringify({ ...stored, ...updatedUser }),
        );
      } catch {
        // ignore localStorage parse issues
      }

      queryClient.invalidateQueries({ queryKey: ADMIN_PROFILE_QUERY_KEY });
      toast.success(
        response?.message ||
          t('adminProfile.updateSuccess', 'Admin profile updated successfully'),
      );
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('adminProfile.updateError', 'Failed to update admin profile.'),
        ),
      );
    },
  });

  const onSubmitProfile = (formData) => {
    updateMutation.mutate({ name: formData.name.trim() });
  };

  // Password section state
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

  // 3. Change Password Mutation (POST /api/v1/admin/profile/change-password)
  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      changeAdminPasswordApi({ currentPassword, newPassword }),
    onSuccess: (response) => {
      resetPassword();
      toast.success(
        response?.message ||
          t('userProfile.security.success', 'Password successfully changed'),
      );
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('userProfile.security.error', 'Failed to change password.'),
        ),
      );
    },
  });

  const onSubmitPassword = (formData) => {
    changePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  return (
    <div className="flex w-full flex-col gap-5 py-2 sm:py-4">
      <header className="flex max-w-178.5 flex-col gap-2">
        <h1 className="font-crimson text-[28px] font-semibold leading-normal text-[#050609] sm:text-[36px]">
          {t('userProfile.title', 'My Profile')}
        </h1>
        <p className="font-poppins text-[16px] font-normal leading-normal text-[#464646]">
          {t('userProfile.subtitle', 'Manage your My12Photos admin account information.')}
        </p>
      </header>

      <section
        aria-label={t('userProfile.cardAria', 'Account Details')}
        className="flex w-full flex-col gap-5 overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.2)] bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-10.25 lg:py-13.5"
      >
        <div className="flex flex-col gap-11">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div
              className="flex shrink-0 items-center justify-center rounded-full bg-[#e9eaeb] pb-3.25 pl-3.25 pr-3 pt-3"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            >
              {currentUser.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt=""
                  width={USER_ICON_SIZE}
                  height={USER_ICON_SIZE}
                  className="size-14 rounded-full object-cover"
                />
              ) : (
                <Image
                  src={ADMIN_PROFILE_ASSETS.user}
                  alt=""
                  width={USER_ICON_SIZE}
                  height={USER_ICON_SIZE}
                  className="size-14"
                />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="font-crimson text-[20px] font-semibold leading-normal text-[#0c0c0c] sm:text-[24px]">
                {currentUser.name || currentName}
              </p>
              <p className="font-poppins text-[16px] font-normal leading-normal text-[#464646]">
                {currentUser.email || currentEmail}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleProfileSubmit(onSubmitProfile)}
            noValidate
            className="flex w-full flex-col gap-6"
          >
            <h2 className={sectionTitleClass}>
              {t('userProfile.account.title', 'Account Information')}
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileInput
                id="admin-profile-name"
                label={t('userProfile.account.name', 'Organization / Display Name')}
                autoComplete="organization"
                error={profileErrors.name}
                {...registerProfile('name', {
                  required: t(
                    'userProfile.errors.nameRequired',
                    'Name is required.',
                  ),
                })}
              />

              <ProfileInput
                id="admin-profile-email"
                label={t('userProfile.account.email', 'Email Address')}
                type="email"
                readOnly
                disabled
                badge={
                  <span className="inline-flex items-center gap-1 rounded bg-[#eef0f3] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[#6b7280]">
                    <Lock size={11} aria-hidden="true" />
                    {t('adminProfile.notEditable', 'Not changeable')}
                  </span>
                }
                helperText={t(
                  'adminProfile.emailUnchangeableHint',
                  'Admin email address is fixed and cannot be modified.',
                )}
                {...registerProfile('email')}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                unstyled={true}
                disabled={updateMutation.isPending}
                className={primaryButtonClass}
              >
                {updateMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('common.saving', 'Saving...')}
                  </span>
                ) : (
                  t('userProfile.account.update', 'Save Changes')
                )}
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
            {t('userProfile.security.title', 'Change Password')}
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <PasswordInput
              id="admin-profile-current-password"
              label={t('userProfile.security.currentPassword', 'Current Password')}
              autoComplete="current-password"
              placeholder="••••••••"
              error={passwordErrors.currentPassword}
              show={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword((s) => !s)}
              {...registerPassword('currentPassword', {
                required: t('userProfile.errors.currentPassword', 'Current password is required.'),
              })}
            />
            <PasswordInput
              id="admin-profile-new-password"
              label={t('userProfile.security.newPassword', 'New Password')}
              autoComplete="new-password"
              placeholder="••••••••"
              error={passwordErrors.newPassword}
              show={showNewPassword}
              onToggleShow={() => setShowNewPassword((s) => !s)}
              {...registerPassword('newPassword', {
                required: t('userProfile.errors.newPassword', 'New password is required.'),
                minLength: {
                  value: 8,
                  message: t('userProfile.errors.passwordShort', 'Password must be at least 8 characters.'),
                },
              })}
            />
            <PasswordInput
              id="admin-profile-confirm-password"
              label={t('userProfile.security.confirmPassword', 'Confirm New Password')}
              autoComplete="new-password"
              placeholder="••••••••"
              error={passwordErrors.confirmPassword}
              show={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword((s) => !s)}
              {...registerPassword('confirmPassword', {
                required: t('userProfile.errors.confirmPassword', 'Please confirm your new password.'),
                validate: (value) =>
                  value === watchPassword('newPassword') ||
                  t('userProfile.errors.passwordMismatch', 'Passwords do not match.'),
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
              {changePasswordMutation.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t('common.updating', 'Updating...')}
                </span>
              ) : (
                t('userProfile.security.changePassword', 'Change Password')
              )}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
});

AdminProfileContent.displayName = 'AdminProfileContent';

export default AdminProfileContent;
