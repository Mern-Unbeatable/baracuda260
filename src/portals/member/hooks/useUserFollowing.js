import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  getUserFollowingApi,
  toggleFollowUserApi,
  USER_FOLLOWING_QUERY_KEY,
  USER_PROFILE_ME_QUERY_KEY,
} from '@/shared/api/userProfile.api';
import { getApiErrorMessage } from '@/shared/api/client';

/**
 * Extract photographers array from response regardless of wrapping structure:
 * - { success: true, data: [ ... ], meta: { ... } }
 * - [ ... ]
 * - { data: { data: [ ... ] } }
 * - { items: [ ... ] }
 */
const extractItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data?.data)) return data.data.data;
  if (Array.isArray(data.data?.items)) return data.data.items;
  return [];
};

/**
 * Extract pagination meta from response or fallback to computed defaults.
 */
const extractMeta = (data, fallbackPage, fallbackLimit, itemsLength) => {
  const metaObj = data?.meta || data?.data?.meta || data?.pagination;
  if (metaObj) {
    const totalRecords =
      metaObj.totalRecords ?? metaObj.total ?? metaObj.totalCount ?? itemsLength;
    const totalPages =
      metaObj.totalPages ??
      metaObj.pageCount ??
      Math.max(1, Math.ceil(totalRecords / fallbackLimit));

    return {
      currentPage: metaObj.currentPage ?? metaObj.page ?? fallbackPage,
      totalPages,
      totalRecords,
      hasNext: Boolean(metaObj.hasNext),
      hasPrevious: Boolean(metaObj.hasPrevious),
    };
  }
  return {
    currentPage: fallbackPage,
    totalPages: Math.max(1, Math.ceil(itemsLength / fallbackLimit)),
    totalRecords: itemsLength,
    hasNext: false,
    hasPrevious: false,
  };
};

/**
 * Hook to retrieve member's following list (favourite photographers) and toggle follow state.
 *
 * @param {{ page?: number, limit?: number }} params
 */
export default function useUserFollowing({ page = 1, limit = 12 } = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const queryKey = [...USER_FOLLOWING_QUERY_KEY, page, limit];

  const query = useQuery({
    queryKey,
    queryFn: () => getUserFollowingApi({ page, limit }),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const rawData = query.data;
  const items = extractItems(rawData);
  const meta = extractMeta(rawData, page, limit, items.length);

  const toggleFollowMutation = useMutation({
    mutationFn: (username) => toggleFollowUserApi(username),
    onSuccess: (response, username) => {
      // Invalidate following list and profile queries
      queryClient.invalidateQueries({ queryKey: USER_FOLLOWING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_ME_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ['user-profile', String(username).replace(/^@/, '')],
      });
      if (response?.message) {
        toast.success(response.message);
      }
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('common.errors.general', 'Failed to update follow status.'),
        ),
      );
    },
  });

  return {
    ...query,
    items,
    meta,
    toggleFollow: toggleFollowMutation.mutate,
    toggleFollowAsync: toggleFollowMutation.mutateAsync,
    isTogglingFollow: toggleFollowMutation.isPending,
  };
}
