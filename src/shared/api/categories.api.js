import { apiClient } from './client';

export const CATEGORIES_QUERY_KEY = ['categories'];

export const getCategoriesApi = async () => {
  const response = await apiClient.get('/v1/categories');
  return response?.data ?? [];
};

export const createCategoryApi = async (payload) => {
  // payload: { name, slug, parentId? }
  const response = await apiClient.post('/v1/categories', payload);
  return response?.data;
};

export const deleteCategoryApi = async (categoryId) => {
  const response = await apiClient.delete(`/v1/categories/${categoryId}`);
  return response?.data;
};
