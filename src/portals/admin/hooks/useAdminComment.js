import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_COMMENT_ROWS,
  COMMENTS_PAGE_SIZE,
  filterCommentsByStatus,
  getCommentPageNumbers,
} from '@/portals/admin/data/adminCommentData';
import {
  ADMIN_COMMENTS_QUERY_KEY,
  getAdminCommentDetailsApi,
  getAdminCommentsApi,
  updateAdminCommentsBulkStatusApi,
} from '@/shared/api/comments.api';
import { getApiErrorMessage } from '@/shared/api/client';

/**
 * Server-backed state for Admin Comments: filters, queries, bulk actions, drawer, pagination.
 */
export default function useAdminComment(
  initialRows = ADMIN_COMMENT_ROWS,
  pageSize = COMMENTS_PAGE_SIZE,
) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [detailsId, setDetailsId] = useState(null);

  // 1. Fetch comments list
  const commentsQuery = useQuery({
    queryKey: [...ADMIN_COMMENTS_QUERY_KEY, statusFilter, page, pageSize],
    queryFn: () =>
      getAdminCommentsApi({
        status: statusFilter,
        page,
        limit: pageSize,
      }),
    staleTime: 30 * 1000,
  });

  // 2. Fetch single comment detail when drawer is open
  const detailQuery = useQuery({
    queryKey: [...ADMIN_COMMENTS_QUERY_KEY, 'detail', detailsId],
    queryFn: () => getAdminCommentDetailsApi(detailsId),
    enabled: Boolean(detailsId),
    staleTime: 30 * 1000,
  });

  // Fallback demo rows when query is in error or first loading without data
  const fallbackFiltered = useMemo(
    () => filterCommentsByStatus(initialRows, statusFilter),
    [initialRows, statusFilter],
  );

  const visibleRows =
    commentsQuery.data?.items !== undefined
      ? commentsQuery.data.items
      : commentsQuery.isLoading
        ? []
        : fallbackFiltered;

  const resultsTotal =
    commentsQuery.data?.meta?.totalRecords ??
    (commentsQuery.data?.items?.length || fallbackFiltered.length);

  const totalPages = Math.max(
    1,
    commentsQuery.data?.meta?.totalPages ??
      Math.ceil(resultsTotal / pageSize) ??
      1,
  );

  const safePage = Math.min(page, totalPages);
  const pageNumbers = getCommentPageNumbers(safePage, totalPages);

  const detailsRow =
    detailQuery.data ||
    visibleRows.find((row) => row.id === detailsId || row.code === detailsId) ||
    initialRows.find(
      (row) => row.id === detailsId || row.code === detailsId,
    ) ||
    null;

  // 3. Status update mutation (single or bulk)
  const updateStatusMutation = useMutation({
    mutationFn: ({ commentIds, status }) =>
      updateAdminCommentsBulkStatusApi({ commentIds, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_COMMENTS_QUERY_KEY,
      });
      setOpenActionId(null);
      toast.success(
        t('adminComment.statusUpdated', 'Comment status updated successfully!'),
      );
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('adminComment.statusUpdateFailed', 'Failed to update status.'),
        ),
      );
    },
  });

  const handleStatusFilterChange = (nextFilter) => {
    setStatusFilter(nextFilter || 'all');
    setPage(1);
    setOpenActionId(null);
    setSelectedIds(new Set());
  };

  const handleToggleAction = (rowId) => {
    setOpenActionId((current) => (current === rowId ? null : rowId));
  };

  const handleCloseAction = () => {
    setOpenActionId(null);
  };

  const handleRowStatusChange = async (rowId, nextStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        commentIds: [rowId],
        status: nextStatus,
      });
    } catch {
      // Handled in onError
    }
  };

  const handleBulkStatusChange = async (nextStatus) => {
    if (selectedIds.size === 0) return;
    try {
      await updateStatusMutation.mutateAsync({
        commentIds: Array.from(selectedIds),
        status: nextStatus,
      });
      setSelectedIds(new Set());
    } catch {
      // Handled in onError
    }
  };

  const handleOpenDetails = (rowId) => {
    setDetailsId(rowId);
    setOpenActionId(null);
  };

  const handleCloseDetails = () => {
    setDetailsId(null);
  };

  const handleToggleRowSelected = (rowId) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const handleToggleSelectAllVisible = () => {
    const visibleIds = visibleRows.map((row) => row.id);
    const allSelected =
      visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

    setSelectedIds((current) => {
      const next = new Set(current);
      if (allSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
    setOpenActionId(null);
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
    setOpenActionId(null);
  };

  const handleSelectPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
    setOpenActionId(null);
  };

  const visibleIds = visibleRows.map((row) => row.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  return {
    statusFilter,
    openActionId,
    selectedIds,
    detailsRow,
    visibleRows,
    page: safePage,
    totalPages,
    pageNumbers,
    resultsCount: visibleRows.length,
    resultsTotal,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    allVisibleSelected,
    isLoading: commentsQuery.isLoading,
    isFetching: commentsQuery.isFetching,
    isDetailLoading: detailQuery.isLoading,
    isUpdating: updateStatusMutation.isPending,
    handleStatusFilterChange,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handleBulkStatusChange,
    handleOpenDetails,
    handleCloseDetails,
    handleToggleRowSelected,
    handleToggleSelectAllVisible,
    handlePreviousPage,
    handleNextPage,
    handleSelectPage,
    refetchComments: commentsQuery.refetch,
  };
}
