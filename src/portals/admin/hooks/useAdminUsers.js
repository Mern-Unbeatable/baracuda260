import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_STATUS_FILTER,
  USER_STATUS,
  USERS_PAGE_SIZE,
} from '@/portals/admin/data/adminUsersData';
import {
  ADMIN_USERS_QUERY_KEY,
  getAdminUserApi,
  getAdminUsersApi,
  updateAdminUserStatusApi,
} from '@/shared/api/adminUsers.api';
import { getApiErrorMessage } from '@/shared/api/client';

/**
 * Server-paginated users list with status filter, details, and suspend/activate.
 */
export default function useAdminUsers(pageSize = USERS_PAGE_SIZE) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  const listQuery = useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, 'list', statusFilter, page, pageSize],
    queryFn: () =>
      getAdminUsersApi({ page, limit: pageSize, status: statusFilter }),
    placeholderData: keepPreviousData,
  });

  const detailsQuery = useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, 'detail', detailsId],
    queryFn: () => getAdminUserApi(detailsId),
    enabled: Boolean(detailsId),
  });

  const users = listQuery.data?.items ?? [];
  const meta = listQuery.data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  useEffect(() => {
    if (meta && page > totalPages) setPage(totalPages);
  }, [meta, page, totalPages]);

  const statusMutation = useMutation({
    mutationFn: updateAdminUserStatusApi,
    onSuccess: (_response, { status }) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      toast.success(
        status === USER_STATUS.SUSPENDED
          ? t('adminUsers.statusUpdate.suspended')
          : t('adminUsers.statusUpdate.activated'),
      );
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t('adminUsers.statusUpdate.error')),
      );
    },
  });

  const handleStatusFilterChange = (nextFilter) => {
    setStatusFilter(nextFilter || DEFAULT_STATUS_FILTER);
    setPage(1);
    setSortOpen(false);
  };

  const handleToggleActionMenu = (menuKey) => {
    setOpenActionMenuId((current) => (current === menuKey ? null : menuKey));
  };

  const handleCloseActionMenu = () => {
    setOpenActionMenuId(null);
  };

  const handleActivateUser = (userId) => {
    setOpenActionMenuId(null);
    const target = users.find((user) => user.id === userId);
    if (!target || target.status === USER_STATUS.ACTIVE) return;
    statusMutation.mutate({ id: userId, status: USER_STATUS.ACTIVE });
  };

  const handleRequestSuspend = (userId) => {
    setOpenActionMenuId(null);
    const target = users.find((user) => user.id === userId);
    if (!target || target.status === USER_STATUS.SUSPENDED) return;
    setSuspendTarget(target);
  };

  const handleCloseSuspendModal = () => {
    if (statusMutation.isPending) return;
    setSuspendTarget(null);
  };

  const handleConfirmSuspend = (reason) => {
    if (!suspendTarget || !reason) return;
    statusMutation.mutate(
      { id: suspendTarget.id, status: USER_STATUS.SUSPENDED, reason },
      { onSuccess: () => setSuspendTarget(null) },
    );
  };

  const handleOpenDetails = (userId) => {
    setOpenActionMenuId(null);
    setDetailsId(userId);
  };

  const handleCloseDetails = () => {
    setDetailsId(null);
  };

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
    setOpenActionMenuId(null);
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(from + users.length - 1, total);

  return {
    statusFilter,
    sortOpen,
    users,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    isFetching: listQuery.isFetching,
    loadErrorMessage: getApiErrorMessage(
      listQuery.error,
      t('adminUsers.loadError'),
    ),
    refetch: listQuery.refetch,
    range: { from, to, total },
    isFirstPage: page <= 1,
    isLastPage: page >= totalPages,
    updatingId: statusMutation.isPending ? statusMutation.variables?.id : null,
    isSuspending:
      statusMutation.isPending &&
      statusMutation.variables?.status === USER_STATUS.SUSPENDED,
    suspendTarget,
    isSuspendModalOpen: Boolean(suspendTarget),
    openActionMenuId,
    isDetailsOpen: Boolean(detailsId),
    detailsUser: detailsQuery.data ?? null,
    isDetailsLoading: detailsQuery.isLoading,
    isDetailsError: detailsQuery.isError,
    detailsErrorMessage: getApiErrorMessage(
      detailsQuery.error,
      t('adminUsers.detailsModal.loadError'),
    ),
    refetchDetails: detailsQuery.refetch,
    handleStatusFilterChange,
    handleToggleSort: () => setSortOpen((open) => !open),
    handleCloseSort: () => setSortOpen(false),
    handlePreviousPage: () => goToPage(page - 1),
    handleNextPage: () => goToPage(page + 1),
    handleToggleActionMenu,
    handleCloseActionMenu,
    handleActivateUser,
    handleRequestSuspend,
    handleCloseSuspendModal,
    handleConfirmSuspend,
    handleOpenDetails,
    handleCloseDetails,
  };
}
