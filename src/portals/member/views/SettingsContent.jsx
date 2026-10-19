import {
  ArrowUpFromLine,
  Globe,
  Lock,
  Mail,
  Phone,
  RefreshCw,
} from 'lucide-react';
import React, { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import { DEFAULT_MEMBER_SETTINGS } from '@/portals/member/data/memberSettingsData';
import {
  ADMIN_PROFILE_ASSETS,
  EYE_ICON_HEIGHT,
  EYE_ICON_WIDTH,
} from '@/portals/member/data/profileData';
import useUserProfileMe from '@/portals/member/hooks/useUserProfileMe';
import { changePasswordApi } from '@/shared/api/auth.api';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  updateUserProfileApi,
  USER_PROFILE_ME_QUERY_KEY,
} from '@/shared/api/userProfile.api';

const fieldLabelClass =
  'text-[12px] font-semibold uppercase tracking-[1.2px] text-[#4048cd]';
const fieldInputClass =
  'w-full rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#fafaff] px-4 py-3 text-[15px] leading-6 text-[#161c27] outline-none placeholder:text-[#989da1] focus:ring-2 focus:ring-[#4048cd]/25';
const fieldReadOnlyInputClass =
  'w-full cursor-not-allowed rounded-lg border border-[#d6d8dd] bg-[#f4f5f7] px-4 py-3 text-[15px] font-medium leading-6 text-[#6b7280] outline-none select-none';
const cardClass =
  'flex h-full flex-col gap-6 rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 sm:p-8';
const saveButtonClass =
  'inline-flex cursor-pointer items-center justify-center self-start rounded-lg bg-[#ee1c25] px-8 py-3 text-[15px] font-semibold text-white transition hover:bg-[#d41921] disabled:opacity-60';

