import { GalleryHorizontalEnd, Plus } from 'lucide-react';
import React, { memo, useId } from 'react';
import { useTranslation } from 'react-i18next';
import SlideshowBuilderModal from '@/components/data-display/Slideshow/SlideshowBuilderModal';
import SlideshowCard from '@/components/data-display/Slideshow/SlideshowCard';
import SlideshowPlayer from '@/components/data-display/Slideshow/SlideshowPlayer';
import Button from '@/components/ui/Button';
import {
  SLIDESHOW_MAX_PHOTOS,
  SLIDESHOW_MIN_PHOTOS,
} from '@/shared/data/slideshows';
import { useProfileSlideshows } from '@/shared/hooks/useProfileSlideshows';

const SKELETON_CARDS = ['a', 'b', 'c', 'd'];
const EMPTY_DECK_TILT = ['-rotate-8', 'rotate-0', 'rotate-8'];

/**
 * "Slideshows" block on a profile's Artwork tab.
 * @param {{ canManage?: boolean, ownerName?: string }} props
 *   `canManage` is true only when the signed-in user is viewing their own profile.
 */
const PhotographerSlideshowsSection = memo(
  ({ canManage = false, ownerName }) => {
    const { t } = useTranslation();
    const headingId = useId();
    const hintId = useId();
    const {
      slideshows,
      isLoading,
      isError,
      refetch,
      sourcePhotos,
      sourcePhotosLoading,
      sourcePhotosError,
      refetchSourcePhotos,
      canCreate,
      builder,
      isSaving,
      openCreate,
      openEdit,
      closeBuilder,
      submitBuilder,
      deletingId,
      deleteSlideshow,
      activeSlideshow,
      openPlayer,
      closePlayer,
    } = useProfileSlideshows({ canManage });

    if (!canManage && !isLoading && !isError && slideshows.length === 0) {
      return null;
    }

    const createDisabled = sourcePhotosLoading || !canCreate;
    const showNeedMoreHint = canManage && !sourcePhotosLoading && !canCreate;

    const createButton = (
      <Button
        unstyled
        type="button"
        onClick={openCreate}
        disabled={createDisabled}
        aria-describedby={showNeedMoreHint ? hintId : undefined}
        className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4048cd] px-5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#343bb0] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        <Plus size={18} strokeWidth={2.25} aria-hidden="true" />
        {t('photographerProfile.slideshows.create')}
      </Button>
    );

    const renderContent = () => {
      if (isLoading) {
        return (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
            {SKELETON_CARDS.map((key) => (
              <div key={key} className="animate-pulse pt-3">
                <div className="aspect-368/252 rounded-2xl bg-[#eef0f4]" />
                <div className="mt-3 h-5 w-2/3 rounded bg-[#eef0f4]" />
                <div className="mt-2 h-4 w-1/3 rounded bg-[#eef0f4]" />
              </div>
            ))}
          </div>
        );
      }

      if (isError) {
        return (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-4 py-10 text-center">
            <p className="text-[15px] text-red-700">
              {t('photographerProfile.slideshows.loadError')}
            </p>
            <Button
              unstyled
              type="button"
              onClick={() => refetch()}
              className="cursor-pointer rounded-lg border border-red-200 bg-white px-4 py-2 text-[14px] font-semibold text-red-700 transition hover:bg-red-50"
            >
              {t('photographerProfile.slideshows.retry')}
            </Button>
          </div>
        );
      }

      if (!slideshows.length) {
        const deck = sourcePhotos.slice(0, 3);
        return (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-[#c7cbf2] bg-linear-to-b from-[#f5f6ff] to-white px-5 py-10 text-center sm:py-12">
            {deck.length ? (
              <div aria-hidden="true" className="flex items-end justify-center">
                {deck.map((photo, i) => (
                  <img
                    key={photo.id}
                    src={photo.image}
                    alt=""
                    loading="lazy"
                    className={`-mx-3 h-20 w-16 rounded-lg object-cover shadow-lg ring-4 ring-white sm:h-24 sm:w-20 ${EMPTY_DECK_TILT[i]} ${i === 1 ? 'relative z-10 -translate-y-2' : ''}`}
                  />
                ))}
              </div>
            ) : null}
            <div className="max-w-md">
              <h3 className="text-[18px] font-bold text-[#111827]">
                {t('photographerProfile.slideshows.emptyTitle')}
              </h3>
              <p className="mt-1.5 text-[14px] leading-6 text-[#6b7280]">
                {t('photographerProfile.slideshows.emptyText', {
                  min: SLIDESHOW_MIN_PHOTOS,
                  max: SLIDESHOW_MAX_PHOTOS,
                })}
              </p>
            </div>
            {createButton}
          </div>
        );
      }

      return (
        <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
          {slideshows.map((slideshow) => (
            <li key={slideshow.id}>
              <SlideshowCard
                slideshow={slideshow}
                canManage={canManage}
                isDeleting={deletingId === slideshow.id}
                onPlay={openPlayer}
                onEdit={openEdit}
                onDelete={deleteSlideshow}
              />
            </li>
          ))}
        </ul>
      );
    };

    const showHeaderButton =
      canManage && (isLoading || isError || slideshows.length > 0);

    return (
      <section className="mt-10 sm:mt-12" aria-labelledby={headingId}>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <GalleryHorizontalEnd
                size={22}
                className="shrink-0 text-[#4048cd]"
                aria-hidden="true"
              />
              <h2
                id={headingId}
                className="text-[20px] font-bold text-[#111827] sm:text-[22px]"
              >
                {t('photographerProfile.slideshows.title')}
              </h2>
            </div>
            <p className="mt-1 max-w-2xl text-[14px] leading-6 text-[#6b7280] sm:text-[15px]">
              {t('photographerProfile.slideshows.subtitle')}
            </p>
          </div>

          {showHeaderButton ? (
            <div className="flex shrink-0 flex-col items-stretch gap-1.5 sm:items-end">
              {createButton}
            </div>
          ) : null}
        </div>

        {showNeedMoreHint ? (
          <p
            id={hintId}
            className="mb-4 rounded-lg bg-[#f5f6ff] px-3 py-2 text-[13px] text-[#4048cd]"
          >
            {sourcePhotosError
              ? t('photographerProfile.slideshows.builder.photosLoadError')
              : t('photographerProfile.slideshows.needMorePhotos', {
                  count: SLIDESHOW_MIN_PHOTOS,
                })}
          </p>
        ) : null}

        {renderContent()}

        {canManage ? (
          <SlideshowBuilderModal
            open={builder.open}
            slideshow={builder.slideshow}
            photos={sourcePhotos}
            photosLoading={sourcePhotosLoading}
            photosError={sourcePhotosError}
            onRetryPhotos={() => refetchSourcePhotos()}
            isSaving={isSaving}
            onClose={closeBuilder}
            onSubmit={submitBuilder}
          />
        ) : null}

        {activeSlideshow ? (
          <SlideshowPlayer
            key={activeSlideshow.id}
            slideshow={activeSlideshow}
            ownerName={ownerName}
            onClose={closePlayer}
          />
        ) : null}
      </section>
    );
  },
);

PhotographerSlideshowsSection.displayName = 'PhotographerSlideshowsSection';

export default PhotographerSlideshowsSection;
