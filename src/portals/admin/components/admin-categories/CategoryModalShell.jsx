import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  ADMIN_CATEGORIES_ASSETS,
  CLOSE_ICON_SIZE,
} from '@/portals/admin/data/adminCategoriesData';

export const CATEGORY_MODAL_LABEL_CLASS =
  'text-[16px] font-medium leading-6 text-[#323232]';

export const CATEGORY_MODAL_SAVE_CLASS =
  'inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-[#ee1c25] px-5 text-[12px] leading-5 text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60';

export const getCategoryModalFieldClass = (hasError) =>
  `box-border h-10 w-full rounded-lg border bg-[#f4f4f4] px-2 text-[14px] leading-5.5 text-[#454545] outline-none placeholder:text-[#9a9a9a] focus:border-[#4048cd] ${
    hasError ? 'border-[#ee1c25]' : 'border-transparent'
  }`;

export const showCategoryFormErrorToast = (t) => {
  toast.error(
    t('form.errors.checkFields', {
      defaultValue: 'Please check the form for errors.',
    }),
  );
};

/**
 * Shared overlay, dialog frame, Escape handling and scroll lock for the
 * Add Category / Add Subcategory popups.
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   labelledBy: string,
 *   closeLabel: string,
 *   children: React.ReactNode,
 * }} props
 */
const CategoryModalShell = ({
  open,
  onClose,
  labelledBy,
  closeLabel,
  children,
}) => {
  useEffect(() => {
    if (!open) return undefined;

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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[6px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative flex w-full max-w-90 flex-col gap-4 rounded-xl bg-white p-5 shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          unstyled
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute right-3 top-3.5 inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition hover:bg-black/5"
        >
          <Image
            src={ADMIN_CATEGORIES_ASSETS.close}
            alt=""
            width={CLOSE_ICON_SIZE}
            height={CLOSE_ICON_SIZE}
            className="size-4.5"
          />
        </Button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default CategoryModalShell;
