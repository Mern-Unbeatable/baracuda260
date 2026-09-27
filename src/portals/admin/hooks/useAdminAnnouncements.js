import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  ACTIVE_STATE,
  ANNOUNCEMENTS_PAGE_SIZE,
  buildActiveStatePayload,
  buildAnnouncementPayload,
  getAnnouncementPageNumbers,
} from '@/portals/admin/data/adminAnnouncementsData';
import {
  ADMIN_ANNOUNCEMENTS_QUERY_KEY,
  createAdminAnnouncementApi,
  deleteAdminAnnouncementApi,
  getAdminAnnouncementApi,
  getAdminAnnouncementStatsApi,
  getAdminAnnouncementsApi,
  updateAdminAnnouncementApi,
} from '@/shared/api/announcements.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';

const MODAL_MODE = { CREATE: 'create', EDIT: 'edit' };

/**
 * Announcements list (server-paginated), stats, and create/edit/delete actions.
 */
export default function useAdminAnnouncements(
  pageSize = ANNOUNCEMENTS_PAGE_SIZE,
) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const listQuery = useQuery({
    queryKey: [...ADMIN_ANNOUNCEMENTS_QUERY_KEY, 'list', page, pageSize],
    queryFn: () => getAdminAnnouncementsApi({ page, limit: pageSize }),
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: [...ADMIN_ANNOUNCEMENTS_QUERY_KEY, 'stats'],
    queryFn: getAdminAnnouncementStatsApi,
  });

  const detailQuery = useQuery({
    queryKey: [...ADMIN_ANNOUNCEMENTS_QUERY_KEY, 'detail', editingId],
    queryFn: () => getAdminAnnouncementApi(editingId),
    enabled: modalMode === MODAL_MODE.EDIT && Boolean(editingId),
  });

  const rows = listQuery.data?.items ?? [];
  const total = listQuery.data?.meta.total ?? 0;
  const totalPages = Math.max(1, listQuery.data?.meta.totalPages ?? 1);

  useEffect(() => {
    if (listQuery.data && page > totalPages) setPage(totalPages);
  }, [listQuery.data, page, totalPages]);

  const refreshAnnouncements = () =>
    queryClient.invalidateQueries({ queryKey: ADMIN_ANNOUNCEMENTS_QUERY_KEY });

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
  };

  const createMutation = useMutation({
    mutationFn: createAdminAnnouncementApi,
    onSuccess: () => {
      refreshAnnouncements();
      setPage(1);
      closeModal();
      toast.success(t('adminAnnouncements.toast.created'));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t('adminAnnouncements.toast.createError')),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAdminAnnouncementApi,
    onSuccess: () => {
      refreshAnnouncements();
      closeModal();
      toast.success(t('adminAnnouncements.toast.updated'));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t('adminAnnouncements.toast.updateError')),
      );
    },
  });

  const activeStateMutation = useMutation({
    mutationFn: updateAdminAnnouncementApi,
    onSuccess: (_data, { payload }) => {
      refreshAnnouncements();
      toast.success(
        payload.activeState === ACTIVE_STATE.ACTIVE
          ? t('adminAnnouncements.toast.activated')
          : t('adminAnnouncements.toast.deactivated'),
      );
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t('adminAnnouncements.toast.updateError')),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminAnnouncementApi,
    onSuccess: () => {
      refreshAnnouncements();
      toast.success(t('adminAnnouncements.toast.deleted'));
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, t('adminAnnouncements.toast.deleteError')),
      );
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const busyId =
    (activeStateMutation.isPending && activeStateMutation.variables?.id) ||
    (deleteMutation.isPending && deleteMutation.variables) ||
    null;

  const handleToggleAction = (rowId) => {
    setOpenActionId((current) => (current === rowId ? null : rowId));
  };

  const handleCloseAction = () => setOpenActionId(null);

  const handleDelete = async (row) => {
    const confirmed = await confirmDestructiveAction({
      title: t('adminAnnouncements.confirmDelete.title'),
      text: row.message,
      confirmButtonText: t('adminAnnouncements.confirmDelete.confirm'),
      cancelButtonText: t('adminAnnouncements.confirmDelete.cancel'),
    });
    if (confirmed) deleteMutation.mutate(row.id);
  };

  const handleSelectAction = (row, actionId) => {
    setOpenActionId(null);

    if (actionId === 'edit') {
      setEditingId(row.id);
      setModalMode(MODAL_MODE.EDIT);
      return;
    }

    if (actionId === 'delete') {
      handleDelete(row);
      return;
    }

    if (actionId === row.activeState || busyId) return;
    activeStateMutation.mutate({
      id: row.id,
      payload: buildActiveStatePayload(row, actionId),
    });
  };

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
    setOpenActionId(null);
  };

  const handleOpenCreateModal = () => {
    setOpenActionId(null);
    setEditingId(null);
    setModalMode(MODAL_MODE.CREATE);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    closeModal();
  };

  const handleSubmitAnnouncement = (values) => {
    if (isSaving) return;

    if (modalMode === MODAL_MODE.EDIT && editingId) {
      updateMutation.mutate({
        id: editingId,
        payload: buildAnnouncementPayload(values, {
          previousLink: detailQuery.data?.link,
        }),
      });
      return;
    }

    createMutation.mutate(buildAnnouncementPayload(values));
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : from + rows.length - 1;

  return {
    rows,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    isFetching: listQuery.isFetching,
    loadErrorMessage: getApiErrorMessage(
      listQuery.error,
      t('adminAnnouncements.loadError'),
    ),
    refetch: listQuery.refetch,
    stats: statsQuery.data ?? null,
    isStatsLoading: statsQuery.isLoading,
    page,
    pageNumbers: getAnnouncementPageNumbers(page, totalPages),
    range: { from, to, total, count: rows.length },
    isFirstPage: page <= 1,
    isLastPage: page >= totalPages,
    busyId,
    openActionId,
    handleToggleAction,
    handleCloseAction,
    handleSelectAction,
    handlePreviousPage: () => goToPage(page - 1),
    handleNextPage: () => goToPage(page + 1),
    handleSelectPage: goToPage,
    isModalOpen: Boolean(modalMode),
    isEditMode: modalMode === MODAL_MODE.EDIT,
    editingAnnouncement: detailQuery.data ?? null,
    isDetailLoading: detailQuery.isLoading,
    isDetailError: detailQuery.isError,
    detailErrorMessage: getApiErrorMessage(
      detailQuery.error,
      t('adminAnnouncements.modal.loadError'),
    ),
    refetchDetail: detailQuery.refetch,
    isSaving,
    handleOpenCreateModal,
    handleCloseModal,
    handleSubmitAnnouncement,
  };
}
