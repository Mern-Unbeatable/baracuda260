import { ArrowLeft, ArrowUpFromLine, Plus, X } from 'lucide-react';
import React, { memo, useId, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  appendDemoProfile,
  buildDemoProfileFromForm,
  DEMO_PROFILE_BIO_MAX_LENGTH,
  DEMO_PROFILE_STATUS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
} from '@/portals/admin/data/adminDemoProfilesData';
import { ROUTES } from '@/shared/config';

const fieldLabelClass =
  'text-[14px] font-medium leading-5 text-[#455163] normal-case tracking-normal mb-1.5';
const inputClass =
  'box-border w-full rounded-lg border border-[#dfe4ea] bg-white px-3 py-2.5 text-[14px] leading-5 text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/10';
const textareaClass =
  'box-border min-h-28 w-full resize-y rounded-lg border border-[#dfe4ea] bg-white px-3 py-2.5 text-[14px] leading-5 text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/10';

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
      <Button
        unstyled
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-1.5 flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#dfe4ea] bg-[#fafbff] px-4 py-8 transition hover:border-[#4048cd]/40 hover:bg-[#f6fbff]"
      >
        <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#eef2ff] text-[#4048cd]">
          <ArrowUpFromLine size={22} strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="text-[14px] font-semibold leading-5 text-[#253043]">
          {title}
        </span>
        <span className="text-center text-[13px] leading-5 text-[#788293]">
          {hint}
        </span>
        {fileName ? (
          <span className="pt-1 text-center text-[13px] font-medium text-[#4048cd]">
            {fileName}
          </span>
        ) : null}
      </Button>
    </div>
  ),
);
PhotoUploadField.displayName = 'PhotoUploadField';

const StatusToggle = memo(({ isActive, onToggle }) => {
  const { t } = useTranslation();
  const statusStyle = isActive
    ? STATUS_STYLES[DEMO_PROFILE_STATUS.ACTIVE]
    : STATUS_STYLES[DEMO_PROFILE_STATUS.INACTIVE];
  const statusKey = isActive
    ? DEMO_PROFILE_STATUS.ACTIVE
    : DEMO_PROFILE_STATUS.INACTIVE;

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
          <span
            className={`size-[6px] rounded-[3px] ${statusStyle.dot}`}
            aria-hidden="true"
          />
          <span
            className={`text-[13px] font-bold leading-[19px] ${statusStyle.text}`}
          >
            {t(STATUS_LABEL_KEYS[statusKey])}
          </span>
        </span>
        <Button
          unstyled
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
        </Button>
      </div>
    </div>
  );
});
StatusToggle.displayName = 'StatusToggle';

const AdminDemoProfilesCreateContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const profilePhotoId = useId();
  const coverPhotoId = useId();
  const profilePhotoRef = useRef(null);
  const coverPhotoRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [profilePhotoName, setProfilePhotoName] = useState('');
  const [coverPhotoName, setCoverPhotoName] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      phone: '',
      email: '',
      bio: '',
      socialLinks: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  const bioValue = watch('bio', '');

  const handleToggleActive = () => setIsActive(!isActive);

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setProfilePhotoName(file.name);
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setCoverPhotoName(file.name);
  };

  const handleCancel = () => navigate(ROUTES.ADMIN_DEMO_PROFILES);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const socialLinksStr = data.socialLinks
        .map((s) => s.value)
        .filter(Boolean);
      appendDemoProfile(
        buildDemoProfileFromForm({
          ...data,
          isActive,
          socialLinks: socialLinksStr,
          profilePhotoName,
          coverPhotoName,
        }),
      );
      toast.success(t('adminDemoProfiles.create.success'));
      navigate(ROUTES.ADMIN_DEMO_PROFILES);
    } finally {
      setSubmitting(false);
    }
  };

  const onFormError = () => {
    toast.error(
      t('form.errors.checkFields', {
        defaultValue: 'Please check the form for errors.',
      }),
    );
  };

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
          <AdminPageHeader
            title={t('adminDemoProfiles.create.title')}
            description={t('adminDemoProfiles.create.subtitle')}
          />
        </header>

        <form
          onSubmit={handleSubmit(onSubmit, onFormError)}
          className="flex flex-col gap-6 px-5 py-6 sm:px-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              id="admin-demo-full-name"
              label={
                <span>
                  {t('adminDemoProfiles.create.fullName')}{' '}
                  <span className="text-[#f31d2c]">*</span>
                </span>
              }
              placeholder={t('adminDemoProfiles.create.fullNamePlaceholder')}
              error={errors.fullName}
              inputClassName={inputClass}
              labelClassName={fieldLabelClass}
              {...register('fullName', {
                required: t('adminDemoProfiles.create.fullNameRequired'),
              })}
            />

            <Input
              id="admin-demo-username"
              label={
                <span>
                  {t('adminDemoProfiles.create.username')}{' '}
                  <span className="text-[#f31d2c]">*</span>
                </span>
              }
              placeholder={t('adminDemoProfiles.create.usernamePlaceholder')}
              error={errors.username}
              inputClassName={inputClass}
              labelClassName={fieldLabelClass}
              {...register('username', {
                required: t('adminDemoProfiles.create.usernameRequired'),
              })}
            />

            <Input
              id="admin-demo-phone"
              type="tel"
              label={
                <span>
                  {t('adminDemoProfiles.create.phone')}{' '}
                  <span className="text-[#f31d2c]">*</span>
                </span>
              }
              placeholder={t('adminDemoProfiles.create.phonePlaceholder')}
              error={errors.phone}
              inputClassName={inputClass}
              labelClassName={fieldLabelClass}
              {...register('phone', {
                required: t('adminDemoProfiles.create.phoneRequired'),
              })}
            />

            <Input
              id="admin-demo-email"
              type="email"
              label={
                <span>
                  {t('adminDemoProfiles.create.email')}{' '}
                  <span className="text-[#f31d2c]">*</span>
                </span>
              }
              placeholder={t('adminDemoProfiles.create.emailPlaceholder')}
              error={errors.email}
              inputClassName={inputClass}
              labelClassName={fieldLabelClass}
              {...register('email', {
                required: t('adminDemoProfiles.create.emailRequired'),
              })}
            />
          </div>

          <div className="flex min-w-0 flex-col">
            <label htmlFor="admin-demo-bio" className={fieldLabelClass}>
              {t('adminDemoProfiles.create.bio')}
            </label>
            <textarea
              id="admin-demo-bio"
              maxLength={DEMO_PROFILE_BIO_MAX_LENGTH}
              placeholder={t('adminDemoProfiles.create.bioPlaceholder')}
              className={textareaClass}
              {...register('bio')}
            />
            <p className="pt-1.5 text-right text-[13px] leading-4 text-[#788293]">
              {t('adminDemoProfiles.create.bioCount', {
                count: bioValue.length,
                max: DEMO_PROFILE_BIO_MAX_LENGTH,
              })}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className={fieldLabelClass}>
              {t('adminDemoProfiles.create.socialTitle')}
            </p>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <Input
                  placeholder={t('adminDemoProfiles.create.socialPlaceholder')}
                  inputClassName={inputClass}
                  labelClassName="hidden"
                  containerClassName="flex-1 min-w-0"
                  {...register(`socialLinks.${index}.value`)}
                />
                {fields.length > 1 ? (
                  <Button
                    unstyled
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={t('adminDemoProfiles.create.removeSocial')}
                    className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#dfe4ea] text-[#788293] transition hover:bg-[#f9fafb]"
                  >
                    <X size={18} aria-hidden="true" />
                  </Button>
                ) : null}
              </div>
            ))}
            <Button
              unstyled
              type="button"
              onClick={() => append({ value: '' })}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[14px] font-semibold leading-5 text-[#ee1c25] transition hover:text-[#d41921]"
            >
              <Plus size={16} aria-hidden="true" />
              {t('adminDemoProfiles.create.addSocial')}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <PhotoUploadField
              id={profilePhotoId}
              label={t('adminDemoProfiles.create.profilePhoto')}
              title={t('adminDemoProfiles.create.profilePhotoTitle')}
              hint={t('adminDemoProfiles.create.profilePhotoHint')}
              fileName={profilePhotoName}
              onChange={handleProfilePhotoChange}
              inputRef={profilePhotoRef}
            />
            <PhotoUploadField
              id={coverPhotoId}
              label={t('adminDemoProfiles.create.coverPhoto')}
              title={t('adminDemoProfiles.create.coverPhotoTitle')}
              hint={t('adminDemoProfiles.create.coverPhotoHint')}
              fileName={coverPhotoName}
              onChange={handleCoverPhotoChange}
              inputRef={coverPhotoRef}
            />
          </div>

          <StatusToggle isActive={isActive} onToggle={handleToggleActive} />

          <div className="flex flex-col-reverse gap-3 border-t border-[#edf0f3] pt-5 sm:flex-row sm:justify-end">
            <Button
              unstyled
              type="button"
              onClick={handleCancel}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#dfe4ea] px-5 py-2.5 text-[14px] font-medium leading-5 text-[#536070] transition hover:bg-[#f9fafb]"
            >
              {t('adminDemoProfiles.create.cancel')}
            </Button>
            <Button
              unstyled
              type="submit"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#4048cd] px-5 py-2.5 text-[14px] font-semibold leading-5 text-white transition hover:bg-[#353cb0] disabled:cursor-default disabled:opacity-60"
            >
              {t('adminDemoProfiles.create.submit')}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
});

AdminDemoProfilesCreateContent.displayName = 'AdminDemoProfilesCreateContent';

export default AdminDemoProfilesCreateContent;
