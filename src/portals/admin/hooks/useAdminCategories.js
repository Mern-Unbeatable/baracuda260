import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  buildCategoryPayload,
  flattenSubcategories,
  isCategoryNameValid,
} from '@/portals/admin/data/adminCategoriesData';
import {
  CATEGORIES_QUERY_KEY,
  createCategoryApi,
  deleteCategoryApi,
  getCategoriesApi,
} from '@/shared/api/categories.api';
import { getApiErrorMessage } from '@/shared/api/client';

/**
 * Categories + subcategories from `/v1/categories`, and the Add modal state.
 */
export default function useAdminCategories() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSubcategoryModalOpen, setIsAddSubcategoryModalOpen] =
    useState(false);

  const categoriesQuery = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategoriesApi,
  });

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const subcategories = useMemo(
    () => flattenSubcategories(categories),
    [categories],
  );

  const refreshCategories = () =>
    queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });

  const createMutation = useMutation({
    mutationFn: createCategoryApi,
    onSuccess: (_data, payload) => {
      refreshCategories();
      if (payload.parentId) {
        setIsAddSubcategoryModalOpen(false);
        toast.success(t('adminCategories.subcategory.createSuccess'));
      } else {
        setIsAddModalOpen(false);
        toast.success(t('adminCategories.createSuccess'));
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t('adminCategories.createError')));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      refreshCategories();
      toast.success(t('adminCategories.deleteSuccess'));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t('adminCategories.deleteError')));
    },
  });

  const handleRemove = (categoryId) => {
    if (deleteMutation.isPending) return;
    deleteMutation.mutate(categoryId);
  };

  const handleSaveCategory = (name) => {
    if (!isCategoryNameValid(name)) return;
    createMutation.mutate(buildCategoryPayload(name));
  };

  const handleSaveSubcategory = ({ categoryId, name }) => {
    if (!categoryId || !isCategoryNameValid(name)) return;
    createMutation.mutate(buildCategoryPayload(name, categoryId));
  };

  return {
    categories,
    subcategories,
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    loadErrorMessage: getApiErrorMessage(
      categoriesQuery.error,
      t('adminCategories.loadError'),
    ),
    refetch: categoriesQuery.refetch,
    isSaving: createMutation.isPending,
    deletingId: deleteMutation.isPending ? deleteMutation.variables : null,
    isAddModalOpen,
    isAddSubcategoryModalOpen,
    handleRemoveCategory: handleRemove,
    handleRemoveSubcategory: handleRemove,
    handleOpenAddModal: () => setIsAddModalOpen(true),
    handleCloseAddModal: () => setIsAddModalOpen(false),
    handleOpenAddSubcategoryModal: () => setIsAddSubcategoryModalOpen(true),
    handleCloseAddSubcategoryModal: () => setIsAddSubcategoryModalOpen(false),
    handleSaveCategory,
    handleSaveSubcategory,
  };
}
