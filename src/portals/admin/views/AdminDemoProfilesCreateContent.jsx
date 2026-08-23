import { useTranslation } from 'react-i18next';
import React, { memo, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpFromLine, Plus, X } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  DEMO_PROFILE_BIO_MAX_LENGTH,
  DEMO_PROFILE_STATUS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
} from '@/portals/admin/data/adminDemoProfilesData';
import useAdminDemoProfilesCreate from '@/portals/admin/hooks/useAdminDemoProfilesCreate';

const fieldLabelClass =
  'text-[14px] font-medium leading-5 text-[#455163]';
const inputClass =
  'box-border h-11 w-full rounded-lg border border-[#dfe4ea] bg-white px-3 py-2.5 text-[14px] leading-5 text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd]';
const textareaClass =
  'box-border min-h-28 w-full resize-y rounded-lg border border-[#dfe4ea] bg-white px-3 py-2.5 text-[14px] leading-5 text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd]';

const RequiredMark = () => (
  <span className="text-[#f31d2c]" aria-hidden="true">
    {' '}
    *
  </span>
);

const FormField = memo(({ id, label, required, error, errorMessage, children }) => (
  <div className="flex min-w-0 flex-col">
    <label htmlFor={id} className={fieldLabelClass}>
      {label}
      {required ? <RequiredMark /> : null}
    </label>
    <div className="pt-1.5">{children}</div>
    {error ? (
      <p className="pt-1 text-[13px] leading-4 text-[#f31d2c]" role="alert">
        {errorMessage}
      </p>
    ) : null}
  </div>
));
FormField.displayName = 'FormField';

const PhotoUploadField = memo(
  ({ id, label, title, hint, fileName, onChange, inputRef }) => (
    <div className="flex min-w-0 flex-1 flex-col">
      <p className={fieldLabelClass}>{label}</p>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-1.5 flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#dfe4ea] bg-[#fafbff] px-4 py-8 transition hover:border-[#4048cd]/40 hover:bg-[#f6fbff]"
      >
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#eef2ff] text-[#4048cd]">
          <ArrowUpFromLine size={22} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="text-[14px] font-semibold leading-5 text-[#253043]">{title}</span>
        <span className="text-center text-[13px] leading-5 text-[#788293]">{hint}</span>
        {fileName ? (
          <span className="pt-1 text-center text-[13px] font-medium text-[#4048cd]">{fileName}</span>
        ) : null}
      </button>
    </div>
  ),
);
PhotoUploadField.displayName = 'PhotoUploadField';

