import { useTranslation } from 'react-i18next';
import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberFavouritePhotographerCard from '@/components/data-display/MemberFavouritePhotographerCard/MemberFavouritePhotographerCard';
import {
  PROFILE_CONNECTIONS_PAGE_SIZE,
  sortProfileConnections,
} from '@/portals/member/data/profileConnectionsData';

const ProfileConnectionsContent = memo(({ titleKey, subtitleKey, photographers }) => {
  const { t } = useTranslation();

  const sortedItems = useMemo(() => sortProfileConnections(photographers), [photographers]);

  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    sortedItems,
    PROFILE_CONNECTIONS_PAGE_SIZE,
  );

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <Link
        to={ROUTES.ADMIN_PROFILE}
        className="inline-flex w-fit items-center gap-1.5 text-[14px] font-medium text-[#4048cd] transition hover:text-[#363eb8]"
      >
        <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
        {t('profileConnections.backToSelection')}
      </Link>

      <header className="flex flex-col gap-3 sm:gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
          {t(titleKey)}
        </h1>
        <p className="max-w-[960px] text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t(subtitleKey)}
        </p>
      </header>

      {pagedItems.length === 0 ? (
        <p className="text-[16px] text-[#494453]" role="status">
          {t('profileConnections.empty')}
        </p>
      ) : (
        <section
          aria-label={t('profileConnections.gridAria')}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {pagedItems.map((photographer) => (
            <MemberFavouritePhotographerCard
              key={photographer.id}
              photographer={photographer}
              defaultFollowing={photographer.defaultFollowing}
            />
          ))}
        </section>
      )}

      {sortedItems.length > 0 ? (
        <footer className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
            {t('profileConnections.showing', {
              from: (currentPage - 1) * PROFILE_CONNECTIONS_PAGE_SIZE + 1,
              to: Math.min(currentPage * PROFILE_CONNECTIONS_PAGE_SIZE, sortedItems.length),
              total: sortedItems.length,
            })}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t('profileConnections.paginationAria')}
          />
        </footer>
      ) : null}
    </div>
  );
});

ProfileConnectionsContent.displayName = 'ProfileConnectionsContent';

export default ProfileConnectionsContent;
