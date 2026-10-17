import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  filterPremiumPhotosCards,
  PREMIUM_PHOTOS_PAGE_SIZE,
} from '@/portals/admin/data/adminPremiumPhotosData';
import {
  ADMIN_PREMIUM_PHOTOS_QUERY_KEY,
  deleteAdminPremiumPhotoApi,
  getAdminPremiumPhotosApi,
} from '@/shared/api/premiumPhotos.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

/**
 * Showcase filter + server pagination hook for Admin Premium Photos.
 * Connects directly to GET /v1/admin/premium-photos?page=1&limit=10.
 */
export default function useAdminPremiumPhotosShowcase({
  pageSize = PREMIUM_PHOTOS_PAGE_SIZE,
} = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  const {
    data: apiResult,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [...ADMIN_PREMIUM_PHOTOS_QUERY_KEY, page, pageSize],
    queryFn: () =>
      getAdminPremiumPhotosApi({
        page,
        limit: pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (photoId) => deleteAdminPremiumPhotoApi(photoId),
    onSuccess: () => {
      toast.success(
        t(
          'adminPremiumPhotos.deleteSuccess',
          'Premium photo deleted successfully.',
        ),
      );
      queryClient.invalidateQueries({
        queryKey: ADMIN_PREMIUM_PHOTOS_QUERY_KEY,
      });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('adminPremiumPhotos.deleteError', 'Failed to delete premium photo.'),
        ),
      );
    },
  });

  const handleDeletePhoto = async (photoId) => {
    const confirmed = await confirmDestructiveAction({
      title: t('adminPremiumPhotos.confirmDelete.title', 'Delete Premium Photo?'),
      text: t(
        'adminPremiumPhotos.confirmDelete.text',
        'Are you sure you want to delete this premium photo? This action cannot be undone.',
      ),
      confirmButtonText: t('adminPremiumPhotos.confirmDelete.confirm', 'Delete'),
      cancelButtonText: t('adminPremiumPhotos.confirmDelete.cancel', 'Cancel'),
    });

    if (confirmed) {
      await deleteMutation.mutateAsync(photoId);
    }
  };

  const cards = useMemo(() => apiResult?.data ?? [], [apiResult?.data]);
  const meta = apiResult?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const totalRecords = meta?.totalRecords ?? 0;

  const visibleCards = useMemo(
    () => filterPremiumPhotosCards(cards, activeFilter),
    [cards, activeFilter],
  );

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    setPage(1);
    scrollToPageTop();
  };

  const handlePageChange = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    setPage(clamped);
    scrollToPageTop();
  };

  return {
    activeFilter,
    page,
    totalPages,
    totalRecords,
    visibleCards,
    allCards: cards,
    isLoading,
    isError,
    error,
    isFetching,
    isDeleting: deleteMutation.isPending,
    refetch,
    handleDeletePhoto,
    handleFilterClick,
    handlePageChange,
  };
}
