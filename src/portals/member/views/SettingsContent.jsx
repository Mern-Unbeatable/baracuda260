import { useTranslation } from 'react-i18next';
import React, { memo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowUpFromLine, Globe, Lock, Mail, Phone } from 'lucide-react';
import {
  DEFAULT_MEMBER_SETTINGS,
  validateMemberProfile,
} from '@/portals/member/data/memberSettingsData';
import {
  ADMIN_PROFILE_ASSETS,
  EYE_ICON_HEIGHT,
  EYE_ICON_WIDTH,
  validatePasswordChange,
} from '@/portals/member/data/profileData';

const fieldLabelClass =
  'text-[12px] font-semibold uppercase tracking-[1.2px] text-[#4048cd]';
const fieldInputClass =
  'w-full rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#fafaff] px-4 py-3 text-[15px] leading-6 text-[#161c27] outline-none placeholder:text-[#989da1] focus:ring-2 focus:ring-[#4048cd]/25';
const cardClass =
  'flex h-full flex-col gap-6 rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 sm:p-8';
const saveButtonClass =
  'inline-flex cursor-pointer items-center justify-center self-start rounded-lg bg-[#ee1c25] px-8 py-3 text-[15px] font-semibold text-white transition hover:bg-[#d41921]';

const SettingsField = memo(({ id, label, value, onChange, type = 'text', error, icon: Icon }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className={fieldLabelClass}>
      {label}
    </label>
    <div className="relative">
      {Icon ? (
        <Icon
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7484]"
        />
      ) : null}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={`${fieldInputClass} ${Icon ? 'pl-11' : ''}`}
      />
    </div>
    {error ? (
      <p className="text-sm text-red-600" role="alert">
        {error}
      </p>
    ) : null}
  </div>
));

SettingsField.displayName = 'SettingsField';

const PhotoUploadSection = memo(({ titleKey, hintKey, inputId, fileName, onFileChange, error }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  return (
    <section className={cardClass}>
      <div>
        <h2 className="text-[20px] font-semibold text-[#161c27] sm:text-[22px]">{t(titleKey)}</h2>
        <p className="mt-2 text-[14px] leading-6 text-[#494453]">
          <span className="font-medium text-[#161c27]">{t('memberSettings.upload.title')}</span>
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
        onChange={(event) => onFileChange(event.target.files?.[0]?.name ?? '')}
      />
      <button
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
          <span className="text-center text-[13px] font-medium text-[#4048cd]">{fileName}</span>
        ) : null}
      </button>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
});

PhotoUploadSection.displayName = 'PhotoUploadSection';

const PasswordField = memo(({ id, label, value, onChange, error, show, onToggleShow }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder=".........."
          aria-invalid={Boolean(error)}
          className={`${fieldInputClass} pr-12`}
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
});

PasswordField.displayName = 'PasswordField';

