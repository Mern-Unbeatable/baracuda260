import { RefreshCw } from 'lucide-react';
import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination/Pagination';
import PhotoShowcaseCard from '@/components/data-display/PhotoShowcaseCard/PhotoShowcaseCard';
import Button from '@/components/ui/Button';
import useSavedArtworks from '@/portals/member/hooks/useSavedArtworks';

const PAGE_SIZE = 10;

/**
 * Member Favourite Photos view — displays user's bookmarked & favorited photos
 * fetched from GET /api/v1/users/saved-artworks.
 */
const FavouritePhotosContent = memo(() => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    items,
    meta,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    toggleSave,
    toggleLike,
  } = useSavedArtworks({ page: currentPage, limit: PAGE_SIZE });

  const totalRecords = meta?.totalRecords ?? items.length;
  const totalPages = meta?.totalPages ?? 1;
  const from = totalRecords > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(currentPage * PAGE_SIZE, totalRecords);

  const handleSaveToggle = useCallback(
    (photoId, isSaved) => {
      toggleSave(photoId);
    },
    [toggleSave],
  );

  const handleLikeToggle = useCallback(
    (photoId, nextLiked) => {
      toggleLike(photoId);
    },
    [toggleLike],
  );

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
            {t('favouritePhotos.title', 'Favourite Photos')}
          </h1>
          {isFetching && !isLoading ? (
            <div className="flex items-center gap-2 text-[13px] text-[#7a7484]">
              <RefreshCw size={14} className="animate-spin text-[#4048cd]" />
              <span>{t('common.updating', 'Updating...')}</span>
            </div>
          ) : null}
        </div>
        <p className="max-w-240 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t(
            'favouritePhotos.subtitle',
            'Explore and manage your collection of saved and favourite photos.',
          )}
        </p>
      </header>

      {isLoading && items.length === 0 ? (
        <div className="flex min-h-70 items-center justify-center rounded-2xl border border-[rgba(203,195,213,0.15)] bg-white p-8">
          <RefreshCw size={24} className="animate-spin text-[#4048cd]" />
        </div>
      ) : isError && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-[15px] font-medium text-red-600">
            {error?.message ||
              t('common.error', 'Failed to load favourite photos.')}
          </p>
          <Button
            unstyled
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#4048cd] px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-[#343bb0]"
          >
            <RefreshCw size={14} />
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      ) : items.length === 0 ? (
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
          {items.map((photo) => (
            <PhotoShowcaseCard
              key={photo.id}
              id={photo.id}
              href={photo.href ?? `/gallery/${photo.id}`}
              image={photo.image}
              badge={photo.badge}
              title={photo.title}
              titleClassName="line-clamp-1"
              description={photo.description}
              likes={photo.likes}
              views={photo.views}
              date={photo.date}
              price={photo.price}
              competitionLabel={photo.competitionLabel}
              extraPhotosLabel={photo.extraPhotosLabel}
              topRightType="none"
              initialSaved={photo.saved ?? true}
              initialLiked={photo.liked ?? photo.isLiked ?? false}
              onLikeToggle={(nextLiked) => handleLikeToggle(photo.id, nextLiked)}
              onSaveToggle={(isSaved) => handleSaveToggle(photo.id, isSaved)}
            />
          ))}
        </section>
      )}

      {totalRecords > 0 ? (
        <footer className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
            {t('favouritePhotos.showing', {
              from,
              to,
              total: totalRecords,
              defaultValue: `Showing ${from}-${to} of ${totalRecords}`,
            })}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(nextPage) => setCurrentPage(nextPage)}
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

