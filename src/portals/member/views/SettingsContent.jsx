import { ArrowUpFromLine, Globe, Lock, Mail, Phone } from 'lucide-react';
import React, { forwardRef, memo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import { DEFAULT_MEMBER_SETTINGS } from '@/portals/member/data/memberSettingsData';
import {
  ADMIN_PROFILE_ASSETS,
  EYE_ICON_HEIGHT,
  EYE_ICON_WIDTH,
} from '@/portals/member/data/profileData';

const fieldLabelClass =
  'text-[12px] font-semibold uppercase tracking-[1.2px] text-[#4048cd]';
const fieldInputClass =
  'w-full rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#fafaff] px-4 py-3 text-[15px] leading-6 text-[#161c27] outline-none placeholder:text-[#989da1] focus:ring-2 focus:ring-[#4048cd]/25';
const cardClass =
  'flex h-full flex-col gap-6 rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 sm:p-8';
const saveButtonClass =
  'inline-flex cursor-pointer items-center justify-center self-start rounded-lg bg-[#ee1c25] px-8 py-3 text-[15px] font-semibold text-white transition hover:bg-[#d41921]';

const SettingsField = memo(
  forwardRef(
    ({ id, label, type = 'text', error, icon: Icon, ...props }, ref) => (
      <div className="flex flex-col gap-2">
        <div className="relative">
          {Icon ? (
            <Icon
              size={18}
              strokeWidth={2}
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-[38px] -translate-y-1/2 text-[#7a7484]"
            />
          ) : null}
          <Input
            id={id}
            ref={ref}
            type={type}
            label={label}
            error={error}
            inputClassName={`${fieldInputClass} ${Icon ? 'pl-11' : ''}`}
            labelClassName={fieldLabelClass}
            {...props}
          />
        </div>
      </div>
    ),
  ),
);

SettingsField.displayName = 'SettingsField';

const PhotoUploadSection = memo(
  ({ titleKey, hintKey, inputId, fileName, onFileChange, error }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);

    return (
      <section className={cardClass}>
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

        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={(event) =>
            onFileChange(event.target.files?.[0]?.name ?? '')
          }
        />
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
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={show ? 'text' : 'password'}
            placeholder=".........."
            label={label}
            error={error}
            inputClassName={`${fieldInputClass} pr-12`}
            labelClassName={fieldLabelClass}
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
            className="absolute right-4 top-[38px] flex h-5 w-6 -translate-y-1/2 cursor-pointer items-center justify-center"
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
  }),
);

PasswordField.displayName = 'PasswordField';

const SettingsContent = memo(() => {
  const { t } = useTranslation();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      fullName: DEFAULT_MEMBER_SETTINGS.fullName,
      username: DEFAULT_MEMBER_SETTINGS.username,
      phone: DEFAULT_MEMBER_SETTINGS.phone,
      email: DEFAULT_MEMBER_SETTINGS.email,
    },
  });

  const { register: registerPortfolio, handleSubmit: handlePortfolioSubmit } =
    useForm({
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
  const [coverFileName, setCoverFileName] = useState('');
  const [avatarFileName, setAvatarFileName] = useState('');

  const onProfileSave = (_data) => {
    toast.success(t('memberSettings.profile.saved'));
  };

  const onPortfolioSave = (_data) => {
    toast.success(t('memberSettings.portfolio.saved'));
  };

  const onPasswordSave = (_data) => {
    resetPassword();
    toast.success(t('memberSettings.security.saved'));
  };

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
          {t('memberSettings.title')}
        </h1>
        <p className="max-w-190 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('memberSettings.subtitle')}
        </p>
      </header>

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
            {...registerProfile('email', {
              required: t('memberSettings.errors.email'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('memberSettings.errors.emailInvalid'),
              },
            })}
          />

          <Button type="submit" unstyled={true} className={saveButtonClass}>
            {t('memberSettings.save')}
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

          <Button type="submit" unstyled={true} className={saveButtonClass}>
            {t('memberSettings.save')}
          </Button>
        </form>
      </div>

      <PhotoUploadSection
        titleKey="memberSettings.coverPhoto.title"
        hintKey="memberSettings.upload.coverHint"
        inputId="settings-cover-photo"
        fileName={coverFileName}
        onFileChange={setCoverFileName}
      />

      <PhotoUploadSection
        titleKey="memberSettings.profilePhoto.title"
        hintKey="memberSettings.upload.profileHint"
        inputId="member-settings-profile-photo"
        fileName={avatarFileName}
        onFileChange={setAvatarFileName}
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
              className={`${saveButtonClass} mt-6`}
            >
              {t('userProfile.security.changePassword')}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
});

SettingsContent.displayName = 'SettingsContent';

export default SettingsContent;