const SettingsContent = memo(() => {
  const { t } = useTranslation();

  const [profile, setProfile] = useState(DEFAULT_MEMBER_SETTINGS);
  const [portfolio, setPortfolio] = useState({
    website: DEFAULT_MEMBER_SETTINGS.website,
    facebook: DEFAULT_MEMBER_SETTINGS.facebook,
    instagram: DEFAULT_MEMBER_SETTINGS.instagram,
    twitter: DEFAULT_MEMBER_SETTINGS.twitter,
    linkedin: DEFAULT_MEMBER_SETTINGS.linkedin,
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [coverFileName, setCoverFileName] = useState('');
  const [avatarFileName, setAvatarFileName] = useState('');

  const updateProfile = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const updatePortfolio = (key, value) => {
    setPortfolio((current) => ({ ...current, [key]: value }));
  };

  const handleProfileSave = (event) => {
    event.preventDefault();
    const nextErrors = validateMemberProfile(profile, t);
    if (Object.keys(nextErrors).length > 0) {
      setProfileErrors(nextErrors);
      return;
    }
    setProfileErrors({});
    toast.success(t('memberSettings.profile.saved'));
  };

  const handlePortfolioSave = (event) => {
    event.preventDefault();
    toast.success(t('memberSettings.portfolio.saved'));
  };

  const handlePasswordSave = (event) => {
    event.preventDefault();
    const nextErrors = validatePasswordChange(
      { currentPassword, newPassword, confirmPassword },
      t,
    );
    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors);
      return;
    }
    setPasswordErrors({});
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success(t('memberSettings.security.saved'));
  };

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
          {t('memberSettings.title')}
        </h1>
        <p className="max-w-[760px] text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('memberSettings.subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form onSubmit={handleProfileSave} noValidate className={cardClass}>
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
            value={profile.fullName}
            onChange={(value) => updateProfile('fullName', value)}
            error={profileErrors.fullName}
          />
          <SettingsField
            id="settings-username"
            label={t('memberSettings.profile.username')}
            value={profile.username}
            onChange={(value) => updateProfile('username', value)}
            error={profileErrors.username}
          />
          <SettingsField
            id="settings-phone"
            label={t('memberSettings.profile.phone')}
            value={profile.phone}
            onChange={(value) => updateProfile('phone', value)}
            error={profileErrors.phone}
            icon={Phone}
          />
          <SettingsField
            id="settings-email"
            label={t('memberSettings.profile.email')}
            value={profile.email}
            onChange={(value) => updateProfile('email', value)}
            error={profileErrors.email}
            icon={Mail}
          />

          <button type="submit" className={saveButtonClass}>
            {t('memberSettings.save')}
          </button>
        </form>

        <form onSubmit={handlePortfolioSave} noValidate className={cardClass}>
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
            value={portfolio.website}
            onChange={(value) => updatePortfolio('website', value)}
            icon={Globe}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SettingsField
              id="settings-facebook"
              label={t('memberSettings.portfolio.facebook')}
              value={portfolio.facebook}
              onChange={(value) => updatePortfolio('facebook', value)}
            />
            <SettingsField
              id="settings-instagram"
              label={t('memberSettings.portfolio.instagram')}
              value={portfolio.instagram}
              onChange={(value) => updatePortfolio('instagram', value)}
            />
            <SettingsField
              id="settings-twitter"
              label={t('memberSettings.portfolio.twitter')}
              value={portfolio.twitter}
              onChange={(value) => updatePortfolio('twitter', value)}
            />
            <SettingsField
              id="settings-linkedin"
              label={t('memberSettings.portfolio.linkedin')}
              value={portfolio.linkedin}
              onChange={(value) => updatePortfolio('linkedin', value)}
            />
          </div>

          <button type="submit" className={saveButtonClass}>
            {t('memberSettings.save')}
          </button>
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
          onSubmit={handlePasswordSave}
          noValidate
          className="rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white p-6 sm:p-8"
        >
          <div className="rounded-[16px] bg-[#eff6ff] p-5 sm:p-6">
            <div className="mb-6 inline-flex items-center gap-2 text-[16px] font-semibold text-[#4048cd]">
              <Lock size={18} strokeWidth={2} aria-hidden="true" />
              {t('memberSettings.security.formTitle')}
            </div>

            <div className="flex flex-col gap-5">
              <PasswordField
                id="settings-current-password"
                label={t('userProfile.security.currentPassword')}
                value={currentPassword}
                onChange={setCurrentPassword}
                error={passwordErrors.currentPassword}
                show={showCurrentPassword}
                onToggleShow={() => setShowCurrentPassword((current) => !current)}
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <PasswordField
                  id="settings-new-password"
                  label={t('userProfile.security.newPassword')}
                  value={newPassword}
                  onChange={setNewPassword}
                  error={passwordErrors.newPassword}
                  show={showNewPassword}
                  onToggleShow={() => setShowNewPassword((current) => !current)}
                />
                <PasswordField
                  id="settings-confirm-password"
                  label={t('userProfile.security.confirmPassword')}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  error={passwordErrors.confirmPassword}
                  show={showConfirmPassword}
                  onToggleShow={() => setShowConfirmPassword((current) => !current)}
                />
              </div>
            </div>

            <button type="submit" className={`${saveButtonClass} mt-6`}>
              {t('userProfile.security.changePassword')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
});

SettingsContent.displayName = 'SettingsContent';

export default SettingsContent;
