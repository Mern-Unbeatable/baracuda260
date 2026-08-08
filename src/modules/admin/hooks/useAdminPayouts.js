import { useState } from 'react';
import {
  ADMIN_PAYOUT_ROWS,
  PAYOUTS_PAGE_SIZE,
  PAYOUTS_TOTAL_RESULTS,
  filterPayoutsByStatus,
  getPayoutPageNumbers,
  paginatePayouts,
  updatePayoutStatus,
} from '@/modules/admin/data/adminPayoutsData';

/**
 * Status filter, row actions, and pagination for Admin Payouts.
 */
export default function useAdminPayouts(
  initialRows = ADMIN_PAYOUT_ROWS,
  pageSize = PAYOUTS_PAGE_SIZE,
) {
  const [rows, setRows] = useState(initialRows);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);

  const filteredRows = filterPayoutsByStatus(rows, statusFilter);
  const resultsTotal =
    statusFilter === 'all' ? PAYOUTS_TOTAL_RESULTS : filteredRows.length;
  // Page chrome follows Figma total (2,480) so ← 1 2 3 → always appear for "all".
  const totalPages = Math.max(1, Math.ceil(resultsTotal / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleRows = paginatePayouts(filteredRows, safePage, pageSize);
  const pageNumbers = getPayoutPageNumbers(safePage, totalPages);

  const handleStatusFilterChange = (nextFilter) => {
    setStatusFilter(nextFilter || 'all');
    setPage(1);
    setSortOpen(false);
    setOpenActionId(null);
  };

  const handleToggleSort = () => {
    setSortOpen((open) => !open);
    setOpenActionId(null);
  };

  const handleCloseSort = () => {
    setSortOpen(false);
  };

  const handleToggleAction = (rowId) => {
    setOpenActionId((current) => (current === rowId ? null : rowId));
    setSortOpen(false);
  };

  const handleCloseAction = () => {
    setOpenActionId(null);
  };

  const handleRowStatusChange = (rowId, nextStatus) => {
    setRows((current) => updatePayoutStatus(current, rowId, nextStatus));
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

  const handleSelectPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
    setOpenActionId(null);
  };

  return {
    statusFilter,
    sortOpen,
    openActionId,
    visibleRows,
    page: safePage,
    totalPages,
    pageNumbers,
    resultsCount: visibleRows.length,
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
    handleSelectPage,
  };
}
