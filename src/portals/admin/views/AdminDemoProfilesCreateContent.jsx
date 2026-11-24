import { ArrowLeft, ArrowUpFromLine, Plus, X } from 'lucide-react';
import React, { memo, useEffect, useId, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import { useQueryClient } from '@tanstack/react-query';
import {
  DEMO_PROFILE_BIO_MAX_LENGTH,
  DEMO_PROFILE_STATUS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
} from '@/portals/admin/data/adminDemoProfilesData';
import {
  createDemoProfileApi,
  DEMO_PROFILES_QUERY_KEY,
  DEMO_PROFILES_STATS_QUERY_KEY,
} from '@/shared/api/demoProfiles.api';
import { ROUTES } from '@/shared/config';

const fieldLabelClass =
  'mb-1.5 block text-[13px] font-semibold leading-5 text-[#455163]';
const inputClass =
  'box-border h-11 w-full rounded-lg border border-[#dfe4ea] bg-white px-3 py-2.5 text-[14px] leading-5 text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/10';
const textareaClass =
  'box-border min-h-28 w-full resize-y rounded-lg border border-[#dfe4ea] bg-white px-3 py-2.5 text-[14px] leading-5 text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/10';

const RequiredMark = () => (
  <span className="text-[#f31d2c]" aria-hidden="true">
    {' '}
    *
  </span>
);

const PhotoUploadField = memo(
  ({
    id,
    label,
    title,
    hint,
    fileName,
    previewUrl,
    onChange,
    onClear,
    inputRef,
    changeLabel,
    removeLabel,
  }) => (
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
      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-[#dfe4ea] bg-[#f8fafc]">
          <Image
            src={previewUrl}
            alt=""
            className="h-44 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/65 to-transparent px-3 pb-3 pt-8">
            <p className="min-w-0 truncate text-[12px] font-medium text-white">
              {fileName}
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                unstyled
                type="button"
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer rounded-md bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-[#253043] transition hover:bg-white"
              >
                {changeLabel}
              </Button>
              <Button
                unstyled
                type="button"
                onClick={onClear}
                aria-label={removeLabel}
                className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md bg-white/95 text-[#536070] transition hover:bg-white hover:text-[#ee1c25]"
              >
                <X size={14} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          unstyled
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#dfe4ea] bg-[#fafbff] px-4 py-6 transition hover:border-[#4048cd]/50 hover:bg-[#f6fbff]"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#eef2ff] text-[#4048cd]">
            <ArrowUpFromLine size={18} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="text-[13px] font-semibold leading-5 text-[#253043]">
            {title}
          </span>
          <span className="text-center text-[12px] leading-4 text-[#788293]">
            {hint}
          </span>
        </Button>
      )}
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
    <div className="flex flex-col gap-3 rounded-xl border border-[#e8ebf1] bg-[#fafbff] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold leading-5 text-[#202838]">
          {t('adminDemoProfiles.create.statusTitle')}
        </p>
        <p className="pt-1 text-[13px] leading-5 text-[#788293]">
          {t('adminDemoProfiles.create.statusHint')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 py-1 ${statusStyle.bg}`}
        >
          <span
            className={`size-1.5 rounded-full ${statusStyle.dot}`}
            aria-hidden="true"
          />
          <span
            className={`text-[12px] font-semibold leading-4 ${statusStyle.text}`}
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
  const queryClient = useQueryClient();
  const profilePhotoId = useId();
  const coverPhotoId = useId();
  const profilePhotoRef = useRef(null);
  const coverPhotoRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [profilePhotoName, setProfilePhotoName] = useState('');
  const [coverPhotoName, setCoverPhotoName] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [coverPhotoPreview, setCoverPhotoPreview] = useState('');

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
      password: '',
      bio: '',
      socialLinks: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  const bioValue = watch('bio', '');
  const profilePreviewRef = useRef('');
  const coverPreviewRef = useRef('');

  useEffect(
    () => () => {
      if (profilePreviewRef.current) {
        URL.revokeObjectURL(profilePreviewRef.current);
      }
      if (coverPreviewRef.current) {
        URL.revokeObjectURL(coverPreviewRef.current);
      }
    },
    [],
  );

  const handleToggleActive = () => setIsActive(!isActive);

  const setPhotoFromFile = (file, kind) => {
    if (!file) return;
    const nextPreview = URL.createObjectURL(file);
    if (kind === 'profile') {
      if (profilePreviewRef.current) {
        URL.revokeObjectURL(profilePreviewRef.current);
      }
      profilePreviewRef.current = nextPreview;
      setProfilePhotoPreview(nextPreview);
      setProfilePhotoFile(file);
      setProfilePhotoName(file.name);
      return;
    }
    if (coverPreviewRef.current) {
      URL.revokeObjectURL(coverPreviewRef.current);
    }
    coverPreviewRef.current = nextPreview;
    setCoverPhotoPreview(nextPreview);
    setCoverPhotoFile(file);
    setCoverPhotoName(file.name);
  };

  const clearPhoto = (kind) => {
    if (kind === 'profile') {
      if (profilePreviewRef.current) {
        URL.revokeObjectURL(profilePreviewRef.current);
        profilePreviewRef.current = '';
      }
      setProfilePhotoPreview('');
      setProfilePhotoFile(null);
      setProfilePhotoName('');
      if (profilePhotoRef.current) profilePhotoRef.current.value = '';
      return;
    }
    if (coverPreviewRef.current) {
      URL.revokeObjectURL(coverPreviewRef.current);
      coverPreviewRef.current = '';
    }
    setCoverPhotoPreview('');
    setCoverPhotoFile(null);
    setCoverPhotoName('');
    if (coverPhotoRef.current) coverPhotoRef.current.value = '';
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setPhotoFromFile(file, 'profile');
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setPhotoFromFile(file, 'cover');
  };

  const handleCancel = () => navigate(ROUTES.ADMIN_DEMO_PROFILES);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const socialLinksStr = data.socialLinks
        .map((s) => s.value)
        .filter(Boolean);

      try {
        await createDemoProfileApi({
          fullName: data.fullName.trim(),
          username: data.username.trim().replace(/^@/, ''),
          phone: data.phone.trim(),
          email: data.email.trim(),
          bio: data.bio?.trim() || '',
          socialLinks: socialLinksStr,
          password: data.password || 'password123',
          isActive,
          profilePhoto: profilePhotoFile,
          coverPhoto: coverPhotoFile,
        });
        queryClient.invalidateQueries({ queryKey: DEMO_PROFILES_QUERY_KEY });
        queryClient.invalidateQueries({
          queryKey: DEMO_PROFILES_STATS_QUERY_KEY,
        });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: DEMO_PROFILES_QUERY_KEY });
          queryClient.invalidateQueries({
            queryKey: DEMO_PROFILES_STATS_QUERY_KEY,
          });
        }, 500);
      } catch (apiErr) {
        console.warn('createDemoProfileApi error:', apiErr);
      }

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
    <div className="flex w-full flex-col gap-4 py-2 sm:gap-5 sm:py-4">
      <Link
        to={ROUTES.ADMIN_DEMO_PROFILES}
        className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold leading-5 text-[#687186] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={16} aria-hidden="true" className="shrink-0" />
        {t('adminDemoProfiles.create.back')}
      </Link>

      <section className="overflow-hidden rounded-xl border border-[#f3f4f6] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]">
        <header className="border-b border-[#f3f4f6] px-4 py-4 sm:px-5 sm:py-5">
          <AdminPageHeader
            title={t('adminDemoProfiles.create.title')}
            description={t('adminDemoProfiles.create.subtitle')}
            titleClassName="text-[22px] tracking-tight sm:text-[24px] lg:text-[26px] lg:leading-8"
            descriptionClassName="text-[13px] leading-5 sm:text-[14px]"
          />
        </header>

        <form
          onSubmit={handleSubmit(onSubmit, onFormError)}
          className="flex flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-5 sm:py-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            <Input
              id="admin-demo-full-name"
              label={
                <span>
                  {t('adminDemoProfiles.create.fullName')}
                  <RequiredMark />
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
                  {t('adminDemoProfiles.create.username')}
                  <RequiredMark />
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
                  {t('adminDemoProfiles.create.phone')}
                  <RequiredMark />
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
                  {t('adminDemoProfiles.create.email')}
                  <RequiredMark />
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

            <Input
              id="admin-demo-password"
              type="password"
              label={
                <span>
                  {t('adminDemoProfiles.create.password')}
                  <RequiredMark />
                </span>
              }
              placeholder={t('adminDemoProfiles.create.passwordPlaceholder')}
              error={errors.password}
              inputClassName={inputClass}
              labelClassName={fieldLabelClass}
              {...register('password', {
                required: t('adminDemoProfiles.create.passwordRequired'),
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
            <p className="pt-1.5 text-right text-[12px] leading-4 text-[#788293]">
              {t('adminDemoProfiles.create.bioCount', {
                count: bioValue.length,
                max: DEMO_PROFILE_BIO_MAX_LENGTH,
              })}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className={fieldLabelClass}>
              {t('adminDemoProfiles.create.socialTitle')}
            </p>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <Input
                  placeholder={t('adminDemoProfiles.create.socialPlaceholder')}
                  inputClassName={inputClass}
                  labelClassName="hidden"
                  className="min-w-0 flex-1"
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
                    <X size={16} aria-hidden="true" />
                  </Button>
                ) : null}
              </div>
            ))}
            <Button
              unstyled
              type="button"
              onClick={() => append({ value: '' })}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[13px] font-semibold leading-5 text-[#ee1c25] transition hover:text-[#d41921]"
            >
              <Plus size={15} aria-hidden="true" />
              {t('adminDemoProfiles.create.addSocial')}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
            <PhotoUploadField
              id={profilePhotoId}
              label={t('adminDemoProfiles.create.profilePhoto')}
              title={t('adminDemoProfiles.create.profilePhotoTitle')}
              hint={t('adminDemoProfiles.create.profilePhotoHint')}
              fileName={profilePhotoName}
              previewUrl={profilePhotoPreview}
              onChange={handleProfilePhotoChange}
              onClear={() => clearPhoto('profile')}
              inputRef={profilePhotoRef}
              changeLabel={t('adminDemoProfiles.create.changePhoto', 'Change')}
              removeLabel={t(
                'adminDemoProfiles.create.removePhoto',
                'Remove photo',
              )}
            />
            <PhotoUploadField
              id={coverPhotoId}
              label={t('adminDemoProfiles.create.coverPhoto')}
              title={t('adminDemoProfiles.create.coverPhotoTitle')}
              hint={t('adminDemoProfiles.create.coverPhotoHint')}
              fileName={coverPhotoName}
              previewUrl={coverPhotoPreview}
              onChange={handleCoverPhotoChange}
              onClear={() => clearPhoto('cover')}
              inputRef={coverPhotoRef}
              changeLabel={t('adminDemoProfiles.create.changePhoto', 'Change')}
              removeLabel={t(
                'adminDemoProfiles.create.removePhoto',
                'Remove photo',
              )}
            />
          </div>

          <StatusToggle isActive={isActive} onToggle={handleToggleActive} />

          <div className="flex flex-col-reverse gap-2.5 border-t border-[#f3f4f6] pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:pt-5">
            <Button
              unstyled
              type="button"
              onClick={handleCancel}
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-[#dfe4ea] px-5 text-[14px] font-medium leading-5 text-[#536070] transition hover:bg-[#f9fafb]"
            >
              {t('adminDemoProfiles.create.cancel')}
            </Button>
            <Button
              unstyled
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg bg-[#ee1c25] px-5 text-[14px] font-semibold leading-5 text-white transition hover:bg-[#d41921] disabled:cursor-default disabled:opacity-60"
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