const StatusToggle = memo(({ isActive, onToggle }) => {
  const { t } = useTranslation();
  const statusStyle = isActive ? STATUS_STYLES[DEMO_PROFILE_STATUS.ACTIVE] : STATUS_STYLES[DEMO_PROFILE_STATUS.INACTIVE];
  const statusKey = isActive ? DEMO_PROFILE_STATUS.ACTIVE : DEMO_PROFILE_STATUS.INACTIVE;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#e8ebf1] bg-[#fafbff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-semibold leading-6 text-[#202838]">
          {t('adminDemoProfiles.create.statusTitle')}
        </p>
        <p className="pt-1 text-[14px] leading-5 text-[#788293]">
          {t('adminDemoProfiles.create.statusHint')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-[30px] items-center gap-[5px] rounded-[8px] px-[9px] py-[5px] ${statusStyle.bg}`}
        >
          <span className={`size-[6px] rounded-[3px] ${statusStyle.dot}`} aria-hidden="true" />
          <span className={`text-[13px] font-bold leading-[19px] ${statusStyle.text}`}>
            {t(STATUS_LABEL_KEYS[statusKey])}
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          aria-label={t('adminDemoProfiles.create.statusToggle')}
          onClick={onToggle}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition ${
            isActive ? 'bg-[#4048cd]' : 'bg-[#cbd5e1]'
          }`}
        >
          <span
            className={`inline-block size-5 rounded-full bg-white shadow transition ${
              isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
});
StatusToggle.displayName = 'StatusToggle';

const AdminDemoProfilesCreateContent = memo(() => {
  const { t } = useTranslation();
  const fullNameId = useId();
  const usernameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const bioId = useId();
  const profilePhotoId = useId();
  const coverPhotoId = useId();
  const profilePhotoRef = useRef(null);
  const coverPhotoRef = useRef(null);

  const {
    values,
    attempted,
    submitting,
    fullNameValid,
    usernameValid,
    phoneValid,
    emailValid,
    formValid,
    handleFieldChange,
    handleBioChange,
    handleSocialLinkChange,
    handleAddSocialLink,
    handleRemoveSocialLink,
    handleToggleActive,
    handleProfilePhotoChange,
    handleCoverPhotoChange,
    handleCancel,
    handleSubmit,
  } = useAdminDemoProfilesCreate();

  const showFullNameError = attempted && !fullNameValid;
  const showUsernameError = attempted && !usernameValid;
  const showPhoneError = attempted && !phoneValid;
  const showEmailError = attempted && !emailValid;

  return (
    <div className="flex w-full flex-col gap-5">
      <Link
        to={ROUTES.ADMIN_DEMO_PROFILES}
        className="inline-flex w-fit items-center gap-2 text-[15px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25] sm:text-[16px]"
      >
        <ArrowLeft size={22} aria-hidden="true" className="shrink-0" />
        {t('adminDemoProfiles.create.back')}
      </Link>

      <section className="overflow-hidden rounded-[12px] border border-[#e8ebf1] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]">
        <header className="border-b border-[#edf0f3] px-5 py-5 sm:px-6 sm:py-6">
          <h1 className="font-manrope text-[28px] font-bold leading-8 tracking-[-0.5px] text-[#202838] sm:text-[32px]">
            {t('adminDemoProfiles.create.title')}
          </h1>
          <p className="pt-2 text-[16px] leading-6 text-[#788293]">
            {t('adminDemoProfiles.create.subtitle')}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-5 py-6 sm:px-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              id={fullNameId}
              label={t('adminDemoProfiles.create.fullName')}
              required
              error={showFullNameError}
              errorMessage={t('adminDemoProfiles.create.fullNameRequired')}
            >
              <input
                id={fullNameId}
                name="fullName"
                type="text"
                value={values.fullName}
                onChange={handleFieldChange('fullName')}
                placeholder={t('adminDemoProfiles.create.fullNamePlaceholder')}
                aria-invalid={showFullNameError}
                className={inputClass}
              />
            </FormField>

            <FormField
              id={usernameId}
              label={t('adminDemoProfiles.create.username')}
              required
              error={showUsernameError}
              errorMessage={t('adminDemoProfiles.create.usernameRequired')}
            >
              <input
                id={usernameId}
                name="username"
                type="text"
                value={values.username}
                onChange={handleFieldChange('username')}
                placeholder={t('adminDemoProfiles.create.usernamePlaceholder')}
                aria-invalid={showUsernameError}
                className={inputClass}
              />
            </FormField>

            <FormField
              id={phoneId}
              label={t('adminDemoProfiles.create.phone')}
              required
              error={showPhoneError}
              errorMessage={t('adminDemoProfiles.create.phoneRequired')}
            >
              <input
                id={phoneId}
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleFieldChange('phone')}
                placeholder={t('adminDemoProfiles.create.phonePlaceholder')}
                aria-invalid={showPhoneError}
                className={inputClass}
              />
            </FormField>

            <FormField
              id={emailId}
              label={t('adminDemoProfiles.create.email')}
              required
              error={showEmailError}
              errorMessage={t('adminDemoProfiles.create.emailRequired')}
            >
              <input
                id={emailId}
                name="email"
                type="email"
                value={values.email}
                onChange={handleFieldChange('email')}
                placeholder={t('adminDemoProfiles.create.emailPlaceholder')}
                aria-invalid={showEmailError}
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField id={bioId} label={t('adminDemoProfiles.create.bio')}>
            <textarea
              id={bioId}
              name="bio"
              value={values.bio}
              onChange={handleBioChange}
              maxLength={DEMO_PROFILE_BIO_MAX_LENGTH}
              placeholder={t('adminDemoProfiles.create.bioPlaceholder')}
              className={textareaClass}
            />
            <p className="pt-1.5 text-right text-[13px] leading-4 text-[#788293]">
              {t('adminDemoProfiles.create.bioCount', {
                count: values.bio.length,
                max: DEMO_PROFILE_BIO_MAX_LENGTH,
              })}
            </p>
          </FormField>

          <div className="flex flex-col gap-3">
            <p className={fieldLabelClass}>{t('adminDemoProfiles.create.socialTitle')}</p>
            {values.socialLinks.map((link, index) => {
              const socialId = `${bioId}-social-${index}`;
              return (
                <div key={socialId} className="flex items-start gap-2">
                  <input
                    id={socialId}
                    type="text"
                    value={link}
                    onChange={handleSocialLinkChange(index)}
                    placeholder={t('adminDemoProfiles.create.socialPlaceholder')}
                    className={inputClass}
                  />
                  {values.socialLinks.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(index)}
                      aria-label={t('adminDemoProfiles.create.removeSocial')}
                      className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#dfe4ea] text-[#788293] transition hover:bg-[#f9fafb]"
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              );
            })}
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[14px] font-semibold leading-5 text-[#ee1c25] transition hover:text-[#d41921]"
            >
              <Plus size={16} aria-hidden="true" />
              {t('adminDemoProfiles.create.addSocial')}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <PhotoUploadField
              id={profilePhotoId}
              label={t('adminDemoProfiles.create.profilePhoto')}
              title={t('adminDemoProfiles.create.profilePhotoTitle')}
              hint={t('adminDemoProfiles.create.profilePhotoHint')}
              fileName={values.profilePhotoName}
              onChange={handleProfilePhotoChange}
              inputRef={profilePhotoRef}
            />
            <PhotoUploadField
              id={coverPhotoId}
              label={t('adminDemoProfiles.create.coverPhoto')}
              title={t('adminDemoProfiles.create.coverPhotoTitle')}
              hint={t('adminDemoProfiles.create.coverPhotoHint')}
              fileName={values.coverPhotoName}
              onChange={handleCoverPhotoChange}
              inputRef={coverPhotoRef}
            />
          </div>

          <StatusToggle isActive={values.isActive} onToggle={handleToggleActive} />

          <div className="flex flex-col-reverse gap-3 border-t border-[#edf0f3] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#dfe4ea] px-5 py-2.5 text-[14px] font-medium leading-5 text-[#536070] transition hover:bg-[#f9fafb]"
            >
              {t('adminDemoProfiles.create.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#4048cd] px-5 py-2.5 text-[14px] font-semibold leading-5 text-white transition hover:bg-[#353cb0] disabled:cursor-default disabled:opacity-60"
            >
              {t('adminDemoProfiles.create.submit')}
            </button>
          </div>

          {attempted && !formValid ? (
            <p className="text-right text-[13px] leading-4 text-[#f31d2c]" role="alert">
              {t('adminDemoProfiles.create.formInvalid')}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
});

AdminDemoProfilesCreateContent.displayName = 'AdminDemoProfilesCreateContent';

export default AdminDemoProfilesCreateContent;
