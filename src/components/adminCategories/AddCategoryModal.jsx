import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_CATEGORIES_ASSETS,
  CLOSE_ICON_SIZE,
  isCategoryNameValid,
} from './adminCategoriesData';

/**
 * Add Category popup — Figma node 339:4813.
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onSave: (name: string) => void,
 * }} props
 */
const AddCategoryModal = memo(({ open, onClose, onSave }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const nameId = useId();
  const [name, setName] = useState('');
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    setName('');
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
  }, [open, onClose]);

  if (!open) return null;

  const nameValid = isCategoryNameValid(name);
  const showNameError = attempted && !nameValid;

  const handleSubmit = (event) => {
    event.preventDefault();
    setAttempted(true);
    if (!nameValid) return;
    onSave(name.trim());
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[6px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-[360px] flex-col gap-4 rounded-[12px] bg-white p-5 shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <label
                id={titleId}
                htmlFor={nameId}
                className="min-w-0 text-[16px] font-medium leading-6 text-[#323232]"
              >
                {t('adminCategories.addModal.nameLabel')}
              </label>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('adminCategories.addModal.close')}
                className="-mr-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-black/5"
              >
                <img
                  src={ADMIN_CATEGORIES_ASSETS.close}
                  alt=""
                  width={CLOSE_ICON_SIZE}
                  height={CLOSE_ICON_SIZE}
                  className="size-[18px]"
                />
              </button>
            </div>

            <input
              id={nameId}
              name="categoryName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('adminCategories.addModal.namePlaceholder')}
              aria-invalid={showNameError}
              aria-describedby={showNameError ? `${nameId}-error` : undefined}
              className={`box-border h-10 w-full rounded-[8px] border bg-[#f4f4f4] px-2 text-[14px] leading-[22px] text-[#454545] outline-none placeholder:text-[#9a9a9a] focus:border-[#4048cd] ${
                showNameError ? 'border-[#ee1c25]' : 'border-transparent'
              }`}
            />
            {showNameError ? (
              <p id={`${nameId}-error`} className="text-[12px] leading-4 text-[#ee1c25]">
                {t('adminCategories.addModal.nameRequired')}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[8px] bg-[#ee1c25] px-5 text-[12px] leading-5 text-white transition hover:bg-[#d41921]"
          >
            {t('adminCategories.addModal.save')}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
});

AddCategoryModal.displayName = 'AddCategoryModal';

export default AddCategoryModal;
