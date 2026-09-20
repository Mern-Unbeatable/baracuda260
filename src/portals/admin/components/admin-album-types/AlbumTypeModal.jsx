import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ADMIN_ALBUM_TYPES_ASSETS,
  CLOSE_ICON_SIZE,
  MODAL_MODE,
  getAlbumTypeFormDefaults,
    isFeaturedValid,
  isPrizeMoneyValid,
    parseFeaturedLines,
} from '@/portals/admin/data/adminAlbumTypesData';
import Input from '@/components/ui/Input';

const EMPTY_FORM = {
  name: '',
  prizeMoney: '',
  description: '',
  featured: '',
};

/**
 * Create / Edit Album type modal — Figma 339:3909 / 339:3630.
 * @param {{
 *   open: boolean,
 *   mode: 'create' | 'edit' | null,
 *   albumType?: object | null,
 *   onClose: () => void,
 *   onSave: (values: {
 *     name: string,
 *     prizeMoney: string,
 *     description: string,
 *     featured: string,
 *   }) => void,
 * }} props
 */
const AlbumTypeModal = memo(({ open, mode, albumType = null, onClose, onSave }) => {
  const { t } = useTranslation();
  const titleId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (!open) return undefined;

    reset(getAlbumTypeFormDefaults(t, mode === MODAL_MODE.EDIT ? albumType : null));

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, mode, albumType, onClose, t, reset]);

  if (!open) return null;

  const isEdit = mode === MODAL_MODE.EDIT;

  const onFormSubmit = (data) => {
    const featuredValid = isFeaturedValid(parseFeaturedLines(data.featured));
    if (!featuredValid) {
      // Handled by validation rules
    }
    
    onSave({
      name: data.name.trim(),
      prizeMoney: data.prizeMoney.trim(),
      description: data.description.trim(),
      featured: data.featured.trim(),
    });
  };

  const onFormError = () => {
    toast.error(t('form.errors.checkFields', { defaultValue: 'Please check the form for errors.' }));
  };

  const fieldClass = (hasError) =>
    `w-full rounded-lg border bg-white text-[14px] leading-5 text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd] ${
      hasError ? 'border-[#f31d2c]' : 'border-[#dfe4ea]'
    }`;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,32,51,0.35)] p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-117.5 flex-col overflow-hidden rounded-xl bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-[#edf0f3] px-6 pb-5.25 pt-5">
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-[11px] font-bold uppercase leading-4 tracking-[1.26px] text-[#f31d2c]">
              {t('adminAlbumTypes.modal.eyebrow')}
            </p>
            <h2
              id={titleId}
              className="font-manrope pt-1 text-[22px] font-bold leading-8 tracking-[-0.5px] text-[#202838]"
            >
              {isEdit
                ? t('adminAlbumTypes.modal.editTitle')
                : t('adminAlbumTypes.modal.createTitle')}
            </h2>
            <p className="pt-1 text-[14px] leading-5 text-[#788293]">
              {isEdit
                ? t('adminAlbumTypes.modal.editSubtitle')
                : t('adminAlbumTypes.modal.createSubtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('adminAlbumTypes.modal.close')}
            className="inline-flex cursor-pointer items-center justify-center rounded-full p-1 transition hover:bg-black/5"
          >
            <img
              src={ADMIN_ALBUM_TYPES_ASSETS.close}
              alt=""
              width={CLOSE_ICON_SIZE}
              height={CLOSE_ICON_SIZE}
              className="size-4.5"
            />
          </button>
        </header>

        <form onSubmit={handleSubmit(onFormSubmit, onFormError)} className="flex flex-col px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col">
              <Input
                label={
                  <>
                    {t('adminAlbumTypes.modal.nameLabel')}
                    <span className="text-[#f31d2c]" aria-hidden="true">
                      {' '}
                      *
                    </span>
                  </>
                }
                inputClassName={`box-border h-10 px-3 py-2.5 ${fieldClass(errors.name)}`}
                labelClassName="text-[14px] font-medium leading-5 text-[#455163] mb-1.5 block"
                error={errors.name}
                {...register('name', { required: t('adminAlbumTypes.modal.nameRequired') })}
              />
            </div>

            <div className="flex min-w-0 flex-col">
              <label className="text-[14px] font-medium leading-5 text-[#455163] mb-1.5 block">
                {t('adminAlbumTypes.modal.prizeLabel')}
                <span className="text-[#f31d2c]" aria-hidden="true">
                  {' '}
                  *
                </span>
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-3 top-2.5 text-[14px] leading-5 text-[#748091]"
                  aria-hidden="true"
                >
                  $
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  inputClassName={`box-border h-10 w-full py-2.5 pl-7.25 pr-3 ${fieldClass(errors.prizeMoney)}`}
                  {...register('prizeMoney', {
                    required: t('adminAlbumTypes.modal.prizeRequired'),
                    validate: (value) => isPrizeMoneyValid(value) || t('adminAlbumTypes.modal.prizeRequired'),
                  })}
                />
              </div>

            </div>
          </div>

          <div className="flex w-full flex-col pt-4">
            <label className="text-[14px] font-medium leading-5 text-[#455163] mb-1.5 block">
              {t('adminAlbumTypes.modal.descriptionLabel')}
              <span className="text-[#f31d2c]" aria-hidden="true">
                {' '}
                *
              </span>
            </label>
            <div>
              <textarea
                rows={3}
                aria-invalid={!!errors.description}
                className={`h-20 w-full resize-none px-3 py-2.5 ${fieldClass(errors.description)}`}
                {...register('description', { required: t('adminAlbumTypes.modal.descriptionRequired') })}
              />
            </div>
            {errors.description ? (
              <p className="mt-1.5 text-[13px] text-[#ee1c25]">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="flex w-full flex-col pt-4">
            <label className="text-[14px] font-medium leading-5 text-[#455163] mb-1.5 block">
              {t('adminAlbumTypes.modal.featuredLabel')}
              <span className="text-[#f31d2c]" aria-hidden="true">
                {' '}
                *
              </span>
            </label>
            <div>
              <textarea
                rows={3}
                placeholder={t('adminAlbumTypes.modal.featuredPlaceholder')}
                aria-invalid={!!errors.featured}
                className={`h-20 w-full resize-none px-3 py-2.5 ${fieldClass(errors.featured)}`}
                {...register('featured', {
                  required: t('adminAlbumTypes.modal.featuredRequired'),
                  validate: (value) => isFeaturedValid(parseFeaturedLines(value)) || t('adminAlbumTypes.modal.featuredRequired'),
                })}
              />
            </div>
            {errors.featured ? (
              <p className="mt-1.5 text-[13px] text-[#ee1c25]">
                {errors.featured.message}
              </p>
            ) : null}
          </div>

          <div className="flex items-start justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-[#dfe4ea] px-5 py-2.5 text-[14px] font-medium leading-5 text-[#536070] transition hover:bg-[#f9fafb]"
            >
              {t('adminAlbumTypes.modal.cancel')}
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-[#f31d2c] px-5 py-2.5 text-[14px] font-medium leading-5 text-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] transition hover:bg-[#d41921]"
            >
              {t('adminAlbumTypes.modal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
});

AlbumTypeModal.displayName = 'AlbumTypeModal';

export default AlbumTypeModal;
