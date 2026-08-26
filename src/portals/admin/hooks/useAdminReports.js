import { useState } from 'react';
import {
  ADMIN_REPORTS_ROWS,
  REPORTS_PAGE_SIZE,
  computeReportStats,
  filterReportsByStatus,
  paginateReports,
  updateReportStatus,
} from '@/portals/admin/data/adminReportsData';

export default function useAdminReports(
  initialRows = ADMIN_REPORTS_ROWS,
  pageSize = REPORTS_PAGE_SIZE,
) {
  const [rows, setRows] = useState(initialRows);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);

  const filteredRows = filterReportsByStatus(rows, statusFilter);
  const resultsTotal = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(resultsTotal / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleRows = paginateReports(filteredRows, safePage, pageSize);
  const stats = computeReportStats(rows);
  const from = resultsTotal === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = resultsTotal === 0 ? 0 : Math.min(safePage * pageSize, resultsTotal);

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

  const handleRowStatusChange = (rowId, nextStatus) => {
    setRows((current) => updateReportStatus(current, rowId, nextStatus));
    setOpenActionId(null);
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
    stats,
    visibleRows,
    from,
    to,
    resultsTotal,
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
