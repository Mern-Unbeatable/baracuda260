import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  deleteStoreProductApi,
  getStoreProductsApi,
  STORE_PRODUCTS_QUERY_KEY,
} from '@/shared/api/store.api';

/**
 * Hook to manage fetching, filtering, and deleting store products.
 *
 * @param {{
 *   category?: string,
 *   page?: number,
 *   limit?: number,
 *   search?: string,
 * }} options
 */
export default function useStoreProducts({
  category = 'all',
  page = 1,
  limit = 8,
  search = '',
} = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const queryKey = [
    STORE_PRODUCTS_QUERY_KEY,
    {
      category: category?.toLowerCase?.() === 'all' ? 'all' : category,
      page,
      limit,
      search,
    },
  ];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getStoreProductsApi({
        category,
        page,
        limit,
        search,
      }),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }) => {
      return await deleteStoreProductApi(id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [STORE_PRODUCTS_QUERY_KEY] });
      toast.success(
        t('myStore.toast.deleted', {
          title: variables?.title || t('myStore.title', 'Product'),
        }),
      );
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('common.errors.general', 'Failed to delete product.'),
        ),
      );
    },
  });

  return {
    products: query.data?.data || [],
    meta: query.data?.meta || {
      currentPage: page,
      totalPages: 1,
      totalRecords: 0,
      hasNext: false,
      hasPrevious: false,
    },
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    deleteProduct: (id, title) => deleteMutation.mutateAsync({ id, title }),
    isDeleting: deleteMutation.isPending,
  };
}
