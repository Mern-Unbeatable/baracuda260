import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  computeDemoProfileStats,
  DEMO_PROFILES_PAGE_SIZE,
  filterDemoProfilesByStatus,
  getDemoProfileById,
  getDemoProfilesStore,
  paginateDemoProfiles,
  setDemoProfilesStore,
  updateDemoProfileStatus,
} from '@/portals/admin/data/adminDemoProfilesData';
import {
  DEMO_PROFILES_QUERY_KEY,
  DEMO_PROFILES_STATS_QUERY_KEY,
  getDemoProfileDetailsApi,
  getDemoProfilesApi,
  getDemoProfilesStatsApi,
  updateDemoProfileStatusApi,
} from '@/shared/api/demoProfiles.api';

export default function useAdminDemoProfiles(
  initialProfiles = getDemoProfilesStore(),
  pageSize = DEMO_PROFILES_PAGE_SIZE,
) {
  const queryClient = useQueryClient();
  const [profiles, setProfiles] = useState(initialProfiles);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  const [detailProfileId, setDetailProfileId] = useState(null);

  // 1. Fetch remote stats from GET /api/v1/admin/demo-profiles/stats
  const { data: remoteStats } = useQuery({
    queryKey: DEMO_PROFILES_STATS_QUERY_KEY,
    queryFn: getDemoProfilesStatsApi,
    staleTime: 60 * 1000,
    retry: 1,
  });

  // 2. Fetch paginated demo profiles from GET /api/v1/admin/demo-profiles?isActive=...&page=...&limit=...
  const isActiveParam =
    statusFilter === 'active'
      ? true
      : statusFilter === 'inactive'
        ? false
        : undefined;

  const {
    data: remoteProfilesData,
    isLoading: isListLoading,
  } = useQuery({
    queryKey: [...DEMO_PROFILES_QUERY_KEY, page, pageSize, statusFilter],
    queryFn: () =>
      getDemoProfilesApi({
        page,
        limit: pageSize,
        isActive: isActiveParam,
      }),
    staleTime: 30 * 1000,
    retry: 1,
  });

  // 3. Fetch single profile details from GET /api/v1/admin/demo-profiles/:profile_id
  const { data: remoteDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: [...DEMO_PROFILES_QUERY_KEY, 'detail', detailProfileId],
    queryFn: () => getDemoProfileDetailsApi(detailProfileId),
    enabled: Boolean(detailProfileId),
    staleTime: 60 * 1000,
    retry: 1,
  });

  // Fallback calculation for local mock data if API is loading or not present
  const localFilteredProfiles = filterDemoProfilesByStatus(profiles, statusFilter);
  const localTotalPages = Math.max(1, Math.ceil(localFilteredProfiles.length / pageSize));
  const safePage = Math.min(page, remoteProfilesData?.meta?.totalPages || localTotalPages);

  const visibleProfiles =
    remoteProfilesData?.items ??
    paginateDemoProfiles(localFilteredProfiles, safePage, pageSize);

  const resultsTotal =
    remoteProfilesData?.meta?.totalRecords ?? localFilteredProfiles.length;
  const totalPages =
    remoteProfilesData?.meta?.totalPages ?? localTotalPages;

  const resultsFrom =
    resultsTotal === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const resultsTo = Math.min(safePage * pageSize, resultsTotal);

  const stats = remoteStats ?? computeDemoProfileStats(profiles);

  const localDetail = getDemoProfileById(profiles, detailProfileId);
  const detailProfile = remoteDetail || localDetail;

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

  const handleSetStatus = async (profileId, nextStatus) => {
    try {
      await updateDemoProfileStatusApi(profileId, nextStatus);
      queryClient.invalidateQueries({ queryKey: DEMO_PROFILES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DEMO_PROFILES_STATS_QUERY_KEY });
    } catch {
      // Gracefully fall back to local store
    }
    setProfiles((current) => {
      const next = updateDemoProfileStatus(current, profileId, nextStatus);
      setDemoProfilesStore(next);
      return next;
    });
    setOpenActionId(null);
  };

  const handleDeactivateProfile = async () => {
    if (!detailProfileId) return;
    try {
      await updateDemoProfileStatusApi(detailProfileId, 'inactive');
      queryClient.invalidateQueries({ queryKey: DEMO_PROFILES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DEMO_PROFILES_STATS_QUERY_KEY });
    } catch {
      // Gracefully fall back to local store
    }
    setProfiles((current) => {
      const next = updateDemoProfileStatus(
        current,
        detailProfileId,
        'inactive',
      );
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

  return {
    profiles,
    stats,
    statusFilter,
    sortOpen,
    openActionId,
    detailProfile,
    visibleProfiles,
    isLoading: isListLoading,
    isDetailLoading,
    page: safePage,
    totalPages,
    resultsFrom,
    resultsTo,
    resultsTotal,
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