const SettingsField = memo(
  forwardRef(
    (
      {
        id,
        label,
        type = 'text',
        error,
        icon: Icon,
        onInput,
        readOnly = false,
        disabled = false,
        badge,
        helperText,
        ...props
      },
      ref,
    ) => {
      const handleInput = (e) => {
        if (type === 'tel' || type === 'number') {
          e.target.value = e.target.value.replace(/[^0-9+()-\s]/g, '');
        }
        if (onInput) {
          onInput(e);
        }
      };

      return (
        <div className="flex flex-col gap-2">
          {label ? (
            <div className="flex items-center justify-between">
              <label htmlFor={id} className={fieldLabelClass}>
                {label}
              </label>
              {badge}
            </div>
          ) : null}
          <div className="relative flex items-center">
            {Icon ? (
              <Icon
                size={18}
                strokeWidth={2}
                aria-hidden="true"
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
                  readOnly ? 'text-[#9ca3af]' : 'text-[#7a7484]'
                }`}
              />
            ) : null}
            <input
              id={id}
              ref={ref}
              type={type}
              readOnly={readOnly}
              disabled={disabled}
              onInput={handleInput}
              className={`${
                readOnly ? fieldReadOnlyInputClass : fieldInputClass
              } ${Icon ? 'pl-11' : ''}`}
              {...props}
            />
          </div>
          {helperText ? (
            <p className="text-[12px] leading-4 text-[#8c93a0]">{helperText}</p>
          ) : null}
          {error ? (
            <p className="text-[13px] text-[#ee1c25]" role="alert">
              {error.message || error}
            </p>
          ) : null}
        </div>
      );
    },
  ),
);

SettingsField.displayName = 'SettingsField';

const PhotoUploadSection = memo(
  ({
    titleKey,
    hintKey,
    inputId,
    fileName,
    currentImage,
    previewUrl,
    hasUnsavedFile,
    isSaving,
    onSave,
    onFileChange,
    error,
    isAvatar = false,
  }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);

    const displayImage = previewUrl || currentImage;

    const handleFileChange = (event) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileChange(file);
      }
    };

    return (
      <section className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-semibold text-[#161c27] sm:text-[22px]">
              {t(titleKey)}
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#494453]">
              <span className="font-medium text-[#161c27]">
                {t('memberSettings.upload.title')}
              </span>
              {' — '}
              {t(hintKey)}
            </p>
          </div>
          {hasUnsavedFile ? (
            <Button
              unstyled
              type="button"
              disabled={isSaving}
              onClick={onSave}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#ee1c25] px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-[#d41921] disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  {t('common.saving', 'Saving...')}
                </>
              ) : (
                t('memberSettings.savePhoto', 'Save Photo')
              )}
            </Button>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileChange}
        />

        {displayImage ? (
          <div className="flex flex-col gap-4">
            <div
              className={`relative overflow-hidden border border-[rgba(0,0,0,0.08)] bg-[#fafaff] ${
                isAvatar
                  ? 'size-32 rounded-full border-4 border-white shadow-md'
                  : 'h-48 w-full rounded-xl sm:h-56'
              }`}
            >
              <Image
                src={displayImage}
                alt={t(titleKey)}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                unstyled
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#4048cd] bg-white px-4 py-2 text-[14px] font-semibold text-[#4048cd] transition hover:bg-[#ecedfa]"
              >
                <ArrowUpFromLine size={16} strokeWidth={2} aria-hidden="true" />
                {t('memberSettings.upload.change', 'Change Photo')}
              </Button>
              {fileName ? (
                <span className="text-[13px] font-medium text-[#494453]">
                  {fileName}
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          <Button
            unstyled
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#cbc3d5] bg-[#fafaff] px-6 py-12 transition hover:border-[#4048cd]/40 hover:bg-[#ecedfa]/40"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#ecedfa] text-[#4048cd]">
              <ArrowUpFromLine size={24} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="text-center text-[15px] font-medium text-[#494453]">
              {t('memberSettings.upload.dropLabel')}
            </span>
            <span className="text-center text-[13px] text-[#6b7280]">
              {t('memberSettings.upload.dropHint')}
            </span>
            {fileName ? (
              <span className="text-center text-[13px] font-medium text-[#4048cd]">
                {fileName}
              </span>
            ) : null}
          </Button>
        )}

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </section>
    );
  },
);

PhotoUploadSection.displayName = 'PhotoUploadSection';

const PasswordField = memo(
  forwardRef(({ id, label, error, show, onToggleShow, ...props }, ref) => {
    const { t } = useTranslation();

    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <label htmlFor={id} className={fieldLabelClass}>
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center">
          <input
            id={id}
            ref={ref}
            type={show ? 'text' : 'password'}
            placeholder=".........."
            className={`${fieldInputClass} pr-12`}
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
        {error ? (
          <p className="text-[13px] text-[#ee1c25]" role="alert">
            {error.message || error}
          </p>
        ) : null}
      </div>
    );
  }),
);

PasswordField.displayName = 'PasswordField';

const parseSocialLinks = (links, rawProfile = {}) => {
  const initial = {
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  };

  const assignPlatform = (key, val) => {
    if (!val || typeof val !== 'string') return;
    const trimmed = val.trim();
    if (!trimmed) return;

    const lowerKey = key.toLowerCase();
    if (lowerKey in initial) {
      initial[lowerKey] = trimmed;
      return;
    }

    const lower = trimmed.toLowerCase();
    if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
      initial.instagram = trimmed;
    } else if (
      lower.includes('facebook.com') ||
      lower.includes('fb.com') ||
      lower.includes('fb.me')
    ) {
      initial.facebook = trimmed;
    } else if (lower.includes('twitter.com') || lower.includes('x.com')) {
      initial.twitter = trimmed;
    } else if (lower.includes('linkedin.com')) {
      initial.linkedin = trimmed;
    } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      initial.youtube = trimmed;
    } else if (lower.includes('tiktok.com')) {
      initial.tiktok = trimmed;
    } else if (!initial.website) {
      initial.website = trimmed;
    }
  };

  let target = links;

  if (typeof target === 'string') {
    try {
      target = JSON.parse(target);
    } catch {
      target = [target];
    }
  }

  if (target && typeof target === 'object' && !Array.isArray(target)) {
    Object.entries(target).forEach(([k, v]) => {
      assignPlatform(k, v);
    });
  } else if (Array.isArray(target)) {
    target.forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        Object.entries(item).forEach(([k, v]) => {
          assignPlatform(k, v);
        });
      } else if (typeof item === 'string') {
        assignPlatform('', item);
      }
    });
  }

  if (rawProfile && typeof rawProfile === 'object') {
    Object.keys(initial).forEach((k) => {
      if (!initial[k] && rawProfile[k] && typeof rawProfile[k] === 'string') {
        initial[k] = rawProfile[k].trim();
      }
    });
  }

  return initial;
};

const SettingsContent = memo(() => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data: profileData, isLoading, isError, refetch } = useUserProfileMe();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    getValues: getProfileValues,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      fullName: DEFAULT_MEMBER_SETTINGS.fullName,
      username: DEFAULT_MEMBER_SETTINGS.username,
      phone: DEFAULT_MEMBER_SETTINGS.phone,
      email: DEFAULT_MEMBER_SETTINGS.email,
      city: DEFAULT_MEMBER_SETTINGS.city || '',
      country: DEFAULT_MEMBER_SETTINGS.country || '',
      bio: DEFAULT_MEMBER_SETTINGS.bio || '',
    },
  });

  const {
    register: registerPortfolio,
    handleSubmit: handlePortfolioSubmit,
    getValues: getPortfolioValues,
    reset: resetPortfolio,
  } = useForm({
    defaultValues: {
      website: DEFAULT_MEMBER_SETTINGS.website,
      facebook: DEFAULT_MEMBER_SETTINGS.facebook,
      instagram: DEFAULT_MEMBER_SETTINGS.instagram,
      twitter: DEFAULT_MEMBER_SETTINGS.twitter,
      linkedin: DEFAULT_MEMBER_SETTINGS.linkedin,
      youtube: DEFAULT_MEMBER_SETTINGS.youtube,
      tiktok: DEFAULT_MEMBER_SETTINGS.tiktok,
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

  const [coverFile, setCoverFile] = useState(null);
  const [coverFileName, setCoverFileName] = useState('');
  const [coverPreview, setCoverPreview] = useState(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFileName, setAvatarFileName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleCoverChange = (file) => {
    if (file && typeof file === 'object') {
      setCoverFile(file);
      setCoverFileName(file.name);
      setCoverPreview(URL.createObjectURL(file));
    } else if (typeof file === 'string') {
      setCoverFileName(file);
    }
  };

  const handleAvatarChange = (file) => {
    if (file && typeof file === 'object') {
      setAvatarFile(file);
      setAvatarFileName(file.name);
      setAvatarPreview(URL.createObjectURL(file));
    } else if (typeof file === 'string') {
      setAvatarFileName(file);
    }
  };

  useEffect(() => {
    if (!profileData) return;

    resetProfile({
      fullName: profileData.name || '',
      username: profileData.username || '',
      phone: profileData.phone || '',
      email: profileData.email || '',
      city: profileData.city || '',
      country: profileData.country || '',
      bio: profileData.bio || '',
    });

    const parsedSocials = parseSocialLinks(
      profileData.socialLinks ?? profileData.socials,
      profileData,
    );
    resetPortfolio(parsedSocials);
  }, [profileData, resetProfile, resetPortfolio]);

  // Mutation 1: Update Profile (PUT /api/v1/users/profile)
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
          // ignore localStorage error
        }
        dispatch(updateUser(updatedUser));
      }

      setCoverFile(null);
      setAvatarFile(null);

      toast.success(
        response?.message ||
          t(
            'memberSettings.profile.saved',
            'Profile details saved successfully!',
          ),
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

  const submitProfileUpdate = (
    profileOverrides = {},
    portfolioOverrides = {},
  ) => {
    const profileValues = { ...getProfileValues(), ...profileOverrides };
    const portfolioValues = { ...getPortfolioValues(), ...portfolioOverrides };

    const name = profileValues.fullName?.trim() || profileData?.name || '';
    const username =
      profileValues.username?.trim() || profileData?.username || '';
    const email = profileValues.email?.trim() || profileData?.email || '';
    const phone = profileValues.phone?.trim() ?? profileData?.phone ?? '';
    const bio = profileValues.bio?.trim() ?? profileData?.bio ?? '';
    const city = profileValues.city?.trim() ?? profileData?.city ?? '';
    const country =
      profileValues.country?.trim() ?? profileData?.country ?? '';

    if (!name) {
      toast.error(
        t('memberSettings.errors.fullName', 'Full name is required.'),
      );
      return;
    }
    if (!username) {
      toast.error(
        t('memberSettings.errors.username', 'Username is required.'),
      );
      return;
    }
    if (!email) {
      toast.error(t('memberSettings.errors.email', 'Email is required.'));
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('bio', bio);
    formData.append('city', city);
    formData.append('country', country);

    // Stringify social links object per backend schema
    const socialLinksObj = {};
    if (portfolioValues.website?.trim()) {
      socialLinksObj.website = portfolioValues.website.trim();
    }
    if (portfolioValues.facebook?.trim()) {
      socialLinksObj.facebook = portfolioValues.facebook.trim();
    }
    if (portfolioValues.instagram?.trim()) {
      socialLinksObj.instagram = portfolioValues.instagram.trim();
    }
    if (portfolioValues.twitter?.trim()) {
      socialLinksObj.twitter = portfolioValues.twitter.trim();
    }
    if (portfolioValues.linkedin?.trim()) {
      socialLinksObj.linkedin = portfolioValues.linkedin.trim();
    }
    if (portfolioValues.youtube?.trim()) {
      socialLinksObj.youtube = portfolioValues.youtube.trim();
    }
    if (portfolioValues.tiktok?.trim()) {
      socialLinksObj.tiktok = portfolioValues.tiktok.trim();
    }

    formData.append('socialLinks', JSON.stringify(socialLinksObj));

    if (avatarFile instanceof File) {
      formData.append('avatar', avatarFile);
    }
    if (coverFile instanceof File) {
      formData.append('coverPhoto', coverFile);
    }

    updateProfileMutation.mutate(formData);
  };

  const onProfileSave = (data) => {
    submitProfileUpdate(data);
  };

  const onPortfolioSave = (data) => {
    submitProfileUpdate({}, data);
  };

  // Mutation 2: Change Password (POST /api/v1/auth/change-password)
  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      changePasswordApi({ currentPassword, newPassword }),
    onSuccess: (response) => {
      resetPassword();
      toast.success(
        response?.message ||
          t('memberSettings.security.saved', 'Password changed successfully!'),
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

  const onPasswordSave = (data) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
            {t('memberSettings.title')}
          </h1>
          {isLoading ? (
            <div className="flex items-center gap-2 text-[14px] text-[#7a7484]">
              <RefreshCw size={16} className="animate-spin text-[#4048cd]" />
              <span>{t('common.loading', 'Loading profile...')}</span>
            </div>
          ) : null}
        </div>
        <p className="max-w-190 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('memberSettings.subtitle')}
        </p>
      </header>

      {isError ? (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-700">
          <span>Failed to load latest profile information.</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex cursor-pointer items-center gap-1.5 font-medium underline hover:text-red-900"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form
          onSubmit={handleProfileSubmit(onProfileSave)}
          noValidate
          className={cardClass}
        >
          <div>
            <h2 className="text-[20px] font-semibold text-[#161c27]">
              {t('memberSettings.profile.title')}
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#494453]">
              {t('memberSettings.profile.subtitle')}
            </p>
          </div>

          <SettingsField
            id="settings-full-name"
            label={t('memberSettings.profile.fullName')}
            error={profileErrors.fullName}
            {...registerProfile('fullName', {
              required: t('memberSettings.errors.fullName'),
            })}
          />
          <SettingsField
            id="settings-username"
            label={t('memberSettings.profile.username')}
            error={profileErrors.username}
            {...registerProfile('username', {
              required: t('memberSettings.errors.username'),
            })}
          />
          <SettingsField
            id="settings-phone"
            label={t('memberSettings.profile.phone')}
            error={profileErrors.phone}
            icon={Phone}
            {...registerProfile('phone')}
          />
          <SettingsField
            id="settings-email"
            label={t('memberSettings.profile.email')}
            error={profileErrors.email}
            icon={Mail}
            readOnly={true}
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
            {...registerProfile('email')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SettingsField
              id="settings-city"
              label={t('memberSettings.profile.city', 'City')}
              placeholder="e.g. Warsaw"
              {...registerProfile('city')}
            />
            <SettingsField
              id="settings-country"
              label={t('memberSettings.profile.country', 'Country')}
              placeholder="e.g. United Kingdom"
              {...registerProfile('country')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="settings-bio" className={fieldLabelClass}>
              {t('memberSettings.profile.bio', 'Bio')}
            </label>
            <textarea
              id="settings-bio"
              rows={3}
              placeholder={t(
                'memberSettings.profile.bioPlaceholder',
                'Share a bit about your photography journey...',
              )}
              className={fieldInputClass}
              {...registerProfile('bio')}
            />
          </div>

          <Button
            type="submit"
            unstyled={true}
            disabled={updateProfileMutation.isPending}
            className={saveButtonClass}
          >
            {updateProfileMutation.isPending ? (
              <span className="flex items-center gap-2">
                <RefreshCw size={16} className="animate-spin" />
                {t('common.saving', 'Saving...')}
              </span>
            ) : (
              t('memberSettings.save')
            )}
          </Button>
        </form>

        <form
          onSubmit={handlePortfolioSubmit(onPortfolioSave)}
          noValidate
          className={cardClass}
        >
          <div>
            <h2 className="text-[20px] font-semibold text-[#161c27]">
              {t('memberSettings.portfolio.title')}
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-[#494453]">
              {t('memberSettings.portfolio.subtitle')}
            </p>
          </div>

          <SettingsField
            id="settings-website"
            label={t('memberSettings.portfolio.website')}
            icon={Globe}
            {...registerPortfolio('website')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SettingsField
              id="settings-facebook"
              label={t('memberSettings.portfolio.facebook')}
              {...registerPortfolio('facebook')}
            />
            <SettingsField
              id="settings-instagram"
              label={t('memberSettings.portfolio.instagram')}
              {...registerPortfolio('instagram')}
            />
            <SettingsField
              id="settings-twitter"
              label={t('memberSettings.portfolio.twitter')}
              {...registerPortfolio('twitter')}
            />
            <SettingsField
              id="settings-linkedin"
              label={t('memberSettings.portfolio.linkedin')}
              {...registerPortfolio('linkedin')}
            />
            <SettingsField
              id="settings-youtube"
              label={t('memberSettings.portfolio.youtube')}
              {...registerPortfolio('youtube')}
            />
            <SettingsField
              id="settings-tiktok"
              label={t('memberSettings.portfolio.tiktok')}
              {...registerPortfolio('tiktok')}
            />
          </div>

          <Button
            type="submit"
            unstyled={true}
            disabled={updateProfileMutation.isPending}
            className={saveButtonClass}
          >
            {updateProfileMutation.isPending ? (
              <span className="flex items-center gap-2">
                <RefreshCw size={16} className="animate-spin" />
                {t('common.saving', 'Saving...')}
              </span>
            ) : (
              t('memberSettings.save')
            )}
          </Button>
        </form>
      </div>

      <PhotoUploadSection
        titleKey="memberSettings.coverPhoto.title"
        hintKey="memberSettings.upload.coverHint"
        inputId="settings-cover-photo"
        fileName={coverFileName}
        currentImage={profileData?.coverPhoto}
        previewUrl={coverPreview}
        hasUnsavedFile={Boolean(coverFile)}
        isSaving={updateProfileMutation.isPending}
        onSave={() => submitProfileUpdate()}
        onFileChange={handleCoverChange}
      />

      <PhotoUploadSection
        titleKey="memberSettings.profilePhoto.title"
        hintKey="memberSettings.upload.profileHint"
        inputId="member-settings-profile-photo"
        fileName={avatarFileName}
        currentImage={profileData?.avatar}
        previewUrl={avatarPreview}
        hasUnsavedFile={Boolean(avatarFile)}
        isSaving={updateProfileMutation.isPending}
        onSave={() => submitProfileUpdate()}
        onFileChange={handleAvatarChange}
        isAvatar
      />

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-[24px] font-semibold text-[#161c27] sm:text-[28px]">
            {t('memberSettings.security.title')}
          </h2>
          <p className="mt-1 text-[15px] leading-6 text-[#494453]">
            {t('memberSettings.security.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handlePasswordSubmit(onPasswordSave)}
          noValidate
          className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 sm:p-8"
        >
          <div className="rounded-2xl bg-[#eff6ff] p-5 sm:p-6">
            <div className="mb-6 inline-flex items-center gap-2 text-[16px] font-semibold text-[#4048cd]">
              <Lock size={18} strokeWidth={2} aria-hidden="true" />
              {t('memberSettings.security.formTitle')}
            </div>

            <div className="flex flex-col gap-5">
              <PasswordField
                id="settings-current-password"
                label={t('userProfile.security.currentPassword')}
                error={passwordErrors.currentPassword}
                show={showCurrentPassword}
                onToggleShow={() =>
                  setShowCurrentPassword((current) => !current)
                }
                {...registerPassword('currentPassword', {
                  required: t('userProfile.errors.currentPassword'),
                })}
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <PasswordField
                  id="settings-new-password"
                  label={t('userProfile.security.newPassword')}
                  error={passwordErrors.newPassword}
                  show={showNewPassword}
                  onToggleShow={() => setShowNewPassword((current) => !current)}
                  {...registerPassword('newPassword', {
                    required: t('userProfile.errors.newPassword'),
                    minLength: {
                      value: 8,
                      message: t('userProfile.errors.passwordShort'),
                    },
                  })}
                />
                <PasswordField
                  id="settings-confirm-password"
                  label={t('userProfile.security.confirmPassword')}
                  error={passwordErrors.confirmPassword}
                  show={showConfirmPassword}
                  onToggleShow={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  {...registerPassword('confirmPassword', {
                    required: t('userProfile.errors.confirmPassword'),
                    validate: (value) =>
                      value === watchPassword('newPassword') ||
                      t('userProfile.errors.passwordMismatch'),
                  })}
                />
              </div>
            </div>

            <Button
              type="submit"
              unstyled={true}
              disabled={changePasswordMutation.isPending}
              className={`${saveButtonClass} mt-6`}
            >
              {changePasswordMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  {t('common.saving', 'Saving...')}
                </span>
              ) : (
                t('userProfile.security.changePassword')
              )}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
});

SettingsContent.displayName = 'SettingsContent';

export default SettingsContent;
