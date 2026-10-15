import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  PAYOUT_SECTIONS,
  PAYOUTS_PAGE_SIZE,
} from '@/portals/admin/data/adminPayoutsData';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  ADMIN_PAYOUTS_QUERY_KEY,
  getAdminPayoutsApi,
  updateAdminPayoutStatusApi,
} from '@/shared/api/payouts.api';

export default function useAdminPayouts(
  sections = PAYOUT_SECTIONS,
  pageSize = PAYOUTS_PAGE_SIZE,
) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(sections[0]?.id || 'prize');
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);

  const { data: remoteData, isLoading } = useQuery({
    queryKey: [...ADMIN_PAYOUTS_QUERY_KEY, activeTab, page, pageSize],
    queryFn: () => getAdminPayoutsApi({ tab: activeTab, page, limit: pageSize }),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const activeSectionMeta = useMemo(
    () => sections.find((section) => section.id === activeTab) || sections[0],
    [activeTab, sections],
  );

  const rows = remoteData?.rows ?? [];
  const meta = remoteData?.meta;
  const totalRecords = meta?.totalRecords ?? rows.length;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil(totalRecords / pageSize));
  const safePage = Math.min(page, totalPages);

  const resultsFrom = totalRecords === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const resultsTo = Math.min(safePage * pageSize, totalRecords);

  const activeSection = useMemo(() => ({
    ...activeSectionMeta,
    rows,
  }), [activeSectionMeta, rows]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateAdminPayoutStatusApi(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ADMIN_PAYOUTS_QUERY_KEY });

      const normalized = String(status || '').toLowerCase();
      const rawStatus = String(status || '').toUpperCase();

      // Snapshot all current queries for rollback
      const previousQueries = queryClient.getQueriesData({
        queryKey: ADMIN_PAYOUTS_QUERY_KEY,
      });

      // Optimistically update all matching TanStack query cache entries
      queryClient.setQueriesData({ queryKey: ADMIN_PAYOUTS_QUERY_KEY }, (old) => {
        if (!old?.rows) return old;
        return {
          ...old,
          rows: old.rows.map((row) =>
            row.id === id ? { ...row, status: normalized, rawStatus } : row,
          ),
        };
      });

      return { previousQueries, id, normalized, rawStatus };
    },
    onSuccess: (_, { id, status }) => {
      toast.success(t('adminPayouts.statusUpdateSuccess', 'Payout status updated successfully'));

      const normalized = String(status || '').toLowerCase();
      const rawStatus = String(status || '').toUpperCase();

      // Reinforce the cache with the new status
      queryClient.setQueriesData({ queryKey: ADMIN_PAYOUTS_QUERY_KEY }, (old) => {
        if (!old?.rows) return old;
        return {
          ...old,
          rows: old.rows.map((row) =>
            row.id === id ? { ...row, status: normalized, rawStatus } : row,
          ),
        };
      });

      // Sync with server after brief delay to avoid database write race conditions
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ADMIN_PAYOUTS_QUERY_KEY,
          refetchType: 'active',
        });
      }, 500);
    },
    onError: (error, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error(
        getApiErrorMessage(
          error,
          t('adminPayouts.statusUpdateError', 'Failed to update payout status'),
        ),
      );
    },
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
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
    setOpenActionId(null);
    const targetRow = rows.find((r) => r.id === rowId);
    const currentStatus = String(targetRow?.status || '').toLowerCase();
    const targetStatus = String(nextStatus || '').toLowerCase();

    if (currentStatus === targetStatus) {
      return;
    }

    if (currentStatus === 'paid' && targetStatus !== 'paid') {
      toast.error(
        t(
          'adminPayouts.errors.cannotChangePaid',
          'Cannot change status of a payout that has already been PAID',
        ),
      );
      return;
    }

    statusMutation.mutate({ id: rowId, status: nextStatus });
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
    sections,
    activeTab,
    activeSection,
    openActionId,
    isLoading,
    isUpdatingStatus: statusMutation.isPending,
    updatingRowId: statusMutation.isPending ? statusMutation.variables?.id : null,
    page: safePage,
    totalPages,
    totalRecords,
    resultsFrom,
    resultsTo,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    handleTabChange,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handlePreviousPage,
    handleNextPage,
  };
}
