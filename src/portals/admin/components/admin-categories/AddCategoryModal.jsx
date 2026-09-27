import React, { memo, useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CategoryModalShell, {
  CATEGORY_MODAL_LABEL_CLASS,
  CATEGORY_MODAL_SAVE_CLASS,
  getCategoryModalFieldClass,
  showCategoryFormErrorToast,
} from '@/portals/admin/components/admin-categories/CategoryModalShell';
import { isCategoryNameValid } from '@/portals/admin/data/adminCategoriesData';

/**
 * Add Category popup — Figma node 339:4813.
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onSave: (name: string) => void,
 *   isSaving?: boolean,
 * }} props
 */
const AddCategoryModal = memo(({ open, onClose, onSave, isSaving = false }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const nameId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) reset({ name: '' });
  }, [open, reset]);

  const onFormSubmit = (data) => {
    onSave(data.name.trim());
  };

  return (
    <CategoryModalShell
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      closeLabel={t('adminCategories.addModal.close')}
    >
      <form
        onSubmit={handleSubmit(onFormSubmit, () =>
          showCategoryFormErrorToast(t),
        )}
        noValidate
        className="flex w-full flex-col gap-4"
      >
        <div className="flex w-full flex-col gap-2.5">
          <label
            id={titleId}
            htmlFor={nameId}
            className={`${CATEGORY_MODAL_LABEL_CLASS} pr-9`}
          >
            {t('adminCategories.addModal.nameLabel')}
          </label>
          <Input
            id={nameId}
            type="text"
            placeholder={t('adminCategories.addModal.namePlaceholder')}
            inputClassName={getCategoryModalFieldClass(Boolean(errors.name))}
            error={errors.name}
            {...register('name', {
              required: t('adminCategories.addModal.nameRequired'),
              validate: (value) =>
                isCategoryNameValid(value) ||
                t('adminCategories.addModal.nameRequired'),
            })}
          />
        </div>

        <Button
          unstyled
          type="submit"
          disabled={isSaving}
          className={CATEGORY_MODAL_SAVE_CLASS}
        >
          {isSaving
            ? t('adminCategories.saving')
            : t('adminCategories.addModal.save')}
        </Button>
      </form>
    </CategoryModalShell>
  );
});

AddCategoryModal.displayName = 'AddCategoryModal';

export default AddCategoryModal;
