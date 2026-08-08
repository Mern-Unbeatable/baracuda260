import { useState } from 'react';
import {
  ADMIN_ALBUM_TYPE_ITEMS,
  MODAL_MODE,
  appendAlbumType,
  createAlbumTypeFromForm,
  isAlbumTypeFormValid,
  parseFeaturedLines,
  parsePrizeMoney,
  updateAlbumTypeById,
} from '@/modules/admin/data/adminAlbumTypesData';

/**
 * Album type cards + create/edit modal state.
 */
export default function useAdminAlbumTypes(initialAlbumTypes = ADMIN_ALBUM_TYPE_ITEMS) {
  const [albumTypes, setAlbumTypes] = useState(initialAlbumTypes);
  const [nextCustomIndex, setNextCustomIndex] = useState(1);
  const [modalMode, setModalMode] = useState(null);
  const [editingAlbumTypeId, setEditingAlbumTypeId] = useState(null);

  const editingAlbumType =
    albumTypes.find((albumType) => albumType.id === editingAlbumTypeId) || null;

  const handleOpenCreateModal = () => {
    setEditingAlbumTypeId(null);
    setModalMode(MODAL_MODE.CREATE);
  };

  const handleOpenEditModal = (albumTypeId) => {
    setEditingAlbumTypeId(albumTypeId);
    setModalMode(MODAL_MODE.EDIT);
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEditingAlbumTypeId(null);
  };

  const handleSaveAlbumType = (values) => {
    if (!isAlbumTypeFormValid(values)) return;

    const name = values.name.trim();
    const description = values.description.trim();
    const features = parseFeaturedLines(values.featured);
    const prizeMoney = parsePrizeMoney(values.prizeMoney);

    if (modalMode === MODAL_MODE.EDIT && editingAlbumTypeId) {
      setAlbumTypes((current) =>
        updateAlbumTypeById(current, editingAlbumTypeId, {
          name,
          description,
          features,
          prizeMoney,
        }),
      );
      handleCloseModal();
      return;
    }

    const nextAlbumType = createAlbumTypeFromForm(name, nextCustomIndex, {
      description,
      features,
      prizeMoney,
    });
    setAlbumTypes((current) => appendAlbumType(current, nextAlbumType));
    setNextCustomIndex((current) => current + 1);
    handleCloseModal();
  };

  return {
    albumTypes,
    modalMode,
    editingAlbumType,
    isModalOpen: Boolean(modalMode),
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveAlbumType,
  };
}
