import { useState } from 'react';
import {
  ADMIN_PAYOUT_ROWS,
  PAYOUTS_PAGE_SIZE,
  PAYOUTS_TOTAL_RESULTS,
  filterPayoutsByStatus,
  getPayoutPageNumbers,
  paginatePayouts,
} from './adminPayoutsData';

/**
 * Status filter + pagination for Admin Payouts.
 */
export default function useAdminPayouts(
  initialRows = ADMIN_PAYOUT_ROWS,
  pageSize = PAYOUTS_PAGE_SIZE,
) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);

  const filteredRows = filterPayoutsByStatus(initialRows, statusFilter);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleRows = paginatePayouts(filteredRows, safePage, pageSize);
  const pageNumbers = getPayoutPageNumbers(safePage, totalPages);
  const resultsTotal =
    statusFilter === 'all' ? PAYOUTS_TOTAL_RESULTS : filteredRows.length;

  const handleStatusFilterChange = (nextFilter) => {
    setStatusFilter(nextFilter || 'all');
    setPage(1);
    setSortOpen(false);
  };

  const handleToggleSort = () => {
    setSortOpen((open) => !open);
  };

  const handleCloseSort = () => {
    setSortOpen(false);
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
  };

  const handleSelectPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  return {
    statusFilter,
    sortOpen,
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
    handlePreviousPage,
    handleNextPage,
    handleSelectPage,
  };
}
