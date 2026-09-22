import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import {
  ADMIN_CATEGORIES_ASSETS,
  CLOSE_ICON_SIZE,
} from '@/portals/admin/data/adminCategoriesData';

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (!open) return undefined;

    reset({ name: '' });

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
  }, [open, onClose, reset]);

  if (!open) return null;

  const onFormSubmit = (data) => {
    onSave(data.name.trim());
  };

  const onFormError = () => {
    toast.error(
      t('form.errors.checkFields', {
        defaultValue: 'Please check the form for errors.',
      }),
    );
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
        className="flex w-full max-w-90 flex-col gap-4 rounded-xl bg-white p-5 shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit(onFormSubmit, onFormError)}
          className="flex w-full flex-col gap-4"
        >
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <h2
                id={titleId}
                className="min-w-0 text-[16px] font-medium leading-6 text-[#323232]"
              >
                {t('adminCategories.addModal.nameLabel')}
              </h2>
              <Button
                unstyled
                type="button"
                onClick={onClose}
                aria-label={t('adminCategories.addModal.close')}
                className="-mr-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-black/5"
              >
                <Image
                  src={ADMIN_CATEGORIES_ASSETS.close}
                  alt=""
                  width={CLOSE_ICON_SIZE}
                  height={CLOSE_ICON_SIZE}
                  className="size-4.5"
                />
              </Button>
            </div>

            <Input
              type="text"
              placeholder={t('adminCategories.addModal.namePlaceholder')}
              inputClassName={`box-border h-10 w-full rounded-lg border bg-[#f4f4f4] px-2 text-[14px] leading-5.5 text-[#454545] outline-none placeholder:text-[#9a9a9a] focus:border-[#4048cd] ${
                errors.name ? 'border-[#ee1c25]' : 'border-transparent'
              }`}
              error={errors.name}
              {...register('name', {
                required: t('adminCategories.addModal.nameRequired'),
              })}
            />
          </div>

          <Button
            unstyled
            type="submit"
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-[#ee1c25] px-5 text-[12px] leading-5 text-white transition hover:bg-[#d41921]"
          >
            {t('adminCategories.addModal.save')}
          </Button>
        </form>
      </div>
    </div>,
    document.body,
  );
});

AddCategoryModal.displayName = 'AddCategoryModal';

export default AddCategoryModal;
