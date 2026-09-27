import { Trash2 } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import AlbumTypeModal from '@/portals/admin/components/admin-album-types/AlbumTypeModal';
import {
  ADMIN_ALBUM_TYPES_ASSETS,
  CHECK_ICON_SIZE,
  EDIT_ICON_SIZE,
  formatPrizeMoney,
  getAlbumTypeIcon,
  ICON_BOX_SIZE,
  parseFeatures,
  TYPE_ICON_SIZE,
} from '@/portals/admin/data/adminAlbumTypesData';
import useAdminAlbumTypes from '@/portals/admin/hooks/useAdminAlbumTypes';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';

const SKELETON_CARD_COUNT = 3;

/**
 * @param {{
 *   albumType: object,
 *   isDeleting: boolean,
 *   onEdit: (id: string) => void,
 *   onDelete: (id: string) => void,
 * }} props
 */
const AlbumTypeCard = memo(({ albumType, isDeleting, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const features = parseFeatures(albumType.features);

  const handleDelete = async () => {
    const confirmed = await confirmDestructiveAction({
      title: t('adminAlbumTypes.confirmDelete.title', {
        name: albumType.name,
      }),
      text: t('adminAlbumTypes.confirmDelete.text'),
      confirmButtonText: t('adminAlbumTypes.confirmDelete.confirm'),
      cancelButtonText: t('adminAlbumTypes.confirmDelete.cancel'),
    });
    if (confirmed) onDelete(albumType.id);
  };

  return (
    <article
      className={`flex w-full flex-col justify-between gap-7.5 rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-white p-5 transition-opacity sm:p-8 ${
        isDeleting ? 'opacity-60' : ''
      }`}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-7">
          <div className="flex items-start justify-between gap-3">
            <div
              className="inline-flex items-center justify-center rounded-lg bg-[#fde8e9] px-3 pb-3.25 pt-3"
              style={{
                width: ICON_BOX_SIZE.width,
                height: ICON_BOX_SIZE.height,
              }}
            >
              <Image
                src={getAlbumTypeIcon(albumType)}
                alt=""
                width={TYPE_ICON_SIZE}
                height={TYPE_ICON_SIZE}
                className="size-8"
              />
            </div>
            {albumType.isActive === false ? (
              <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-semibold leading-4 text-[#6b7280]">
                {t('adminAlbumTypes.inactive')}
              </span>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-4">
              <h2 className="font-manrope text-[28px] font-semibold leading-8 text-[#0d0d14] sm:text-[32px] sm:leading-9">
                {albumType.name}
              </h2>
              <p className="font-manrope text-[16px] font-normal leading-normal text-[#6b7280]">
                {albumType.description}
              </p>
            </div>

            {features.length > 0 ? (
              <ul className="flex w-full flex-col gap-2.5">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Image
                      src={ADMIN_ALBUM_TYPES_ASSETS.check}
                      alt=""
                      width={CHECK_ICON_SIZE}
                      height={CHECK_ICON_SIZE}
                      className="size-3.25 shrink-0"
                    />
                    <span className="font-manrope text-[14px] font-normal leading-5 text-[#111827]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <p className="font-manrope font-semibold leading-none text-[#0d0d14]">
          <span className="text-[28px] leading-normal text-[#4048cd] sm:text-[32px]">
            {formatPrizeMoney(albumType.prizeMoney)}
          </span>
          <span className="text-[16px] font-normal leading-normal text-[#1b1e56]">
            {t('adminAlbumTypes.prizeSuffix')}
          </span>
        </p>
      </div>

      <div className="flex w-full gap-3">
        <Button
          unstyled
          type="button"
          onClick={() => onEdit(albumType.id)}
          disabled={isDeleting}
          className="inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-[50px] bg-[#ee1c25] px-6 py-3 text-[16px] font-bold leading-normal text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image
            src={ADMIN_ALBUM_TYPES_ASSETS.edit}
            alt=""
            width={EDIT_ICON_SIZE}
            height={EDIT_ICON_SIZE}
            className="size-5"
          />
          {t('adminAlbumTypes.editAlbum')}
        </Button>
        <Button
          unstyled
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={t('adminAlbumTypes.deleteAria', { name: albumType.name })}
          title={t('adminAlbumTypes.deleteAlbum')}
          className="inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#ee1c25] text-[#ee1c25] transition hover:bg-[#fde8e9] disabled:cursor-wait disabled:opacity-60"
        >
          <Trash2 size={20} aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
});

AlbumTypeCard.displayName = 'AlbumTypeCard';

const AlbumTypesSkeleton = () => (
  <>
    {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
      <div
        key={index}
        className="h-105 w-full animate-pulse rounded-[20px] bg-[#f3f4f6]"
      />
    ))}
  </>
);

/**
 * Admin Album types — Figma node 339:3417.
 */
const AdminAlbumTypesContent = memo(() => {
  const { t } = useTranslation();
  const {
    albumTypes,
    isLoading,
    isError,
    loadErrorMessage,
    refetch,
    isSaving,
    deletingId,
    modalMode,
    editingAlbumType,
    isModalOpen,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveAlbumType,
    handleDeleteAlbumType,
  } = useAdminAlbumTypes();

  let body;
  if (isLoading) {
    body = (
      <section
        aria-busy="true"
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        <AlbumTypesSkeleton />
      </section>
    );
  } else if (isError) {
    body = (
      <div className="flex flex-col items-center gap-3 rounded-[20px] bg-white px-6 py-10 text-center">
        <p className="text-[16px] text-[#ee1c25]">{loadErrorMessage}</p>
        <Button
          unstyled
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[16px] font-medium text-[#4048cd] transition hover:bg-[#f6fbff]"
        >
          {t('adminAlbumTypes.retry')}
        </Button>
      </div>
    );
  } else if (albumTypes.length === 0) {
    body = (
      <p className="rounded-[20px] bg-white px-6 py-10 text-center text-[16px] text-[#687186]">
        {t('adminAlbumTypes.empty')}
      </p>
    );
  } else {
    body = (
      <section
        aria-label={t('adminAlbumTypes.gridAria')}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {albumTypes.map((albumType) => (
          <AlbumTypeCard
            key={albumType.id}
            albumType={albumType}
            isDeleting={deletingId === albumType.id}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteAlbumType}
          />
        ))}
      </section>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <AdminPageHeader
          as="div"
          eyebrow={t('adminAlbumTypes.eyebrow')}
          title={t('adminAlbumTypes.title')}
          description={t('adminAlbumTypes.subtitle')}
        />

        <Button
          unstyled
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex w-fit shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#ee1c25] px-4.5 py-3.25 text-[17px] font-bold leading-6.25 text-white shadow-[0px_5px_5px_rgba(38,99,213,0.11)] transition hover:bg-[#d41921]"
        >
          {t('adminAlbumTypes.create')}
        </Button>
      </header>

      {body}

      <AlbumTypeModal
        open={isModalOpen}
        mode={modalMode}
        albumType={editingAlbumType}
        isSaving={isSaving}
        onClose={handleCloseModal}
        onSave={handleSaveAlbumType}
      />
    </div>
  );
});

AdminAlbumTypesContent.displayName = 'AdminAlbumTypesContent';

export default AdminAlbumTypesContent;
