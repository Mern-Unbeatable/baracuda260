import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  COMPETITIONS_PAGE_SIZE,
  toggleCompetitionFilter,
} from '@/portals/admin/data/adminCompetitionsData';
import {
  ADMIN_ARTWORKS_QUERY_KEY,
  deleteAdminArtworkApi,
  getAdminArtworksApi,
} from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

const FILTER_TO_KIND = {
  single: 'SINGLE',
  six: 'SIX',
  zodiac: 'TWELVE',
};

/**
 * Showcase filter + server pagination hook for Admin Competitions / Artworks.
 * Connects directly to GET /v1/admin/artworks?competitionState=IN_COMPETITION&page=1&limit=6.
 */
export default function useAdminCompetitionsShowcase({
  competitionState = 'IN_COMPETITION',
  pageSize = COMPETITIONS_PAGE_SIZE,
} = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);

  const kind = activeFilter ? FILTER_TO_KIND[activeFilter] : undefined;

  const {
    data: apiResult,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      ...ADMIN_ARTWORKS_QUERY_KEY,
      competitionState,
      kind || 'ALL',
      page,
      pageSize,
    ],
    queryFn: () =>
      getAdminArtworksApi({
        competitionState,
        status: 'APPROVED',
        kind,
        page,
        limit: pageSize,
      }),
    // Avoid keeping previous heavy image cards mounted while fetching
    placeholderData: undefined,
    staleTime: 30 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (artworkId) => deleteAdminArtworkApi(artworkId),
    onSuccess: () => {
      toast.success(
        t('adminCompetitions.deleteSuccess', 'Artwork deleted successfully.'),
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_ARTWORKS_QUERY_KEY });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('adminCompetitions.deleteError', 'Failed to delete artwork.'),
        ),
      );
    },
  });

  const handleDeleteArtwork = async (artworkId) => {
    const confirmed = await confirmDestructiveAction({
      title: t('adminCompetitions.confirmDelete.title', 'Delete Artwork?'),
      text: t(
        'adminCompetitions.confirmDelete.text',
        'Are you sure you want to delete this artwork? This action cannot be undone.',
      ),
      confirmButtonText: t('adminCompetitions.confirmDelete.confirm', 'Delete'),
      cancelButtonText: t('adminCompetitions.confirmDelete.cancel', 'Cancel'),
    });

    if (confirmed) {
      await deleteMutation.mutateAsync(artworkId);
    }
  };

  const visibleCards = apiResult?.data ?? [];
  const meta = apiResult?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const totalRecords = meta?.totalRecords ?? 0;

  const handleFilterClick = (filterId) => {
    setActiveFilter((current) => toggleCompetitionFilter(current, filterId));
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
    allCards: visibleCards,
    isLoading,
    isError,
    error,
    isFetching,
    isDeleting: deleteMutation.isPending,
    refetch,
    handleDeleteArtwork,
    handleFilterClick,
    handlePageChange,
  };
}
