import { useState } from 'react';
import {
  ADMIN_CATEGORY_ITEMS,
  appendCategory,
  createAddedCategory,
  removeCategoryById,
} from './adminCategoriesData';

/**
 * Category chip list state for Admin Categories.
 */
export default function useAdminCategories(initialCategories = ADMIN_CATEGORY_ITEMS) {
  const [categories, setCategories] = useState(initialCategories);
  const [nextCustomIndex, setNextCustomIndex] = useState(1);

  const handleRemoveCategory = (categoryId) => {
    setCategories((current) => removeCategoryById(current, categoryId));
  };

  const handleAddCategory = () => {
    const nextCategory = createAddedCategory(nextCustomIndex);
    setCategories((current) => appendCategory(current, nextCategory));
    setNextCustomIndex((current) => current + 1);
  };

  return {
    categories,
    handleRemoveCategory,
    handleAddCategory,
  };
}
