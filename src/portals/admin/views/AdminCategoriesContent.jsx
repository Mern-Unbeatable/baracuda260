import { ChevronDown, Plus, Search, X } from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import Input from '@/components/ui/Input';
import AddCategoryModal from '@/portals/admin/components/admin-categories/AddCategoryModal';
import AddSubcategoryModal from '@/portals/admin/components/admin-categories/AddSubcategoryModal';
import {
  ADMIN_CATEGORIES_ASSETS,
  getCategoryName,
  TRASH_ICON_SIZE,
} from '@/portals/admin/data/adminCategoriesData';
import useAdminCategories from '@/portals/admin/hooks/useAdminCategories';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';

const normalizeSearch = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();

/**
 * @param {{
 *   item: { id: string, name: string },
 *   isDeleting: boolean,
 *   onRemove: (id: string) => void,
 *   tone?: 'parent' | 'child',
 * }} props
 */
const TaxonomyChip = memo(
  ({ item, isDeleting, onRemove, tone = 'child' }) => {
    const { t, i18n } = useTranslation();
    const label = getCategoryName(item.name, i18n.language);
    const isParent = tone === 'parent';

    const handleRemove = async (event) => {
      event.stopPropagation();
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
        className={`inline-flex max-w-full items-center gap-2 rounded-lg px-3.5 py-2 transition ${
          isParent ? 'bg-[#4048cd] text-white' : 'bg-[#ecedfa] text-[#4048cd]'
        } ${isDeleting ? 'opacity-50' : ''}`}
      >
        <span
          className={`truncate text-[14px] font-semibold leading-5 ${
            isParent ? 'text-white' : 'text-[#4048cd]'
          }`}
        >
          {label}
        </span>
        <Button
          unstyled
          type="button"
          aria-label={t('adminCategories.remove', { name: label })}
          onClick={handleRemove}
          disabled={isDeleting}
          className={`inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded disabled:cursor-wait ${
            isParent ? 'hover:bg-white/15' : 'hover:bg-[#dfe1f5]'
          }`}
        >
          <Image
            src={ADMIN_CATEGORIES_ASSETS.trash}
            alt=""
            width={TRASH_ICON_SIZE}
            height={TRASH_ICON_SIZE}
            className={`size-4 ${isParent ? 'brightness-0 invert' : ''}`}
          />
        </Button>
      </div>
    );
  },
);

TaxonomyChip.displayName = 'TaxonomyChip';

/**
 * @param {{
 *   category: object,
 *   visibleSubcategories: object[],
 *   expanded: boolean,
 *   onToggle: () => void,
 *   deletingId: string | null,
 *   onRemoveCategory: (id: string) => void,
 *   onRemoveSubcategory: (id: string) => void,
 *   onAddSubcategory: (categoryId: string) => void,
 * }} props
 */
