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
  getAdminArtworksApi,
  updateAdminArtworkStatusApi,
} from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

const FILTER_TO_KIND = {
  single: 'SINGLE',
  six: 'SIX',
  zodiac: 'TWELVE',
};

const SUBMISSIONS_QUERY_KEY = [...ADMIN_ARTWORKS_QUERY_KEY, 'pending-review'];

/**
 * Pending submission moderation queue.
 * GET /v1/admin/artworks?status=PENDING
 */
export default function useAdminSubmissionsReview({
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
    queryKey: [...SUBMISSIONS_QUERY_KEY, kind || 'ALL', page, pageSize],
    queryFn: () =>
      getAdminArtworksApi({
        status: 'PENDING',
        kind,
        page,
        limit: pageSize,
      }),
    placeholderData: undefined,
    staleTime: 15 * 1000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ artworkId, status }) =>
      updateAdminArtworkStatusApi(artworkId, status),
    onSuccess: (_data, variables) => {
      const approved = variables.status === 'APPROVED';
      toast.success(
        approved
          ? t('adminSubmissions.approveSuccess', 'Submission approved.')
          : t('adminSubmissions.rejectSuccess', 'Submission rejected.'),
      );
      queryClient.invalidateQueries({ queryKey: ADMIN_ARTWORKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('adminSubmissions.statusError', 'Failed to update submission.'),
        ),
      );
    },
  });

  const handleApprove = async (artworkId, title) => {
    const confirmed = await confirmDestructiveAction({
      title: t('adminSubmissions.confirmApprove.title', 'Approve submission?'),
      text: t('adminSubmissions.confirmApprove.text', {
        defaultValue: 'Publish "{{title}}" into the live competition.',
        title: title || 'this artwork',
      }),
      confirmButtonText: t('adminSubmissions.confirmApprove.confirm', 'Approve'),
      cancelButtonText: t('adminSubmissions.confirmApprove.cancel', 'Cancel'),
    });
    if (confirmed) {
      await statusMutation.mutateAsync({ artworkId, status: 'APPROVED' });
    }
  };

  const handleReject = async (artworkId, title) => {
    const confirmed = await confirmDestructiveAction({
      title: t('adminSubmissions.confirmReject.title', 'Reject submission?'),
      text: t('adminSubmissions.confirmReject.text', {
        defaultValue: 'Reject "{{title}}"? The photographer will need to resubmit.',
        title: title || 'this artwork',
      }),
      confirmButtonText: t('adminSubmissions.confirmReject.confirm', 'Reject'),
      cancelButtonText: t('adminSubmissions.confirmReject.cancel', 'Cancel'),
    });
    if (confirmed) {
      await statusMutation.mutateAsync({ artworkId, status: 'REJECTED' });
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
    isLoading,
    isError,
    error,
    isFetching,
    isUpdating: statusMutation.isPending,
    refetch,
    handleApprove,
    handleReject,
    handleFilterClick,
    handlePageChange,
  };
}
