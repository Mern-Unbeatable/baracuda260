import { RefreshCw } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberFavouritePhotographerCard from '@/components/data-display/MemberFavouritePhotographerCard/MemberFavouritePhotographerCard';
import useUserFollowing from '@/portals/member/hooks/useUserFollowing';

const PAGE_SIZE = 12;

const FavouritePhotographersContent = memo(() => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const { items, meta, isLoading, isError, error, toggleFollow, isTogglingFollow } =
    useUserFollowing({ page: currentPage, limit: PAGE_SIZE });

  const totalRecords = meta?.totalRecords ?? items.length;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
      <header className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
            {t('favouritePhotographers.title')}
          </h1>
          {isLoading ? (
            <div className="flex items-center gap-2 text-[14px] text-[#7a7484]">
              <RefreshCw size={16} className="animate-spin text-[#4048cd]" />
              <span>{t('common.loading', 'Loading...')}</span>
            </div>
          ) : null}
        </div>
        <p className="max-w-240 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('favouritePhotographers.subtitle')}
        </p>
      </header>

      {isLoading && items.length === 0 ? (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-[rgba(203,195,213,0.15)] bg-white p-8">
          <RefreshCw size={24} className="animate-spin text-[#4048cd]" />
        </div>
      ) : isError && items.length === 0 ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-[15px] text-red-600">
          {error?.message ||
            t(
              'favouritePhotographers.error',
              'Failed to load favourite photographers.',
            )}
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbc3d5] bg-white p-8 text-center">
          <p className="text-[16px] font-medium text-[#494453]" role="status">
            {t('favouritePhotographers.empty', 'No favourite photographers yet.')}
          </p>
          <p className="mt-1 text-[14px] text-[#8c93a0]">
            {t(
              'favouritePhotographers.emptyHint',
              'Follow photographers to stay updated with their latest artwork.',
            )}
          </p>
        </div>
      ) : (
        <section
          aria-label={t('favouritePhotographers.gridAria')}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {items.map((photographer) => (
            <MemberFavouritePhotographerCard
              key={photographer.id || photographer.username}
              photographer={photographer}
              defaultFollowing={true}
              onToggleFollow={toggleFollow}
              isToggling={isTogglingFollow}
            />
          ))}
        </section>
      )}

      {totalRecords > 0 ? (
        <footer className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
            {t('favouritePhotographers.showing', {
              from: (currentPage - 1) * PAGE_SIZE + 1,
              to: Math.min(currentPage * PAGE_SIZE, totalRecords),
              total: totalRecords,
              defaultValue: `Showing ${
                (currentPage - 1) * PAGE_SIZE + 1
              }–${Math.min(currentPage * PAGE_SIZE, totalRecords)} of ${totalRecords} photographers`,
            })}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            ariaLabel={t('favouritePhotographers.paginationAria')}
          />
        </footer>
      ) : null}
    </div>
  );
});

FavouritePhotographersContent.displayName = 'FavouritePhotographersContent';

export default FavouritePhotographersContent;
