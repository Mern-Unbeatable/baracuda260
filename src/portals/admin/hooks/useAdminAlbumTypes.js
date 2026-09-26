import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  buildAlbumTypePayload,
  MODAL_MODE,
} from '@/portals/admin/data/adminAlbumTypesData';
import {
  ADMIN_ALBUM_TYPES_QUERY_KEY,
  createAlbumTypeApi,
  deleteAlbumTypeApi,
  getAlbumTypesApi,
  updateAlbumTypeApi,
} from '@/shared/api/albumTypes.api';
import { getApiErrorMessage } from '@/shared/api/client';

/**
 * Album types from `/v1/album-types`, plus the create/edit modal state.
 */
export default function useAdminAlbumTypes() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [modalMode, setModalMode] = useState(null);
  const [editingAlbumTypeId, setEditingAlbumTypeId] = useState(null);

  const albumTypesQuery = useQuery({
    queryKey: ADMIN_ALBUM_TYPES_QUERY_KEY,
    queryFn: getAlbumTypesApi,
  });

  const albumTypes = albumTypesQuery.data ?? [];
  const editingAlbumType =
    albumTypes.find((albumType) => albumType.id === editingAlbumTypeId) || null;

  const closeModal = () => {
    setModalMode(null);
    setEditingAlbumTypeId(null);
  };

  const refreshAlbumTypes = () =>
    queryClient.invalidateQueries({ queryKey: ADMIN_ALBUM_TYPES_QUERY_KEY });

  const createMutation = useMutation({
    mutationFn: createAlbumTypeApi,
    onSuccess: () => {
      refreshAlbumTypes();
      closeModal();
      toast.success(t('adminAlbumTypes.createSuccess'));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t('adminAlbumTypes.createError')));
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAlbumTypeApi,
    onSuccess: () => {
      refreshAlbumTypes();
      closeModal();
      toast.success(t('adminAlbumTypes.updateSuccess'));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t('adminAlbumTypes.updateError')));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAlbumTypeApi,
    onSuccess: () => {
      refreshAlbumTypes();
      toast.success(t('adminAlbumTypes.deleteSuccess'));
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, t('adminAlbumTypes.deleteError')));
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleOpenCreateModal = () => {
    setEditingAlbumTypeId(null);
    setModalMode(MODAL_MODE.CREATE);
  };

  const handleOpenEditModal = (albumTypeId) => {
    setEditingAlbumTypeId(albumTypeId);
    setModalMode(MODAL_MODE.EDIT);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    closeModal();
  };

  const handleSaveAlbumType = (values) => {
    if (isSaving) return;

    if (modalMode === MODAL_MODE.EDIT && editingAlbumTypeId) {
      updateMutation.mutate({
        id: editingAlbumTypeId,
        payload: buildAlbumTypePayload(values, { includeKind: false }),
      });
      return;
    }

    createMutation.mutate(buildAlbumTypePayload(values, { includeKind: true }));
  };

  const handleDeleteAlbumType = (albumTypeId) => {
    if (deleteMutation.isPending) return;
    deleteMutation.mutate(albumTypeId);
  };

  return {
    albumTypes,
    isLoading: albumTypesQuery.isLoading,
    isError: albumTypesQuery.isError,
    loadErrorMessage: getApiErrorMessage(
      albumTypesQuery.error,
      t('adminAlbumTypes.loadError'),
    ),
    refetch: albumTypesQuery.refetch,
    isSaving,
    deletingId: deleteMutation.isPending ? deleteMutation.variables : null,
    modalMode,
    editingAlbumType,
    isModalOpen: Boolean(modalMode),
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveAlbumType,
    handleDeleteAlbumType,
  };
}
