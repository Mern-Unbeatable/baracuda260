import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { toggleCompetitionFilter } from '@/portals/admin/data/adminCompetitionsData';
import {
  PREMIUM_PHOTOS_PAGE_SIZE,
  PREMIUM_PHOTOS_PAGE_SIZE_MOBILE,
} from '@/portals/admin/data/adminPremiumPhotosData';
import {
  ADMIN_PREMIUM_PHOTOS_QUERY_KEY,
  deleteAdminPremiumPhotoApi,
  getAdminPremiumPhotosApi,
} from '@/shared/api/premiumPhotos.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

const FILTER_TO_KIND = {
  single: 'SINGLE',
  six: 'SIX',
  zodiac: 'TWELVE',
};

const MOBILE_MQ = '(max-width: 639px)';

const readIsMobile = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(MOBILE_MQ).matches;
};

/**
 * Showcase filter + server pagination for Admin Premium Photos.
 * Matches competitions/gallery: mobile 10/page, sm+ 8/page, server-side kind.
 */
export default function useAdminPremiumPhotosShowcase() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(readIsMobile);

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

  const pageSize = isMobile
    ? PREMIUM_PHOTOS_PAGE_SIZE_MOBILE
    : PREMIUM_PHOTOS_PAGE_SIZE;
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
      ...ADMIN_PREMIUM_PHOTOS_QUERY_KEY,
      kind || 'ALL',
      page,
      pageSize,
    ],
    queryFn: () =>
      getAdminPremiumPhotosApi({
        kind,
        page,
        limit: pageSize,
      }),
    placeholderData: undefined,
    staleTime: 30 * 1000,
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
          t(
            'adminPremiumPhotos.deleteError',
            'Failed to delete premium photo.',
          ),
        ),
      );
    },
  });

  const handleDeletePhoto = async (photoId) => {
    const confirmed = await confirmDestructiveAction({
      title: t(
        'adminPremiumPhotos.confirmDelete.title',
        'Delete Premium Photo?',
      ),
      text: t(
        'adminPremiumPhotos.confirmDelete.text',
        'Are you sure you want to delete this premium photo? This action cannot be undone.',
      ),
      confirmButtonText: t(
        'adminPremiumPhotos.confirmDelete.confirm',
        'Delete',
      ),
      cancelButtonText: t('adminPremiumPhotos.confirmDelete.cancel', 'Cancel'),
    });

    if (confirmed) {
      await deleteMutation.mutateAsync(photoId);
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
    handleDeletePhoto,
    handleFilterClick,
    handlePageChange,
  };
}
