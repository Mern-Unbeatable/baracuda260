import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  PROMOTED_PAGE_SIZE,
  PROMOTED_PAGE_SIZE_MOBILE,
} from '@/portals/admin/data/adminPromotedProductsData';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  ADMIN_PROMOTIONS_QUERY_KEY,
  deleteAdminPromotionApi,
  getAdminPromotionsApi,
} from '@/shared/api/promotions.api';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

const MOBILE_MQ = '(max-width: 639px)';

const readIsMobile = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(MOBILE_MQ).matches;
};

/**
 * Filter and pagination hook for Admin Promoted Products.
 * Mobile 10/page; sm+ 8/page — matches competitions/gallery.
 */
export default function useAdminPromotedProductsShowcase() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(readIsMobile);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia(MOBILE_MQ);
    const onChange = () => {
      setIsMobile(media.matches);
      setPage(1);
    };
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const pageSize = isMobile ? PROMOTED_PAGE_SIZE_MOBILE : PROMOTED_PAGE_SIZE;

  const apiTypeParam = useMemo(() => {
    const val = String(activeFilter || 'all').toUpperCase();
    if (val === 'ARTWORK' || val === 'PRODUCT') {
      return val;
    }
    if (val === 'SELL_PHOTO' || val === 'SELL') {
      return 'SELL';
    }
    return 'ALL';
  }, [activeFilter]);

  const {
    data: apiResult,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      ...ADMIN_PROMOTIONS_QUERY_KEY,
      apiTypeParam,
      statusFilter,
      page,
      pageSize,
    ],
    queryFn: () =>
      getAdminPromotionsApi({
        type: apiTypeParam,
        status: statusFilter,
        page,
        limit: pageSize,
      }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const cards = useMemo(() => apiResult?.items ?? [], [apiResult?.items]);
  const meta = apiResult?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const totalRecords = meta?.totalRecords ?? cards.length;
  const summary = apiResult?.summary ?? {
    totalPromotions: 0,
    activePromotions: 0,
    expiredPromotions: 0,
    totalArtworkPromotions: 0,
    totalSellPhotoPromotions: 0,
    totalRevenue: 0,
  };

  // Server already filters by type for artwork/product/sell; album chips still refine client-side.
  const visibleCards = useMemo(() => {
    const normalized = String(activeFilter || 'all').toLowerCase();
    if (
      !normalized ||
      normalized === 'all' ||
      normalized === 'artwork' ||
      normalized === 'product' ||
      normalized === 'sell_photo' ||
      normalized === 'sell'
    ) {
      return cards;
    }
    return cards.filter((card) => {
      const type = String(card.type || '').toLowerCase();
      if (normalized === 'single') return type === 'single';
      if (normalized === 'six') return type === 'six';
      if (normalized === 'zodiac') return type === 'zodiac' || type === 'twelve';
      return type === normalized;
    });
  }, [cards, activeFilter]);

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    setPage(1);
    scrollToPageTop();
  };

  const handleStatusFilterClick = (statusId) => {
    setStatusFilter(statusId);
    setPage(1);
    scrollToPageTop();
  };

  const handlePageChange = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    setPage(clamped);
    scrollToPageTop();
  };

  const deleteMutation = useMutation({
    mutationFn: (promotionId) => deleteAdminPromotionApi(promotionId),
    onMutate: (promotionId) => {
      setDeletingId(promotionId);
    },
    onSuccess: () => {
      toast.success(
        t(
          'adminPromoted.deleteSuccess',
          'Expired promotion deleted successfully.',
        ),
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_PROMOTIONS_QUERY_KEY });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t(
            'adminPromoted.deleteError',
            'Failed to delete promotion. Only expired promotions can be deleted.',
          ),
        ),
      );
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = async (card) => {
    if (!card?.id || !card.isExpired) return;

    const confirmed = await confirmDestructiveAction({
      title: t('adminPromoted.confirmDelete.title', 'Delete Promotion?'),
      text: t(
        'adminPromoted.confirmDelete.text',
        'This removes the expired promotion record. This action cannot be undone.',
      ),
      confirmButtonText: t('adminPromoted.confirmDelete.confirm', 'Delete'),
      cancelButtonText: t('adminPromoted.confirmDelete.cancel', 'Cancel'),
    });

    if (!confirmed) return;
    await deleteMutation.mutateAsync(card.id);
  };

  return {
    activeFilter,
    statusFilter,
    page,
    totalPages,
    totalRecords,
    summary,
    visibleCards,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    deletingId,
    handleFilterClick,
    handleStatusFilterClick,
    handlePageChange,
    handleDelete,
  };
}
