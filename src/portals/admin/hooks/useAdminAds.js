import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ADS_PAGE_SIZE } from '@/portals/admin/data/adminAdsData';
import {
  ADMIN_ADVERTISEMENTS_QUERY_KEY,
  getAdminAdvertisementApi,
  getAdminAdvertisementsApi,
  updateAdvertisementStatusApi,
} from '@/shared/api/advertisements.api';
import { getApiErrorMessage } from '@/shared/api/client';

/**
 * Server-paginated ads list, details drawer, and status updates.
 */
export default function useAdminAds(pageSize = ADS_PAGE_SIZE) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  const listQuery = useQuery({
    queryKey: [...ADMIN_ADVERTISEMENTS_QUERY_KEY, 'list', page, pageSize],
    queryFn: () => getAdminAdvertisementsApi({ page, limit: pageSize }),
    placeholderData: keepPreviousData,
  });

  const detailsQuery = useQuery({
    queryKey: [...ADMIN_ADVERTISEMENTS_QUERY_KEY, 'detail', detailsId],
    queryFn: () => getAdminAdvertisementApi(detailsId),
    enabled: Boolean(detailsId),
  });

  const rows = listQuery.data?.items ?? [];
  const meta = listQuery.data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  useEffect(() => {
    if (meta && page > totalPages) setPage(totalPages);
  }, [meta, page, totalPages]);

  const statusMutation = useMutation({
    mutationFn: updateAdvertisementStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ADVERTISEMENTS_QUERY_KEY,
      });
      toast.success(t('adminAds.statusUpdateSuccess'));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t('adminAds.statusUpdateError')));
    },
  });

  const handleToggleAction = (rowId) => {
    setOpenActionId((current) => (current === rowId ? null : rowId));
  };

  const handleCloseAction = () => {
    setOpenActionId(null);
  };

  const handleRowStatusChange = (rowId, nextStatus) => {
    setOpenActionId(null);
    statusMutation.mutate({ id: rowId, status: nextStatus });
  };

  const handleOpenDetails = (rowId) => {
    setDetailsId(rowId);
    setOpenActionId(null);
  };

  const handleCloseDetails = () => {
    setDetailsId(null);
  };

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
    setOpenActionId(null);
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(from + rows.length - 1, total);

  return {
    rows,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    isFetching: listQuery.isFetching,
    loadErrorMessage: getApiErrorMessage(
      listQuery.error,
      t('adminAds.loadError'),
    ),
    refetch: listQuery.refetch,
    updatingId: statusMutation.isPending ? statusMutation.variables?.id : null,
    openActionId,
    isDetailsOpen: Boolean(detailsId),
    detailsAd: detailsQuery.data ?? null,
    isDetailsLoading: detailsQuery.isLoading,
    isDetailsError: detailsQuery.isError,
    detailsErrorMessage: getApiErrorMessage(
      detailsQuery.error,
      t('adminAds.drawer.loadError'),
    ),
    refetchDetails: detailsQuery.refetch,
    total,
    from,
    to,
    isFirstPage: page <= 1,
    isLastPage: page >= totalPages,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handleOpenDetails,
    handleCloseDetails,
    handlePreviousPage: () => goToPage(page - 1),
    handleNextPage: () => goToPage(page + 1),
  };
}
