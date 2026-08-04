import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { LOGIN_ASSETS } from '../login/loginAssets';
import { DEFAULT_PROFILE, PROFILE_ASSETS } from './profileData';

const fieldBoxClass =
  'flex w-full items-center gap-2 rounded-[12px] border border-transparent bg-[#f1f3ff] px-[17px] py-[13px]';

const fieldLabelClass =
  'text-[14px] font-medium uppercase leading-4 tracking-[1.2px] text-[#532aa8]';

const passwordInputClass =
  'w-full rounded-[12px] border border-[rgba(203,195,213,0.3)] bg-white py-[14px] pl-[17px] pr-12 text-[16px] leading-normal text-[#161c27] outline-none placeholder:text-[#6b7280] focus:ring-2 focus:ring-[#4048cd]/25';

const passwordLabelClass =
  'text-[12px] font-medium leading-4 tracking-[0.6px] text-[#494453]';

const PasswordField = memo(
  ({ id, label, value, onChange, autoComplete, error, show, onToggleShow }) => {
    const { t } = useTranslation();

    return (
      <div className="flex w-full flex-col gap-2">
        <label htmlFor={id} className={passwordLabelClass}>
          {label}
        </label>
        <div className="relative w-full">
          <input
            id={id}
            type={show ? 'text' : 'password'}
            autoComplete={autoComplete}
            value={value}
            onChange={onChange}
            placeholder="••••••••"
            aria-invalid={Boolean(error)}
            className={passwordInputClass}
          />
          <button
            type="button"
            onClick={onToggleShow}
            aria-label={show ? t('login.hidePassword') : t('login.showPassword')}
            className="absolute right-4 top-1/2 flex h-[15px] w-[22px] -translate-y-1/2 items-center justify-center overflow-hidden"
          >
            <img
              src={LOGIN_ASSETS.eye}
              alt=""
              width={22}
              height={15}
              className={`h-full w-full object-contain ${show ? 'opacity-100' : 'opacity-70'}`}
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

PasswordField.displayName = 'PasswordField';

const ProfileField = memo(({ label, value, icon, trailing }) => (
  <div className="flex w-full flex-col gap-2">
    <p className={fieldLabelClass}>{label}</p>
    <div className={`${fieldBoxClass} ${trailing ? 'justify-between' : ''}`}>
      <div className="flex min-w-0 items-center gap-2">
        {icon ? (
          <img
            src={icon}
            alt=""
            width={12}
            height={12}
            className="size-[12px] shrink-0"
          />
        ) : null}
        <p className="truncate text-[16px] font-normal leading-6 text-[#161c27]">{value}</p>
      </div>
      {trailing}
    </div>
  </div>
));

ProfileField.displayName = 'ProfileField';

const PhotographerProfileCard = memo(({ profile, onEdit, onCopy }) => {
  const { t } = useTranslation();

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-8 overflow-hidden rounded-[32px] border border-[rgba(203,195,213,0.1)] bg-white px-[25px] pb-[25px] pt-8 shadow-[0px_1px_2px_0px_rgba(83,42,168,0.05)] sm:gap-10 sm:pt-12 lg:gap-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-[24px] font-semibold leading-[32px] tracking-[-0.3px] text-[#161c27] sm:text-[28px] sm:leading-[36px] lg:text-[30px] lg:leading-[38px]">
            {t('userProfile.photographer.title')}
          </h2>
          <p className="text-[16px] font-normal leading-6 text-[#494453]">
            {t('userProfile.photographer.subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-[12px] bg-[#ee1c25] px-6 py-3 text-[14px] font-semibold leading-5 tracking-[0.28px] text-white"
        >
          <img
            src={PROFILE_ASSETS.edit}
            alt=""
            width={18}
            height={18}
            className="size-[18px] shrink-0"
          />
          {t('userProfile.photographer.edit')}
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-6 lg:gap-8">
        <div className="shrink-0">
          <div className="flex size-[140px] items-center justify-center rounded-full border-4 border-[rgba(83,42,168,0.1)] p-2 sm:size-[160px]">
            <img
              src={PROFILE_ASSETS.avatar}
              alt={profile.fullName}
              width={144}
              height={144}
              className="size-full rounded-full object-cover"
            />
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <ProfileField
            label={t('userProfile.fields.fullName')}
            value={profile.fullName}
          />
          <ProfileField
            label={t('userProfile.fields.phone')}
            value={profile.phone}
            icon={PROFILE_ASSETS.globe}
          />
          <ProfileField
            label={t('userProfile.fields.email')}
            value={profile.email}
            icon={PROFILE_ASSETS.emailIcon}
          />
          <ProfileField
            label={t('userProfile.fields.profileLink')}
            value={profile.profileLink}
            trailing={
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex shrink-0 items-center gap-2.5 rounded-[15px] border border-black/10 bg-[#4048cd] px-2.5 py-[5px] text-[16px] font-medium leading-6 text-white"
              >
                <img
                  src={PROFILE_ASSETS.copy}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6"
                />
                {t('userProfile.photographer.copy')}
              </button>
            }
          />
        </div>
      </div>
    </section>
  );
});

PhotographerProfileCard.displayName = 'PhotographerProfileCard';

const AccountSecurityCard = memo(() => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!currentPassword) next.currentPassword = t('userProfile.errors.currentRequired');
    if (!newPassword) next.newPassword = t('userProfile.errors.newRequired');
    else if (newPassword.length < 8) next.newPassword = t('userProfile.errors.newTooShort');
    if (!confirmPassword) next.confirmPassword = t('userProfile.errors.confirmRequired');
    else if (newPassword && confirmPassword !== newPassword) {
      next.confirmPassword = t('userProfile.errors.confirmMismatch');
    }
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success(t('userProfile.security.success'));
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-6 rounded-[32px] border border-[rgba(203,195,213,0.1)] bg-white p-[25px] shadow-[0px_1px_2px_0px_rgba(83,42,168,0.05)]">
      <div className="flex flex-col gap-1">
        <h2 className="text-[24px] font-semibold leading-[32px] tracking-[-0.3px] text-[#161c27] sm:text-[28px] sm:leading-[36px] lg:text-[30px] lg:leading-[38px]">
          {t('userProfile.security.title')}
        </h2>
        <p className="text-[16px] font-normal leading-6 text-[#494453]">
          {t('userProfile.security.subtitle')}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col gap-6 rounded-[16px] bg-[#f1f3ff] p-5 sm:p-6"
      >
        <div className="flex items-center gap-2">
          <img
            src={PROFILE_ASSETS.lock}
            alt=""
            width={16}
            height={21}
            className="h-[21px] w-4 shrink-0"
          />
          <h3 className="text-[14px] font-semibold leading-5 tracking-[0.28px] text-[#161c27]">
            {t('userProfile.security.setPassword')}
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          <PasswordField
            id="profile-current-password"
            label={t('userProfile.security.currentPassword')}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            error={errors.currentPassword}
            show={showCurrent}
            onToggleShow={() => setShowCurrent((current) => !current)}
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
            <div className="min-w-0 flex-1">
              <PasswordField
                id="profile-new-password"
                label={t('userProfile.security.newPassword')}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                error={errors.newPassword}
                show={showNew}
                onToggleShow={() => setShowNew((current) => !current)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <PasswordField
                id="profile-confirm-password"
                label={t('userProfile.security.confirmPassword')}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                error={errors.confirmPassword}
                show={showConfirm}
                onToggleShow={() => setShowConfirm((current) => !current)}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="rounded-[12px] bg-[#ee1c25] px-8 py-3 text-[14px] font-semibold leading-5 tracking-[0.28px] text-white"
            >
              {t('userProfile.security.changePassword')}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
});

AccountSecurityCard.displayName = 'AccountSecurityCard';

/**
 * Profile Details Editor — Figma node 111:2071 (admin main area; sidebar from Layout).
 */
const ProfileContent = memo(() => {
  const { t } = useTranslation();
  const [profile] = useState(DEFAULT_PROFILE);

  const handleEdit = () => {
    toast.success(t('userProfile.photographer.editToast'));
  };

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`https://${profile.profileLink}`);
      }
      toast.success(t('userProfile.photographer.copySuccess'));
    } catch {
      toast.error(t('userProfile.photographer.copyFailed'));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-[30px]">
      <header className="flex max-w-[835px] flex-col gap-4">
        <h1 className="text-[28px] font-semibold leading-[34px] tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
          {t('userProfile.title')}
        </h1>
        <p className="text-[16px] font-normal leading-6 text-[#494453]">
          {t('userProfile.subtitle')}
        </p>
      </header>

      <div className="flex flex-col items-stretch gap-8 xl:flex-row xl:items-start xl:gap-10">
        <PhotographerProfileCard
          profile={profile}
          onEdit={handleEdit}
          onCopy={handleCopy}
        />
        <AccountSecurityCard />
      </div>
    </div>
  );
});

ProfileContent.displayName = 'ProfileContent';

export default ProfileContent;