const CategoryGroupCard = memo(
  ({
    category,
    visibleSubcategories,
    expanded,
    onToggle,
    deletingId,
    onRemoveCategory,
    onRemoveSubcategory,
    onAddSubcategory,
  }) => {
    const { t, i18n } = useTranslation();
    const categoryName = getCategoryName(category.name, i18n.language);
    const totalChildren = Array.isArray(category.subcategories)
      ? category.subcategories.length
      : 0;

    return (
      <article className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 bg-[#f8fafc] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
            <TaxonomyChip
              item={category}
              tone="parent"
              isDeleting={deletingId === category.id}
              onRemove={onRemoveCategory}
            />
            <span className="text-[12px] font-medium text-[#94a3b8]">
              {t('adminCategories.subcategoryCount', {
                defaultValue: '{{count}} subcategories',
                count: totalChildren,
              })}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              unstyled
              type="button"
              onClick={() => onAddSubcategory(category.id)}
              className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-[#c7cbf2] bg-white px-3 py-2 text-[12px] font-semibold text-[#4048cd] transition hover:bg-[#eff1fe]"
            >
              <Plus size={14} aria-hidden="true" />
              {t('adminCategories.subcategory.add')}
            </Button>
            <Button
              unstyled
              type="button"
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? t('adminCategories.collapse', 'Collapse')
                  : t('adminCategories.expand', 'Expand')
              }
              onClick={onToggle}
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#475569] transition hover:border-[#c7cbf2] hover:text-[#4048cd]"
            >
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`transition ${expanded ? 'rotate-180' : ''}`}
              />
            </Button>
          </div>
        </div>

        {expanded ? (
          <div className="border-t border-[#eef2f7] px-4 py-4 sm:px-5">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#94a3b8]">
              {t('adminCategories.subcategory.panelTitle')}
              <span className="ml-1.5 font-medium normal-case tracking-normal text-[#64748b]">
                {t('adminCategories.subcategory.belongsTo', {
                  defaultValue: 'under {{name}}',
                  name: categoryName,
                })}
              </span>
            </p>

            {visibleSubcategories.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {visibleSubcategories.map((sub) => (
                  <TaxonomyChip
                    key={sub.id}
                    item={sub}
                    tone="child"
                    isDeleting={deletingId === sub.id}
                    onRemove={onRemoveSubcategory}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-[#e2e8f0] bg-[#fbfdff] px-4 py-5 text-center text-[13px] text-[#94a3b8]">
                {t('adminCategories.subcategory.emptyUnder', {
                  defaultValue: 'No subcategories under {{name}} yet.',
                  name: categoryName,
                })}
              </p>
            )}
          </div>
        ) : null}
      </article>
    );
  },
);

CategoryGroupCard.displayName = 'CategoryGroupCard';

/**
 * Admin Categories — nested groups with search + collapse for long lists.
 */
const AdminCategoriesContent = memo(() => {
  const { t, i18n } = useTranslation();
  const {
    categories,
    isLoading,
    isError,
    loadErrorMessage,
    refetch,
    isSaving,
    deletingId,
    isAddModalOpen,
    isAddSubcategoryModalOpen,
    addSubcategoryParentId,
    handleRemoveCategory,
    handleRemoveSubcategory,
    handleOpenAddModal,
    handleCloseAddModal,
    handleOpenAddSubcategoryModal,
    handleCloseAddSubcategoryModal,
    handleSaveCategory,
    handleSaveSubcategory,
  } = useAdminCategories();

  const [search, setSearch] = useState('');
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const query = normalizeSearch(search);

  const filteredGroups = useMemo(() => {
    return categories
      .map((category) => {
        const categoryLabel = normalizeSearch(
          getCategoryName(category.name, i18n.language),
        );
        const allSubs = Array.isArray(category.subcategories)
          ? category.subcategories
          : [];

        if (!query) {
          return {
            category,
            visibleSubcategories: allSubs,
            matched: true,
          };
        }

        const categoryMatches = categoryLabel.includes(query);
        const matchedSubs = allSubs.filter((sub) =>
          normalizeSearch(getCategoryName(sub.name, i18n.language)).includes(
            query,
          ),
        );

        if (!categoryMatches && matchedSubs.length === 0) {
          return null;
        }

        return {
          category,
          visibleSubcategories: categoryMatches ? allSubs : matchedSubs,
          matched: true,
        };
      })
      .filter(Boolean);
  }, [categories, i18n.language, query]);

  // While searching, auto-expand matching groups. Otherwise keep user toggles.
  useEffect(() => {
    if (!query) return;
    setExpandedIds(new Set(filteredGroups.map((group) => group.category.id)));
  }, [query, filteredGroups]);

  const allVisibleIds = filteredGroups.map((group) => group.category.id);
  const allExpanded =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => expandedIds.has(id));

  const toggleExpanded = (categoryId) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(allVisibleIds));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <AdminPageHeader
          eyebrow={t('adminCategories.eyebrow')}
          title={t('adminCategories.title')}
          description={t('adminCategories.subtitle')}
        />
        <Button
          unstyled
          type="button"
          onClick={handleOpenAddModal}
          disabled={isLoading || isError}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#ee1c25] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} aria-hidden="true" />
          {t('adminCategories.add')}
        </Button>
      </div>

      {!isLoading && !isError && categories.length > 0 ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('adminCategories.searchPlaceholder', {
                defaultValue: 'Search categories or subcategories…',
              })}
              aria-label={t('adminCategories.searchAria', {
                defaultValue: 'Search taxonomy',
              })}
              inputClassName="h-11 w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] pl-10 pr-10 text-[14px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#4048cd] focus:ring-1 focus:ring-[#4048cd]"
            />
            {search ? (
              <Button
                unstyled
                type="button"
                aria-label={t('common.clear', 'Clear')}
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-[#94a3b8] hover:bg-[#eef2f7] hover:text-[#475569]"
              >
                <X size={14} aria-hidden="true" />
              </Button>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <Button
              unstyled
              type="button"
              onClick={expandAll}
              disabled={allExpanded || filteredGroups.length === 0}
              className="cursor-pointer rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[12px] font-semibold text-[#475569] transition hover:border-[#c7cbf2] hover:text-[#4048cd] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('adminCategories.expandAll', 'Expand all')}
            </Button>
            <Button
              unstyled
              type="button"
              onClick={collapseAll}
              disabled={expandedIds.size === 0}
              className="cursor-pointer rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-[12px] font-semibold text-[#475569] transition hover:border-[#c7cbf2] hover:text-[#4048cd] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t('adminCategories.collapseAll', 'Collapse all')}
            </Button>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          {[1, 2, 3, 4].map((key) => (
            <div
              key={key}
              className="h-16 animate-pulse rounded-2xl border border-[#e2e8f0] bg-white"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-6 py-10 text-center">
          <p className="text-[15px] font-medium text-[#ee1c25]">
            {loadErrorMessage}
          </p>
          <Button
            unstyled
            type="button"
            onClick={() => refetch()}
            className="cursor-pointer rounded-lg border border-[#e4e4e4] px-4 py-2 text-[14px] text-[#323232] transition hover:bg-[#f4f4f4]"
          >
            {t('adminCategories.retry')}
          </Button>
        </div>
      ) : categories.length > 0 ? (
        filteredGroups.length > 0 ? (
          <div
            className="flex flex-col gap-4"
            aria-label={t('adminCategories.panelAria')}
          >
            <p className="text-[12px] font-medium text-[#94a3b8]">
              {t('adminCategories.resultsCount', {
                defaultValue: 'Showing {{count}} categories',
                count: filteredGroups.length,
              })}
            </p>
            {filteredGroups.map(({ category, visibleSubcategories }) => (
              <CategoryGroupCard
                key={category.id}
                category={category}
                visibleSubcategories={visibleSubcategories}
                expanded={expandedIds.has(category.id)}
                onToggle={() => toggleExpanded(category.id)}
                deletingId={deletingId}
                onRemoveCategory={handleRemoveCategory}
                onRemoveSubcategory={handleRemoveSubcategory}
                onAddSubcategory={handleOpenAddSubcategoryModal}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white px-6 py-10 text-center">
            <p className="text-[15px] text-[#64748b]">
              {t('adminCategories.searchEmpty', {
                defaultValue: 'No categories match “{{query}}”.',
                query: search.trim(),
              })}
            </p>
            <Button
              unstyled
              type="button"
              onClick={() => setSearch('')}
              className="mt-3 cursor-pointer text-[13px] font-semibold text-[#4048cd] hover:underline"
            >
              {t('adminCategories.clearSearch', 'Clear search')}
            </Button>
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-dashed border-[#e2e8f0] bg-white px-6 py-12 text-center">
          <p className="text-[15px] text-[#64748b]">
            {t('adminCategories.empty')}
          </p>
          <Button
            unstyled
            type="button"
            onClick={handleOpenAddModal}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#ee1c25] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#d41921]"
          >
            <Plus size={16} aria-hidden="true" />
            {t('adminCategories.add')}
          </Button>
        </div>
      )}

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
        initialCategoryId={addSubcategoryParentId}
        isSaving={isSaving}
      />
    </div>
  );
});

AdminCategoriesContent.displayName = 'AdminCategoriesContent';

export default AdminCategoriesContent;
