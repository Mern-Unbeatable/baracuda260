import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  REPORTS_PAGE_SIZE,
} from '@/portals/admin/data/adminReportsData';
import {
  getAdminReportsApi,
  getAdminReportsStatsApi,
  REPORTS_QUERY_KEY,
  REPORTS_STATS_QUERY_KEY,
  toBackendReportStatus,
  updateAdminReportStatusApi,
} from '@/shared/api/reports.api';

export default function useAdminReports(
  _initialRows = [],
  pageSize = REPORTS_PAGE_SIZE,
) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [updatingRowId, setUpdatingRowId] = useState(null);

  // 1. Fetch remote stats from GET /api/v1/admin/reports/stats
  const { data: remoteStats, isLoading: isStatsLoading } = useQuery({
    queryKey: REPORTS_STATS_QUERY_KEY,
    queryFn: getAdminReportsStatsApi,
    staleTime: 30 * 1000,
    retry: 1,
  });

  // 2. Fetch paginated reports from GET /api/v1/admin/reports?status=...&page=...&limit=...
  const statusParam =
    statusFilter === 'all' ? undefined : toBackendReportStatus(statusFilter);

  const {
    data: remoteData,
    isLoading: isListLoading,
  } = useQuery({
    queryKey: [...REPORTS_QUERY_KEY, page, pageSize, statusParam],
    queryFn: () =>
      getAdminReportsApi({
        page,
        limit: pageSize,
        status: statusParam,
      }),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const visibleRows = remoteData?.data ?? [];
  const resultsTotal = remoteData?.meta?.totalRecords ?? visibleRows.length;
  const totalPages =
    remoteData?.meta?.totalPages ??
    Math.max(1, Math.ceil(resultsTotal / pageSize));
  const safePage = Math.min(page, Math.max(1, totalPages));

  const stats = remoteStats ?? {
    total: 0,
    pending: 0,
    underReview: 0,
    resolved: 0,
  };

  const from = resultsTotal === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to =
    resultsTotal === 0 ? 0 : Math.min(safePage * pageSize, resultsTotal);

  const handleStatusFilterChange = (nextFilter) => {
    setStatusFilter(nextFilter || 'all');
    setPage(1);
    setOpenActionId(null);
    setSortOpen(false);
  };

  const handleToggleSort = () => setSortOpen((current) => !current);
  const handleCloseSort = () => setSortOpen(false);

  const handleToggleAction = (rowId) => {
    setOpenActionId((current) => (current === rowId ? null : rowId));
  };

  const handleCloseAction = () => setOpenActionId(null);

  const handleRowStatusChange = async (rowId, nextStatus) => {
    setUpdatingRowId(rowId);
    try {
      await updateAdminReportStatusApi(rowId, nextStatus);
      toast.success('Report status updated successfully');
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: REPORTS_STATS_QUERY_KEY });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: REPORTS_STATS_QUERY_KEY });
      }, 500);
    } catch (err) {
      console.error('Failed to update report status:', err);
      toast.error('Failed to update report status');
    } finally {
      setUpdatingRowId(null);
      setOpenActionId(null);
    }
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
    setOpenActionId(null);
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
    setOpenActionId(null);
  };

  return {
    statusFilter,
    sortOpen,
    openActionId,
    updatingRowId,
    stats,
    visibleRows,
    from,
    to,
    resultsTotal,
    isLoading: isListLoading,
    isStatsLoading,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    handleStatusFilterChange,
    handleToggleSort,
    handleCloseSort,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handlePreviousPage,
    handleNextPage,
  };
}
