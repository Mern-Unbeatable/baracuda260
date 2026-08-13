import { useState } from 'react';
import {
  DEMO_PROFILES,
  DEMO_PROFILES_PAGE_SIZE,
  computeDemoProfileStats,
  filterDemoProfilesByStatus,
  getDemoProfileById,
  getDemoProfilesStore,
  paginateDemoProfiles,
  setDemoProfilesStore,
  updateDemoProfileStatus,
} from '@/portals/admin/data/adminDemoProfilesData';

export default function useAdminDemoProfiles(
  initialProfiles = getDemoProfilesStore(),
  pageSize = DEMO_PROFILES_PAGE_SIZE,
) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  const [detailProfileId, setDetailProfileId] = useState(null);

  const filteredProfiles = filterDemoProfilesByStatus(profiles, statusFilter);
  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleProfiles = paginateDemoProfiles(filteredProfiles, safePage, pageSize);
  const detailProfile = getDemoProfileById(profiles, detailProfileId);

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

  const handleCloseSort = () => setSortOpen(false);

  const handleToggleAction = (profileId) => {
    setOpenActionId((current) => (current === profileId ? null : profileId));
    setSortOpen(false);
  };

  const handleCloseAction = () => setOpenActionId(null);

  const handleOpenDetails = (profileId) => {
    setDetailProfileId(profileId);
    setOpenActionId(null);
  };

  const handleCloseDetails = () => setDetailProfileId(null);

  const handleSetStatus = (profileId, nextStatus) => {
    setProfiles((current) => {
      const next = updateDemoProfileStatus(current, profileId, nextStatus);
      setDemoProfilesStore(next);
      return next;
    });
    setOpenActionId(null);
  };

  const handleDeactivateProfile = () => {
    if (!detailProfileId) return;
    setProfiles((current) => {
      const next = updateDemoProfileStatus(current, detailProfileId, 'inactive');
      setDemoProfilesStore(next);
      return next;
    });
    setDetailProfileId(null);
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
    setOpenActionId(null);
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
    setOpenActionId(null);
  };

  const resultsFrom = filteredProfiles.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const resultsTo = Math.min(safePage * pageSize, filteredProfiles.length);
  const stats = computeDemoProfileStats(profiles);

  return {
    profiles,
    stats,
    statusFilter,
    sortOpen,
    openActionId,
    detailProfile,
    visibleProfiles,
    page: safePage,
    totalPages,
    resultsFrom,
    resultsTo,
    resultsTotal: filteredProfiles.length,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    handleStatusFilterChange,
    handleToggleSort,
    handleCloseSort,
    handleToggleAction,
    handleCloseAction,
    handleOpenDetails,
    handleCloseDetails,
    handleSetStatus,
    handleDeactivateProfile,
    handlePreviousPage,
    handleNextPage,
  };
}
