import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  PROMO_LINK_DATE_RANGE,
  PROMO_LINKS_PAGE_SIZE,
} from '@/portals/admin/data/adminPromoLinksData';
import {
  ADMIN_CAMPAIGNS_QUERY_KEY,
  createCampaignLinkApi,
  getCampaignLinkDetailsApi,
  getCampaignLinksApi,
  getCampaignStatsApi,
  updateCampaignLinkRewardApi,
} from '@/shared/api/campaigns.api';
import { getApiErrorMessage } from '@/shared/api/client';

const INITIAL_FILTERS = {
  status: 'all',
  dateRange: 'all',
  requirements: 'all',
  reward: 'all',
};

export default function useAdminPromoLinks(pageSize = PROMO_LINKS_PAGE_SIZE) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [openFilter, setOpenFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [detailLinkId, setDetailLinkId] = useState(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);

  // 1. Remote Campaign Stats
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useQuery({
    queryKey: [...ADMIN_CAMPAIGNS_QUERY_KEY, 'stats'],
    queryFn: getCampaignStatsApi,
    staleTime: 30 * 1000,
  });

  const stats = useMemo(
    () => ({
      total: statsData?.total ?? 0,
      active: statsData?.active ?? 0,
      used: statsData?.used ?? 0,
      expired: statsData?.expired ?? 0,
      incomplete: statsData?.incomplete ?? 0,
    }),
    [statsData],
  );

  // 2. Remote Paginated Campaign Links
  const {
    data: linksData,
    isLoading: isLinksLoading,
    isFetching: isLinksFetching,
    isError: isLinksError,
    error: linksError,
    refetch,
  } = useQuery({
    queryKey: [
      ...ADMIN_CAMPAIGNS_QUERY_KEY,
      'list',
      filters.status,
      filters.dateRange,
      filters.requirements,
      filters.reward,
      page,
      pageSize,
    ],
    queryFn: () =>
      getCampaignLinksApi({
        status: filters.status === 'all' ? 'ALL' : filters.status,
        dateCreated: filters.dateRange === 'all' ? 'ALL' : filters.dateRange,
        requirements:
          filters.requirements === 'all' ? 'ALL' : filters.requirements,
        rewardStatus: filters.reward === 'all' ? 'ALL' : filters.reward,
        page,
        limit: pageSize,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  const visibleLinks = linksData?.items ?? [];
  const meta = linksData?.meta;
  const resultsTotal = meta?.total ?? visibleLinks.length;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const safePage = Math.min(page, totalPages);

  // 3. Remote Detail
  const { data: remoteDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: [...ADMIN_CAMPAIGNS_QUERY_KEY, 'detail', detailLinkId],
    queryFn: () => getCampaignLinkDetailsApi(detailLinkId),
    enabled: Boolean(detailLinkId),
    staleTime: 30 * 1000,
  });

  const selectedRow = useMemo(
    () => visibleLinks.find((l) => l.id === detailLinkId) || null,
    [visibleLinks, detailLinkId],
  );

  const detailLink = useMemo(() => {
    if (!detailLinkId) return null;
    if (remoteDetail) {
      const code = remoteDetail.token || selectedRow?.code || '';
      return {
        ...selectedRow,
        ...remoteDetail,
        id: remoteDetail.id || selectedRow?.id,
        linkId: remoteDetail.token || selectedRow?.linkId || code,
        code,
        promotionalUrl:
          selectedRow?.promotionalUrl ||
          `https://baracuda260.maktechgroup.tech/join/promo/${code}`,
        issuedAt:
          remoteDetail.createdAt ||
          selectedRow?.issuedAt ||
          remoteDetail.validUntil,
        status: remoteDetail.status || selectedRow?.status || 'ACTIVE',
        validity: selectedRow?.validity || '',
        checklist: selectedRow?.checklist || '------',
        reward: selectedRow?.reward || '------',
      };
    }
    return selectedRow;
  }, [detailLinkId, remoteDetail, selectedRow]);

  // 4. Create Mutation
  const createMutation = useMutation({
    mutationFn: createCampaignLinkApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGNS_QUERY_KEY });
      setGenerateOpen(false);

      const code = data?.token || (data?.promotionalUrl ? data.promotionalUrl.split('/').pop() : '') || 'PROMO';
      const newLinkObj = {
        id: data?.id || `pl-created-${Date.now()}`,
        code,
        linkId: code,
        promotionalUrl: data?.promotionalUrl || `https://baracuda260.maktechgroup.tech/join/promo/${code}`,
        status: data?.status || 'ACTIVE',
      };

      setCreatedLink(newLinkObj);
      setPage(1);
      toast.success(
        t('adminPromoLinks.generateSuccess', 'Promo link generated successfully.'),
      );
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('adminPromoLinks.generateError', 'Failed to generate promo link.'),
        ),
      );
    },
  });

  // 5. Update Reward Mutation
  const rewardMutation = useMutation({
    mutationFn: ({ id, status }) => updateCampaignLinkRewardApi({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CAMPAIGNS_QUERY_KEY });
      toast.success(
        t(
          'adminPromoLinks.rewardUpdateSuccess',
          'Reward status updated successfully.',
        ),
      );
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t(
            'adminPromoLinks.rewardUpdateError',
            'Failed to update reward status.',
          ),
        ),
      );
    },
  });

  const patchFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
    setOpenFilter(null);
    setOpenActionId(null);
  };

  const handleToggleFilter = (filterKey) => {
    setOpenFilter((current) => (current === filterKey ? null : filterKey));
    setOpenActionId(null);
  };

  const handleCloseFilter = () => setOpenFilter(null);

  const handleToggleAction = (linkId) => {
    setOpenActionId((current) => (current === linkId ? null : linkId));
    setOpenFilter(null);
  };

  const handleCloseAction = () => setOpenActionId(null);

  const handleOpenDetails = (linkId) => {
    setDetailLinkId(linkId);
    setOpenActionId(null);
  };

  const handleCloseDetails = () => setDetailLinkId(null);

  const handleSetReward = (linkId, nextReward) => {
    setOpenActionId(null);
    rewardMutation.mutate({ id: linkId, status: nextReward });
  };

  const handleOpenGenerate = () => {
    setGenerateOpen(true);
    setOpenActionId(null);
    setOpenFilter(null);
  };

  const handleCloseGenerate = () => setGenerateOpen(false);

  const handleConfirmGenerate = () => {
    createMutation.mutate();
  };

  const handleCloseCreated = () => setCreatedLink(null);

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
    setOpenActionId(null);
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
    setOpenActionId(null);
  };

  const resultsFrom =
    resultsTotal === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const resultsTo = Math.min(safePage * pageSize, resultsTotal);

  return {
    stats,
    isStatsLoading,
    filters,
    openFilter,
    openActionId,
    detailLink,
    isDetailLoading,
    generateOpen,
    isGenerating: createMutation.isPending,
    createdLink,
    visibleLinks,
    isLoading: isLinksLoading,
    isFetching: isLinksFetching,
    isError: isLinksError,
    errorMessage: getApiErrorMessage(
      linksError,
      t('adminPromoLinks.loadError', 'Failed to load promo links.'),
    ),
    refetch,
    page: safePage,
    totalPages,
    resultsFrom,
    resultsTo,
    resultsTotal,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    patchFilter,
    handleToggleFilter,
    handleCloseFilter,
    handleToggleAction,
    handleCloseAction,
    handleOpenDetails,
    handleCloseDetails,
    handleSetReward,
    handleOpenGenerate,
    handleCloseGenerate,
    handleConfirmGenerate,
    handleCloseCreated,
    handlePreviousPage,
    handleNextPage,
  };
}
