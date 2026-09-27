import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import AddCategoryModal from '@/portals/admin/components/admin-categories/AddCategoryModal';
import AddSubcategoryModal from '@/portals/admin/components/admin-categories/AddSubcategoryModal';
import {
  ADMIN_CATEGORIES_ASSETS,
  getCategoryName,
  PLUS_ICON_SIZE,
  TRASH_ICON_SIZE,
} from '@/portals/admin/data/adminCategoriesData';
import useAdminCategories from '@/portals/admin/hooks/useAdminCategories';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';

/**
 * @param {{
 *   item: { id: string, name: string },
 *   isDeleting: boolean,
 *   onRemove: (id: string) => void,
 * }} props
 */
const TaxonomyChip = memo(({ item, isDeleting, onRemove }) => {
  const { t, i18n } = useTranslation();
  const label = getCategoryName(item.name, i18n.language);

  const handleRemove = async () => {
    const confirmed = await confirmDestructiveAction({
      title: t('adminCategories.confirmDelete.title', { name: label }),
      text: t('adminCategories.confirmDelete.text'),
      confirmButtonText: t('adminCategories.confirmDelete.confirm'),
      cancelButtonText: t('adminCategories.confirmDelete.cancel'),
    });
    if (confirmed) onRemove(item.id);
  };

  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-lg bg-[#ecedfa] px-5 py-2.5 transition ${
        isDeleting ? 'opacity-50' : ''
      }`}
    >
      <span className="text-[16px] font-medium leading-6 whitespace-nowrap text-[#666dd7]">
        {label}
      </span>
      <Button
        unstyled
        type="button"
        aria-label={t('adminCategories.remove', { name: label })}
        onClick={handleRemove}
        disabled={isDeleting}
        className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center disabled:cursor-wait"
      >
        <Image
          src={ADMIN_CATEGORIES_ASSETS.trash}
          alt=""
          width={TRASH_ICON_SIZE}
          height={TRASH_ICON_SIZE}
          className="size-5"
        />
      </Button>
    </div>
  );
});

TaxonomyChip.displayName = 'TaxonomyChip';

/**
 * @param {{
 *   ariaLabel: string,
 *   title: string,
 *   addLabel: string,
 *   emptyText: string,
 *   items: Array<{ id: string, name: string }>,
 *   status: 'loading' | 'error' | 'ready',
 *   errorMessage?: string,
 *   onRetry: () => void,
 *   deletingId: string | null,
 *   onAdd: () => void,
 *   onRemove: (id: string) => void,
 * }} props
 */
const TaxonomyPanel = memo(
  ({
    ariaLabel,
    title,
    addLabel,
    emptyText,
    items,
    status,
    errorMessage,
    onRetry,
    deletingId,
    onAdd,
    onRemove,
  }) => {
    const { t } = useTranslation();

    let body;
    if (status === 'loading') {
      body = (
        <div className="flex flex-wrap gap-x-5 gap-y-4.5" aria-busy="true">
          {[112, 88, 136, 96, 120].map((width) => (
            <div
              key={width}
              className="h-11 animate-pulse rounded-lg bg-[#ecedfa]"
              style={{ width }}
            />
          ))}
        </div>
      );
    } else if (status === 'error') {
      body = (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <p className="text-[16px] text-[#ee1c25]">{errorMessage}</p>
          <Button
            unstyled
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-lg border border-[#e4e4e4] px-4 py-2 text-[14px] text-[#323232] transition hover:bg-[#f4f4f4]"
          >
            {t('adminCategories.retry')}
          </Button>
        </div>
      );
    } else if (items.length > 0) {
      body = (
        <div className="flex flex-wrap gap-x-5 gap-y-4.5">
          {items.map((item) => (
            <TaxonomyChip
              key={item.id}
              item={item}
              isDeleting={deletingId === item.id}
              onRemove={onRemove}
            />
          ))}
        </div>
      );
    } else {
      body = (
        <p className="py-4 text-center text-[16px] text-[#687186]">
          {emptyText}
        </p>
      );
    }

    return (
      <section
        aria-label={ariaLabel}
        className="rounded-[10px] border border-[#e4e4e4] bg-white px-4 py-3.5 sm:px-6"
      >
        <div className="flex flex-col gap-4.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[24px] font-medium leading-normal text-black">
              {title}
            </h2>
            <Button
              unstyled
              type="button"
              onClick={onAdd}
              disabled={status !== 'ready'}
              className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#ee1c25] px-5 py-3 text-[12px] leading-5 text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Image
                src={ADMIN_CATEGORIES_ASSETS.plus}
                alt=""
                width={PLUS_ICON_SIZE}
                height={PLUS_ICON_SIZE}
                className="size-4"
              />
              {addLabel}
            </Button>
          </div>

          <div className="h-px w-full bg-[#e4e4e4]" aria-hidden="true" />

          {body}
        </div>
      </section>
    );
  },
);

TaxonomyPanel.displayName = 'TaxonomyPanel';

/**
 * Admin Categories — Figma node 339:3170.
 */
const AdminCategoriesContent = memo(() => {
  const { t } = useTranslation();
  const {
    categories,
    subcategories,
    isLoading,
    isError,
    loadErrorMessage,
    refetch,
    isSaving,
    deletingId,
    isAddModalOpen,
    isAddSubcategoryModalOpen,
    handleRemoveCategory,
    handleRemoveSubcategory,
    handleOpenAddModal,
    handleCloseAddModal,
    handleOpenAddSubcategoryModal,
    handleCloseAddSubcategoryModal,
    handleSaveCategory,
    handleSaveSubcategory,
  } = useAdminCategories();

  const status = isLoading ? 'loading' : isError ? 'error' : 'ready';

  return (
    <div className="flex w-full flex-col gap-8">
      <AdminPageHeader
        eyebrow={t('adminCategories.eyebrow')}
        title={t('adminCategories.title')}
        description={t('adminCategories.subtitle')}
      />

      <div className="flex flex-col gap-4">
        <TaxonomyPanel
          ariaLabel={t('adminCategories.panelAria')}
          title={t('adminCategories.panelTitle')}
          addLabel={t('adminCategories.add')}
          emptyText={t('adminCategories.empty')}
          items={categories}
          status={status}
          errorMessage={loadErrorMessage}
          onRetry={refetch}
          deletingId={deletingId}
          onAdd={handleOpenAddModal}
          onRemove={handleRemoveCategory}
        />

        <TaxonomyPanel
          ariaLabel={t('adminCategories.subcategory.panelAria')}
          title={t('adminCategories.subcategory.panelTitle')}
          addLabel={t('adminCategories.subcategory.add')}
          emptyText={t('adminCategories.subcategory.empty')}
          items={subcategories}
          status={status}
          errorMessage={loadErrorMessage}
          onRetry={refetch}
          deletingId={deletingId}
          onAdd={handleOpenAddSubcategoryModal}
          onRemove={handleRemoveSubcategory}
        />
      </div>

      <AddCategoryModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveCategory}
        isSaving={isSaving}
      />

      <AddSubcategoryModal
        open={isAddSubcategoryModalOpen}
        onClose={handleCloseAddSubcategoryModal}
        onSave={handleSaveSubcategory}
        categories={categories}
        isSaving={isSaving}
      />
    </div>
  );
});

AdminCategoriesContent.displayName = 'AdminCategoriesContent';

export default AdminCategoriesContent;
