import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_CATEGORIES_ASSETS,
  PLUS_ICON_SIZE,
  TRASH_ICON_SIZE,
} from './adminCategoriesData';
import useAdminCategories from './useAdminCategories';
import AddCategoryModal from './AddCategoryModal';

/**
 * @param {{
 *   category: {
 *     id: string,
 *     labelKey?: string,
 *     label?: string,
 *     labelParams?: Record<string, string | number>,
 *   },
 * }} props
 */
const getCategoryLabel = (t, category) => {
  if (category.label) return category.label;
  return t(category.labelKey, category.labelParams);
};

/**
 * @param {{
 *   category: {
 *     id: string,
 *     labelKey?: string,
 *     label?: string,
 *     labelParams?: Record<string, string | number>,
 *   },
 *   onRemove: (id: string) => void,
 * }} props
 */
const CategoryChip = memo(({ category, onRemove }) => {
  const { t } = useTranslation();
  const label = getCategoryLabel(t, category);

  return (
    <div className="inline-flex items-center gap-2.5 rounded-[8px] bg-[#ecedfa] px-5 py-2.5">
      <span className="text-[16px] font-medium leading-6 whitespace-nowrap text-[#666dd7]">
        {label}
      </span>
      <button
        type="button"
        aria-label={t('adminCategories.remove', { name: label })}
        onClick={() => onRemove(category.id)}
        className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center"
      >
        <img
          src={ADMIN_CATEGORIES_ASSETS.trash}
          alt=""
          width={TRASH_ICON_SIZE}
          height={TRASH_ICON_SIZE}
          className="size-5"
        />
      </button>
    </div>
  );
});

CategoryChip.displayName = 'CategoryChip';

/**
 * Admin Categories — Figma node 339:3170.
 */
const AdminCategoriesContent = memo(() => {
  const { t } = useTranslation();
  const {
    categories,
    isAddModalOpen,
    handleRemoveCategory,
    handleOpenAddModal,
    handleCloseAddModal,
    handleSaveCategory,
  } = useAdminCategories();

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="flex flex-col gap-1">
        <p className="text-[14px] font-extrabold uppercase leading-[19px] tracking-[1.55px] text-[#7f8ba1]">
          {t('adminCategories.eyebrow')}
        </p>
        <h1 className="font-manrope pt-3 text-[36px] font-normal leading-[42px] tracking-[-1.68px] text-[#151e31]">
          {t('adminCategories.title')}
        </h1>
        <p className="pt-3 text-[16px] leading-[25px] text-[#687186]">
          {t('adminCategories.subtitle')}
        </p>
      </header>

      <section
        aria-label={t('adminCategories.panelAria')}
        className="rounded-[10px] border border-[#e4e4e4] bg-white px-4 py-3.5 sm:px-6"
      >
        <div className="flex flex-col gap-[18px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[24px] font-medium leading-normal text-black">
              {t('adminCategories.panelTitle')}
            </h2>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-[8px] bg-[#ee1c25] px-5 py-3 text-[12px] leading-5 text-white transition hover:bg-[#d41921]"
            >
              <img
                src={ADMIN_CATEGORIES_ASSETS.plus}
                alt=""
                width={PLUS_ICON_SIZE}
                height={PLUS_ICON_SIZE}
                className="size-4"
              />
              {t('adminCategories.add')}
            </button>
          </div>

          <div className="h-px w-full bg-[#e4e4e4]" aria-hidden="true" />

          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-x-5 gap-y-[18px]">
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  category={category}
                  onRemove={handleRemoveCategory}
                />
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-[16px] text-[#687186]">
              {t('adminCategories.empty')}
            </p>
          )}
        </div>
      </section>

      <AddCategoryModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveCategory}
      />
    </div>
  );
});

AdminCategoriesContent.displayName = 'AdminCategoriesContent';

export default AdminCategoriesContent;
