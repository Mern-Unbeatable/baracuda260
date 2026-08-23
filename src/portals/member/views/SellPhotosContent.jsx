import { useTranslation } from 'react-i18next';
import React, { memo, useMemo, useState } from 'react';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import { FilterPillGroup, MarketingPagination } from '@/shared/ui/marketing';
import MemberSellPhotoCard from '@/portals/member/components/member-sell-photos/MemberSellPhotoCard';
import MemberUploadFormatMenu from '@/portals/member/components/member-sell-photos/MemberUploadFormatMenu';
import MemberPromotePanel from '@/portals/member/components/member-artwork/MemberPromotePanel';
import {
  matchesSellPhotosFilter,
  SELL_PHOTOS_FILTER_TABS,
  SELL_PHOTOS_ITEMS,
  SELL_PHOTOS_PAGE_SIZE,
  sortSellPhotosItems,
} from '@/portals/member/data/sellPhotosData';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const SellPhotosContent = memo(() => {
  const { t } = useTranslation();
  const [filterTab, setFilterTab] = useState('All');
  const [promoteItem, setPromoteItem] = useState(null);

  const filterItems = SELL_PHOTOS_FILTER_TABS.map((tab) => ({
    value: tab.value,
    label: t(tab.labelKey),
  }));

  const filteredItems = useMemo(() => {
    const filtered = SELL_PHOTOS_ITEMS.filter((item) => matchesSellPhotosFilter(item, filterTab));
    return sortSellPhotosItems(filtered);
  }, [filterTab]);

  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    filteredItems,
    SELL_PHOTOS_PAGE_SIZE,
    [filterTab],
  );

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
            {t('sellPhotos.title')}
          </h1>
          <p className="max-w-[960px] text-[15px] leading-6 text-[#494453] sm:text-[16px]">
            {t('sellPhotos.subtitle')}
          </p>
        </div>
        <MemberUploadFormatMenu />
      </header>

      <FilterPillGroup
        items={filterItems}
        value={filterTab}
        onChange={(value) => {
          setFilterTab(value);
          setPage(1);
        }}
        density="compact"
        layout="scroll"
        ariaLabel={t('sellPhotos.filters.aria')}
      />

      {pagedItems.length === 0 ? (
        <p className="text-[16px] text-[#494453]" role="status">
          {t('sellPhotos.empty')}
        </p>
      ) : (
        <section
          aria-label={t('sellPhotos.gridAria')}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {pagedItems.map((item) => (
            <MemberSellPhotoCard
              key={item.id}
              item={item}
              badgeLabel={t(SHOWCASE_BADGE_KEYS[item.albumBadge] || item.albumBadge, {
                defaultValue: item.albumBadge,
              })}
              onEdit={() => {}}
              onDelete={() => {}}
              onPromote={setPromoteItem}
            />
          ))}
        </section>
      )}

      {filteredItems.length > 0 ? (
        <footer className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
            {t('sellPhotos.showing', {
              from: (currentPage - 1) * SELL_PHOTOS_PAGE_SIZE + 1,
              to: Math.min(currentPage * SELL_PHOTOS_PAGE_SIZE, filteredItems.length),
              total: filteredItems.length,
            })}
          </p>
          <MarketingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t('sellPhotos.paginationAria')}
          />
        </footer>
      ) : null}

      <MemberPromotePanel
        item={promoteItem}
        open={Boolean(promoteItem)}
        onClose={() => setPromoteItem(null)}
        onConfirm={() => setPromoteItem(null)}
      />
    </div>
  );
});

SellPhotosContent.displayName = 'SellPhotosContent';

export default SellPhotosContent;
