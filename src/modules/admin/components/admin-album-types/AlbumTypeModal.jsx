import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_ALBUM_TYPES_ASSETS,
  CLOSE_ICON_SIZE,
  MODAL_MODE,
  getAlbumTypeFormDefaults,
  isAlbumTypeFormValid,
  isFeaturedValid,
  isPrizeMoneyValid,
  isRequiredTextValid,
  parseFeaturedLines,
} from '@/modules/admin/data/adminAlbumTypesData';

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
  const nameId = useId();
  const prizeId = useId();
  const descriptionId = useId();
  const featuredId = useId();

  const [values, setValues] = useState(EMPTY_FORM);
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    setValues(getAlbumTypeFormDefaults(t, mode === MODAL_MODE.EDIT ? albumType : null));
    setAttempted(false);

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
  }, [open, mode, albumType, onClose, t]);

  if (!open) return null;

  const isEdit = mode === MODAL_MODE.EDIT;
  const nameValid = isRequiredTextValid(values.name);
  const prizeValid = isPrizeMoneyValid(values.prizeMoney);
  const descriptionValid = isRequiredTextValid(values.description);
  const featuredValid = isFeaturedValid(parseFeaturedLines(values.featured));
  const formValid = isAlbumTypeFormValid(values);

  const showNameError = attempted && !nameValid;
  const showPrizeError = attempted && !prizeValid;
  const showDescriptionError = attempted && !descriptionValid;
  const showFeaturedError = attempted && !featuredValid;

  const handleFieldChange = (field) => (event) => {
    const nextValue = event.target.value;
    setValues((current) => ({ ...current, [field]: nextValue }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAttempted(true);
    if (!formValid) return;
    onSave({
      name: values.name.trim(),
      prizeMoney: values.prizeMoney.trim(),
      description: values.description.trim(),
      featured: values.featured.trim(),
    });
  };

  const fieldClass = (hasError) =>
    `w-full rounded-[6px] border bg-white text-[12px] leading-[16.2px] text-[#253043] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd] ${
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
        className="flex w-full max-w-[470px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-[#edf0f3] px-6 pb-[21px] pt-5">
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-[9px] font-bold uppercase leading-[13.5px] tracking-[1.26px] text-[#f31d2c]">
              {t('adminAlbumTypes.modal.eyebrow')}
            </p>
            <h2
              id={titleId}
              className="font-manrope pt-1 text-[20px] font-bold leading-7 tracking-[-0.5px] text-[#202838]"
            >
              {isEdit ? t('adminAlbumTypes.modal.editTitle') : t('adminAlbumTypes.modal.createTitle')}
            </h2>
            <p className="pt-1 text-[12px] leading-4 text-[#788293]">
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
              className="size-[18px]"
            />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col">
              <label htmlFor={nameId} className="text-[12px] leading-4 text-[#455163]">
                {t('adminAlbumTypes.modal.nameLabel')}
                <span className="text-[#f31d2c]" aria-hidden="true">
                  {' '}
                  *
                </span>
              </label>
              <div className="pt-1.5">
                <input
                  id={nameId}
                  name="albumTypeName"
                  type="text"
                  value={values.name}
                  onChange={handleFieldChange('name')}
                  aria-invalid={showNameError}
                  aria-describedby={showNameError ? `${nameId}-error` : undefined}
                  className={`box-border h-[34px] px-[11px] py-[9px] ${fieldClass(showNameError)}`}
                />
              </div>
              {showNameError ? (
                <p id={`${nameId}-error`} className="pt-1 text-[12px] leading-4 text-[#f31d2c]">
                  {t('adminAlbumTypes.modal.nameRequired')}
                </p>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-col">
              <label htmlFor={prizeId} className="text-[12px] leading-4 text-[#455163]">
                {t('adminAlbumTypes.modal.prizeLabel')}
                <span className="text-[#f31d2c]" aria-hidden="true">
                  {' '}
                  *
                </span>
              </label>
              <div className="relative pt-1.5">
                <span
                  className="pointer-events-none absolute left-3 top-[calc(0.375rem+10px)] text-[14px] leading-5 text-[#748091]"
                  aria-hidden="true"
                >
                  $
                </span>
                <input
                  id={prizeId}
                  name="prizeMoney"
                  type="text"
                  inputMode="decimal"
                  value={values.prizeMoney}
                  onChange={handleFieldChange('prizeMoney')}
                  aria-invalid={showPrizeError}
                  aria-describedby={showPrizeError ? `${prizeId}-error` : undefined}
                  className={`box-border h-[34px] py-[9px] pl-[29px] pr-[11px] ${fieldClass(showPrizeError)}`}
                />
              </div>
              {showPrizeError ? (
                <p id={`${prizeId}-error`} className="pt-1 text-[12px] leading-4 text-[#f31d2c]">
                  {t('adminAlbumTypes.modal.prizeRequired')}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-col pt-4">
            <label htmlFor={descriptionId} className="text-[12px] leading-4 text-[#455163]">
              {t('adminAlbumTypes.modal.descriptionLabel')}
              <span className="text-[#f31d2c]" aria-hidden="true">
                {' '}
                *
              </span>
            </label>
            <div className="pt-1.5">
              <textarea
                id={descriptionId}
                name="description"
                rows={3}
                value={values.description}
                onChange={handleFieldChange('description')}
                aria-invalid={showDescriptionError}
                aria-describedby={showDescriptionError ? `${descriptionId}-error` : undefined}
                className={`h-[67px] resize-none px-[11px] py-[9px] ${fieldClass(showDescriptionError)}`}
              />
            </div>
            {showDescriptionError ? (
              <p id={`${descriptionId}-error`} className="pt-1 text-[12px] leading-4 text-[#f31d2c]">
                {t('adminAlbumTypes.modal.descriptionRequired')}
              </p>
            ) : null}
          </div>

          <div className="flex w-full flex-col pt-4">
            <label htmlFor={featuredId} className="text-[12px] leading-4 text-[#455163]">
              {t('adminAlbumTypes.modal.featuredLabel')}
              <span className="text-[#f31d2c]" aria-hidden="true">
                {' '}
                *
              </span>
            </label>
            <div className="pt-1.5">
              <textarea
                id={featuredId}
                name="featured"
                rows={3}
                value={values.featured}
                onChange={handleFieldChange('featured')}
                placeholder={t('adminAlbumTypes.modal.featuredPlaceholder')}
                aria-invalid={showFeaturedError}
                aria-describedby={showFeaturedError ? `${featuredId}-error` : undefined}
                className={`h-[67px] resize-none px-[11px] py-[9px] ${fieldClass(showFeaturedError)}`}
              />
            </div>
            {showFeaturedError ? (
              <p id={`${featuredId}-error`} className="pt-1 text-[12px] leading-4 text-[#f31d2c]">
                {t('adminAlbumTypes.modal.featuredRequired')}
              </p>
            ) : null}
          </div>

          <div className="flex items-start justify-end gap-2 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-[6px] border border-[#dfe4ea] px-[17px] py-[9px] text-[12px] leading-4 text-[#536070] transition hover:bg-[#f9fafb]"
            >
              {t('adminAlbumTypes.modal.cancel')}
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-[6px] bg-[#f31d2c] px-4 py-2 text-[12px] leading-4 text-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] transition hover:bg-[#d41921]"
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
