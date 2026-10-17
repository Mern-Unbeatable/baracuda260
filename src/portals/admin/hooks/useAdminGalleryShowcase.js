import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  filterGalleryCards,
  GALLERY_PAGE_SIZE,
} from '@/portals/admin/data/adminGalleryData';
import {
  ADMIN_ARTWORKS_QUERY_KEY,
  deleteAdminArtworkApi,
  getAdminArtworksApi,
} from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

/**
 * Showcase filter + server pagination hook for Admin Gallery.
 * Connects directly to GET /v1/admin/artworks?competitionState=PROFILE_ONLY&page=1&limit=10.
 */
export default function useAdminGalleryShowcase({
  competitionState = 'PROFILE_ONLY',
  pageSize = GALLERY_PAGE_SIZE,
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
    queryKey: [
      ...ADMIN_ARTWORKS_QUERY_KEY,
      competitionState,
      page,
      pageSize,
    ],
    queryFn: () =>
      getAdminArtworksApi({
        competitionState,
        page,
        limit: pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (artworkId) => deleteAdminArtworkApi(artworkId),
    onSuccess: () => {
      toast.success(
        t('adminGallery.deleteSuccess', 'Artwork deleted successfully.'),
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_ARTWORKS_QUERY_KEY });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('adminGallery.deleteError', 'Failed to delete artwork.'),
        ),
      );
    },
  });

  const handleDeleteArtwork = async (artworkId) => {
    const confirmed = await confirmDestructiveAction({
      title: t('adminGallery.confirmDelete.title', 'Delete Artwork?'),
      text: t(
        'adminGallery.confirmDelete.text',
        'Are you sure you want to delete this artwork? This action cannot be undone.',
      ),
      confirmButtonText: t('adminGallery.confirmDelete.confirm', 'Delete'),
      cancelButtonText: t('adminGallery.confirmDelete.cancel', 'Cancel'),
    });

    if (confirmed) {
      await deleteMutation.mutateAsync(artworkId);
    }
  };

  const cards = useMemo(() => apiResult?.data ?? [], [apiResult?.data]);
  const meta = apiResult?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const totalRecords = meta?.totalRecords ?? 0;

  const visibleCards = useMemo(
    () => filterGalleryCards(cards, activeFilter),
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
    handleDeleteArtwork,
    handleFilterClick,
    handlePageChange,
  };
}
