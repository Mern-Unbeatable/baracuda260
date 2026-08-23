import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import {
  ADMIN_ALBUM_TYPES_ASSETS,
  CHECK_ICON_SIZE,
  EDIT_ICON_SIZE,
  ICON_BOX_SIZE,
  TYPE_ICON_SIZE,
  formatPrizeMoney,
  resolveAlbumTypeCopy,
} from '@/portals/admin/data/adminAlbumTypesData';
import useAdminAlbumTypes from '@/portals/admin/hooks/useAdminAlbumTypes';
import AlbumTypeModal from '@/portals/admin/components/admin-album-types/AlbumTypeModal';
import AdminPageHeader from '@/portals/admin/components/ui/AdminPageHeader';

/**
 * @param {{ albumType: object, onEdit: (id: string) => void }} props
 */
const AlbumTypeCard = memo(({ albumType, onEdit }) => {
  const { t } = useTranslation();
  const { name, description, features } = resolveAlbumTypeCopy(t, albumType);
  const iconSrc = ADMIN_ALBUM_TYPES_ASSETS[albumType.iconKey] || ADMIN_ALBUM_TYPES_ASSETS.camera;

  return (
    <article className="flex w-full flex-col gap-7.5 rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-white p-5 sm:p-8">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col gap-7">
          <div
            className="inline-flex items-center justify-center rounded-lg bg-[#fde8e9] px-3 pb-3.25 pt-3"
            style={{ width: ICON_BOX_SIZE.width, height: ICON_BOX_SIZE.height }}
          >
            <img
              src={iconSrc}
              alt=""
              width={TYPE_ICON_SIZE}
              height={TYPE_ICON_SIZE}
              className="size-8"
            />
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-4">
              <h2 className="font-manrope text-[28px] font-semibold leading-7 text-[#0d0d14] sm:text-[32px]">
                {name}
              </h2>
              <p className="font-manrope text-[16px] font-normal leading-normal text-[#6b7280]">
                {description}
              </p>
            </div>

            <ul className="flex w-full flex-col gap-2.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <img
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

      <button
        type="button"
        onClick={() => onEdit(albumType.id)}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[50px] bg-[#ee1c25] px-6 py-3 text-[16px] font-bold leading-normal text-white transition hover:bg-[#d41921]"
      >
        <img
          src={ADMIN_ALBUM_TYPES_ASSETS.edit}
          alt=""
          width={EDIT_ICON_SIZE}
          height={EDIT_ICON_SIZE}
          className="size-5"
        />
        {t('adminAlbumTypes.editAlbum')}
      </button>
    </article>
  );
});

AlbumTypeCard.displayName = 'AlbumTypeCard';

/**
 * Admin Album types — Figma node 339:3417.
 */
const AdminAlbumTypesContent = memo(() => {
  const { t } = useTranslation();
  const {
    albumTypes,
    modalMode,
    editingAlbumType,
    isModalOpen,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveAlbumType,
  } = useAdminAlbumTypes();

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <AdminPageHeader
          as="div"
          eyebrow={t('adminAlbumTypes.eyebrow')}
          title={t('adminAlbumTypes.title')}
          description={t('adminAlbumTypes.subtitle')}
        />

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex w-fit shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#ee1c25] px-4.5 py-3.25 text-[17px] font-bold leading-6.25 text-white shadow-[0px_5px_5px_rgba(38,99,213,0.11)] transition hover:bg-[#d41921]"
        >
          {t('adminAlbumTypes.create')}
        </button>
      </header>

      <section
        aria-label={t('adminAlbumTypes.gridAria')}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {albumTypes.map((albumType) => (
          <AlbumTypeCard
            key={albumType.id}
            albumType={albumType}
            onEdit={handleOpenEditModal}
          />
        ))}
      </section>

      <AlbumTypeModal
        open={isModalOpen}
        mode={modalMode}
        albumType={editingAlbumType}
        onClose={handleCloseModal}
        onSave={handleSaveAlbumType}
      />
    </div>
  );
});

AdminAlbumTypesContent.displayName = 'AdminAlbumTypesContent';

export default AdminAlbumTypesContent;
