import { useState } from 'react';
import {
  ADMIN_CATEGORY_ITEMS,
  appendCategory,
  createCategoryFromName,
  isCategoryNameValid,
  removeCategoryById,
} from '@/modules/admin/data/adminCategoriesData';

/**
 * Category chip list + Add Category modal state.
 */
export default function useAdminCategories(initialCategories = ADMIN_CATEGORY_ITEMS) {
  const [categories, setCategories] = useState(initialCategories);
  const [nextCustomIndex, setNextCustomIndex] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleRemoveCategory = (categoryId) => {
    setCategories((current) => removeCategoryById(current, categoryId));
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveCategory = (name) => {
    if (!isCategoryNameValid(name)) return;

    const nextCategory = createCategoryFromName(name, nextCustomIndex);
    setCategories((current) => appendCategory(current, nextCategory));
    setNextCustomIndex((current) => current + 1);
    setIsAddModalOpen(false);
  };

  return {
    categories,
    isAddModalOpen,
    handleRemoveCategory,
    handleOpenAddModal,
    handleCloseAddModal,
    handleSaveCategory,
  };
}
