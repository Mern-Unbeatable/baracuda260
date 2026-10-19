import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination/Pagination';
import PhotoShowcaseCard from '@/components/data-display/PhotoShowcaseCard/PhotoShowcaseCard';
import {
  FAVOURITE_PHOTOS,
  FAVOURITE_PHOTOS_PAGE_SIZE,
} from '@/portals/member/data/favouritePhotosData';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

/**
 * Member Favourite Photos view — displays user's bookmarked & favorited photos
 * in a responsive 4-column grid using reusable PhotoShowcaseCard and Pagination.
 */
const FavouritePhotosContent = memo(() => {
  const { t } = useTranslation();
  const [photosList, setPhotosList] = useState(FAVOURITE_PHOTOS);

  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    photosList,
    FAVOURITE_PHOTOS_PAGE_SIZE,
  );

  const handleSaveToggle = useCallback((photoId, isSaved) => {
    // If the user unsaves a photo, we can update its saved status or keep it in state
    setPhotosList((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, saved: isSaved } : photo,
      ),
    );
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
          {t('favouritePhotos.title', 'Favourite Photos')}
        </h1>
        <p className="max-w-240 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t(
            'favouritePhotos.subtitle',
            'Explore and manage your collection of saved and favourite photos.',
          )}
        </p>
      </header>

      {pagedItems.length === 0 ? (
        <div className="flex min-h-70 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbc3d5] bg-white p-8 text-center">
          <p className="text-[16px] font-medium text-[#494453]">
            {t('favouritePhotos.empty', 'You have no favourite photos yet.')}
          </p>
          <p className="mt-1 text-[14px] text-[#8c93a0]">
            {t(
              'favouritePhotos.emptyHint',
              'Browse the gallery and click the bookmark icon to save photos here.',
            )}
          </p>
        </div>
      ) : (
        <section
          aria-label={t('favouritePhotos.gridAria', 'Favourite photos showcase')}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {pagedItems.map((photo) => (
            <PhotoShowcaseCard
              key={photo.id}
              href={photo.href ?? '/gallery'}
              image={photo.image}
              badge={photo.badge}
              title={photo.title}
              description={photo.description}
              likes={photo.likes}
              views={photo.views}
              date={photo.date}
              price={photo.price}
              extraPhotosLabel={photo.extraPhotosLabel}
              topRightType="none"
              initialSaved={photo.saved ?? true}
              onSaveToggle={(isSaved) => handleSaveToggle(photo.id, isSaved)}
            />
          ))}
        </section>
      )}

      {photosList.length > 0 ? (
        <footer className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
            {t('favouritePhotos.showing', {
              from: (currentPage - 1) * FAVOURITE_PHOTOS_PAGE_SIZE + 1,
              to: Math.min(
                currentPage * FAVOURITE_PHOTOS_PAGE_SIZE,
                photosList.length,
              ),
              total: photosList.length,
              defaultValue: `Showing ${
                (currentPage - 1) * FAVOURITE_PHOTOS_PAGE_SIZE + 1
              }-${Math.min(
                currentPage * FAVOURITE_PHOTOS_PAGE_SIZE,
                photosList.length,
              )} of ${photosList.length}`,
            })}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t(
              'favouritePhotos.paginationAria',
              'Favourite photos pagination',
            )}
          />
        </footer>
      ) : null}
    </div>
  );
});

FavouritePhotosContent.displayName = 'FavouritePhotosContent';

export default FavouritePhotosContent;
