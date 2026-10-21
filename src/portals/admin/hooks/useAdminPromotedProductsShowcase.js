import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  filterPromotedCards,
  PROMOTED_PAGE_SIZE,
} from '@/portals/admin/data/adminPromotedProductsData';
import {
  ADMIN_PROMOTIONS_QUERY_KEY,
  getAdminPromotionsApi,
} from '@/shared/api/promotions.api';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

/**
 * Filter and pagination hook for Admin Promoted Products.
 * Connects to GET /api/v1/admin/promotions?type=ALL&status=ALL&page=1&limit=10
 */
export default function useAdminPromotedProductsShowcase({
  pageSize = PROMOTED_PAGE_SIZE,
} = {}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

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

  const visibleCards = useMemo(
    () => filterPromotedCards(cards, activeFilter),
    [cards, activeFilter],
  );

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    setPage(1);
  };

  const handleStatusFilterClick = (statusId) => {
    setStatusFilter(statusId);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    setPage(clamped);
    scrollToPageTop();
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
    handleFilterClick,
    handleStatusFilterClick,
    handlePageChange,
  };
}
