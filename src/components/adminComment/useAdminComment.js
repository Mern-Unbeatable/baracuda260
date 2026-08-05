import { useState } from 'react';
import {
  ADMIN_COMMENT_ROWS,
  COMMENTS_PAGE_CHROME,
  COMMENTS_PAGE_SIZE,
  filterCommentsByStatus,
  getCommentPageNumbers,
  paginateComments,
  updateCommentStatus,
} from './adminCommentData';

/**
 * Filters, selection, row actions, drawer, and pagination for Admin Comments.
 */
export default function useAdminComment(
  initialRows = ADMIN_COMMENT_ROWS,
  pageSize = COMMENTS_PAGE_SIZE,
) {
  const [rows, setRows] = useState(initialRows);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [detailsId, setDetailsId] = useState(null);

  const filteredRows = filterCommentsByStatus(rows, statusFilter);
  const resultsTotal = filteredRows.length;
  const computedPages = Math.max(1, Math.ceil(resultsTotal / pageSize));
  const totalPages =
    statusFilter === 'all' ? Math.max(COMMENTS_PAGE_CHROME, computedPages) : computedPages;
  const safePage = Math.min(page, totalPages);
  const visibleRows = paginateComments(filteredRows, safePage, pageSize);
  const pageNumbers = getCommentPageNumbers(safePage, totalPages);
  const detailsRow = detailsId ? rows.find((row) => row.id === detailsId) || null : null;

  const handleStatusFilterChange = (nextFilter) => {
    setStatusFilter(nextFilter || 'all');
    setPage(1);
    setOpenActionId(null);
  };

  const handleToggleAction = (rowId) => {
    setOpenActionId((current) => (current === rowId ? null : rowId));
  };

  const handleCloseAction = () => {
    setOpenActionId(null);
  };

  const handleRowStatusChange = (rowId, nextStatus) => {
    setRows((current) => updateCommentStatus(current, rowId, nextStatus));
    setOpenActionId(null);
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
    allVisibleSelected:
      visibleRows.length > 0 && visibleRows.every((row) => selectedIds.has(row.id)),
    handleStatusFilterChange,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handleOpenDetails,
    handleCloseDetails,
    handleToggleRowSelected,
    handleToggleSelectAllVisible,
    handlePreviousPage,
    handleNextPage,
    handleSelectPage,
  };
}
