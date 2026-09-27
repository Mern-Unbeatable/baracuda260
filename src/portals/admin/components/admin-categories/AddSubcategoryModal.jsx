import { ChevronDown } from 'lucide-react';
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
import {
  getCategoryName,
  isCategoryNameValid,
} from '@/portals/admin/data/adminCategoriesData';

const EMPTY_FORM = { categoryId: '', name: '' };

/**
 * Add Subcategory popup — select a parent category, then name the subcategory.
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onSave: (values: { categoryId: string, name: string }) => void,
 *   categories: Array<{ id: string, name: string }>,
 *   isSaving?: boolean,
 * }} props
 */
const AddSubcategoryModal = memo(
  ({ open, onClose, onSave, categories, isSaving = false }) => {
    const { t, i18n } = useTranslation();
    const titleId = useId();
    const categoryFieldId = useId();
    const nameId = useId();

    const {
      register,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
    } = useForm({
      defaultValues: EMPTY_FORM,
    });

    useEffect(() => {
      if (open) reset(EMPTY_FORM);
    }, [open, reset]);

    const selectedCategoryId = watch('categoryId');

    const onFormSubmit = (data) => {
      onSave({ categoryId: data.categoryId, name: data.name.trim() });
    };

    return (
      <CategoryModalShell
        open={open}
        onClose={onClose}
        labelledBy={titleId}
        closeLabel={t('adminCategories.subcategory.addModal.close')}
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
              htmlFor={categoryFieldId}
              className={`${CATEGORY_MODAL_LABEL_CLASS} pr-9`}
            >
              {t('adminCategories.subcategory.addModal.categoryLabel')}
            </label>
            <div className="relative">
              <select
                id={categoryFieldId}
                aria-invalid={Boolean(errors.categoryId)}
                className={`${getCategoryModalFieldClass(
                  Boolean(errors.categoryId),
                )} cursor-pointer appearance-none pr-9 ${
                  selectedCategoryId ? '' : 'text-[#9a9a9a]'
                }`}
                {...register('categoryId', {
                  required: t(
                    'adminCategories.subcategory.addModal.categoryRequired',
                  ),
                })}
              >
                <option value="" disabled>
                  {t(
                    'adminCategories.subcategory.addModal.categoryPlaceholder',
                  )}
                </option>
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className="text-[#454545]"
                  >
                    {getCategoryName(category.name, i18n.language)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#323232]"
              />
            </div>
            {errors.categoryId && (
              <p className="text-[13px] text-[#ee1c25]">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <label htmlFor={nameId} className={CATEGORY_MODAL_LABEL_CLASS}>
              {t('adminCategories.subcategory.addModal.nameLabel')}
            </label>
            <Input
              id={nameId}
              type="text"
              placeholder={t(
                'adminCategories.subcategory.addModal.namePlaceholder',
              )}
              inputClassName={getCategoryModalFieldClass(Boolean(errors.name))}
              error={errors.name}
              {...register('name', {
                required: t(
                  'adminCategories.subcategory.addModal.nameRequired',
                ),
                validate: (value) =>
                  isCategoryNameValid(value) ||
                  t('adminCategories.subcategory.addModal.nameRequired'),
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
              : t('adminCategories.subcategory.addModal.save')}
          </Button>
        </form>
      </CategoryModalShell>
    );
  },
);

AddSubcategoryModal.displayName = 'AddSubcategoryModal';

export default AddSubcategoryModal;
