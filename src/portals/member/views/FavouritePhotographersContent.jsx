import { useTranslation } from 'react-i18next';
import React, { memo, useMemo } from 'react';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import { MarketingPagination } from '@/shared/ui/marketing';
import MemberFavouritePhotographerCard from '@/portals/member/components/member-favourite-photographers/MemberFavouritePhotographerCard';
import {
  FAVOURITE_PHOTOGRAPHERS,
  FAVOURITE_PHOTOGRAPHERS_PAGE_SIZE,
  sortFavouritePhotographers,
} from '@/portals/member/data/favouritePhotographersData';

const FavouritePhotographersContent = memo(() => {
  const { t } = useTranslation();

  const sortedItems = useMemo(() => sortFavouritePhotographers(FAVOURITE_PHOTOGRAPHERS), []);

  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    sortedItems,
    FAVOURITE_PHOTOGRAPHERS_PAGE_SIZE,
  );

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <header className="flex flex-col gap-3 sm:gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
          {t('favouritePhotographers.title')}
        </h1>
        <p className="max-w-[960px] text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('favouritePhotographers.subtitle')}
        </p>
      </header>

      {pagedItems.length === 0 ? (
        <p className="text-[16px] text-[#494453]" role="status">
          {t('favouritePhotographers.empty')}
        </p>
      ) : (
        <section
          aria-label={t('favouritePhotographers.gridAria')}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {pagedItems.map((photographer) => (
            <MemberFavouritePhotographerCard key={photographer.id} photographer={photographer} />
          ))}
        </section>
      )}

      {sortedItems.length > 0 ? (
        <footer className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
            {t('favouritePhotographers.showing', {
              from: (currentPage - 1) * FAVOURITE_PHOTOGRAPHERS_PAGE_SIZE + 1,
              to: Math.min(currentPage * FAVOURITE_PHOTOGRAPHERS_PAGE_SIZE, sortedItems.length),
              total: sortedItems.length,
            })}
          </p>
          <MarketingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t('favouritePhotographers.paginationAria')}
          />
        </footer>
      ) : null}
    </div>
  );
});

FavouritePhotographersContent.displayName = 'FavouritePhotographersContent';

export default FavouritePhotographersContent;
