import { useState } from 'react';
import {
  ADMIN_ANNOUNCEMENT_ROWS,
  ANNOUNCEMENTS_PAGE_CHROME,
  ANNOUNCEMENTS_PAGE_SIZE,
  buildAnnouncementFromForm,
  getAnnouncementPageNumbers,
  paginateAnnouncements,
  updateAnnouncementStatus,
} from '@/portals/admin/data/adminAnnouncementsData';

export default function useAdminAnnouncements(
  initialRows = ADMIN_ANNOUNCEMENT_ROWS,
  pageSize = ANNOUNCEMENTS_PAGE_SIZE,
) {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const resultsTotal = rows.length;
  const computedPages = Math.max(1, Math.ceil(resultsTotal / pageSize));
  const totalPages = Math.max(ANNOUNCEMENTS_PAGE_CHROME, computedPages);
  const safePage = Math.min(page, totalPages);
  const visibleRows = paginateAnnouncements(rows, safePage, pageSize);
  const pageNumbers = getAnnouncementPageNumbers(safePage, totalPages);
  const resultsFrom = resultsTotal === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const resultsTo = Math.min(safePage * pageSize, resultsTotal);

  const handleToggleAction = (rowId) => {
    setOpenActionId((current) => (current === rowId ? null : rowId));
  };

  const handleCloseAction = () => setOpenActionId(null);

  const handleSelectAction = (rowId, actionId) => {
    if (actionId === 'edit' || actionId === 'delete') {
      setOpenActionId(null);
      return;
    }
    setRows((current) => updateAnnouncementStatus(current, rowId, actionId));
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

  const handleOpenCreateModal = () => {
    setOpenActionId(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleCreateAnnouncement = (values) => {
    setRows((current) => [buildAnnouncementFromForm(values, current), ...current]);
    setPage(1);
    setIsCreateModalOpen(false);
  };

  return {
    visibleRows,
    page: safePage,
    pageNumbers,
    resultsFrom,
    resultsTo,
    resultsTotal,
    resultsCount: visibleRows.length,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    openActionId,
    isCreateModalOpen,
    handleToggleAction,
    handleCloseAction,
    handleSelectAction,
    handlePreviousPage,
    handleNextPage,
    handleSelectPage,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCreateAnnouncement,
  };
}
