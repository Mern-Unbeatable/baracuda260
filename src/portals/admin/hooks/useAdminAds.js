import { useState } from 'react';
import {
  ADMIN_ADS_ROWS,
  ADS_PAGE_SIZE,
  ADS_STATUS,
  getAdsTotal,
  paginateAds,
  updateAdStatus,
} from '@/portals/admin/data/adminAdsData';

/**
 * Row actions, drawer, and pagination for Admin Ads Management.
 */
export default function useAdminAds(initialRows = ADMIN_ADS_ROWS, pageSize = ADS_PAGE_SIZE) {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  const activeRows = rows.filter((row) => row.status !== ADS_STATUS.REJECTED);
  const resultsTotal = getAdsTotal(rows);
  const totalPages = Math.max(1, Math.ceil(resultsTotal / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleRows = paginateAds(activeRows, safePage, pageSize);
  const detailsRow = detailsId ? rows.find((row) => row.id === detailsId) || null : null;

  const handleToggleAction = (rowId) => {
    setOpenActionId((current) => (current === rowId ? null : rowId));
  };

  const handleCloseAction = () => {
    setOpenActionId(null);
  };

  const handleRowStatusChange = (rowId, nextStatus) => {
    setRows((current) => updateAdStatus(current, rowId, nextStatus));
    setOpenActionId(null);
    if (detailsId === rowId && nextStatus === ADS_STATUS.REJECTED) {
      setDetailsId(null);
    }
  };

  const handleOpenDetails = (rowId) => {
    setDetailsId(rowId);
    setOpenActionId(null);
  };

  const handleCloseDetails = () => {
    setDetailsId(null);
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
    setOpenActionId(null);
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
    setOpenActionId(null);
  };

  const from = resultsTotal === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = resultsTotal === 0 ? 0 : Math.min(safePage * pageSize, resultsTotal);

  return {
    openActionId,
    detailsRow,
    visibleRows,
    page: safePage,
    resultsCount: visibleRows.length,
    resultsTotal,
    from,
    to,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handleOpenDetails,
    handleCloseDetails,
    handlePreviousPage,
    handleNextPage,
  };
}
