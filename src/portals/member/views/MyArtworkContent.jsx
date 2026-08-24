import { useTranslation } from 'react-i18next';
import React, { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import FilterPillGroup from '@/components/marketing/FilterPillGroup/FilterPillGroup';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberArtworkCard from '@/components/data-display/MemberArtworkCard/MemberArtworkCard';
import MemberArtworkStatCard from '@/components/data-display/MemberArtworkStatCard/MemberArtworkStatCard';
import MemberFilterSelect from '@/portals/member/components/member-artwork/MemberFilterSelect';
import MemberPromotePanel from '@/components/forms/MemberPromotePanel/MemberPromotePanel';
import {
  matchesMyArtworkFilter,
  matchesMyArtworkStatus,
  MY_ARTWORK_FILTER_TABS,
  MY_ARTWORK_ITEMS,
  MY_ARTWORK_PAGE_SIZE,
  MY_ARTWORK_SORT_OPTIONS,
  MY_ARTWORK_STATS,
  MY_ARTWORK_STATUS_FILTERS,
  sortMyArtworkItems,
} from '@/portals/member/data/myArtworkData';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const MyArtworkContent = memo(() => {
  const { t } = useTranslation();
  const [filterTab, setFilterTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [promoteItem, setPromoteItem] = useState(null);

  const filterItems = MY_ARTWORK_FILTER_TABS.map((tab) => ({
    value: tab.value,
    label: t(tab.labelKey),
  }));

  const filteredItems = useMemo(() => {
    const filtered = MY_ARTWORK_ITEMS.filter(
      (item) => matchesMyArtworkFilter(item, filterTab) && matchesMyArtworkStatus(item, statusFilter),
    );
    return sortMyArtworkItems(filtered, sort);
  }, [filterTab, sort, statusFilter]);

  const {
    currentPage,
    setPage,
    totalPages,
    pagedItems,
  } = usePaginatedSlice(filteredItems, MY_ARTWORK_PAGE_SIZE, [filterTab, statusFilter, sort]);

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
            {t('myArtwork.title')}
          </h1>
          <p className="max-w-[960px] text-[15px] leading-6 text-[#494453] sm:text-[16px]">
            {t('myArtwork.subtitle')}
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN_MY_ARTWORK_UPLOAD}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#ee1c25] px-5 py-2.5 text-[16px] leading-6 text-white shadow-sm transition hover:bg-[#d41921]"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          {t('myArtwork.uploadCta')}
        </Link>
      </header>

      <section
        aria-label={t('myArtwork.stats.aria')}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:gap-5"
      >
        {MY_ARTWORK_STATS.map((stat) => (
          <MemberArtworkStatCard key={stat.id} {...stat} />
        ))}
      </section>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterPillGroup
          items={filterItems}
          value={filterTab}
          onChange={(value) => {
            setFilterTab(value);
            setPage(1);
          }}
          density="compact"
          layout="scroll"
          ariaLabel={t('myArtwork.filters.aria')}
          className="lg:max-w-3xl"
        />

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <MemberFilterSelect
            label={t('myArtwork.statusFilterAria')}
            value={statusFilter}
            options={MY_ARTWORK_STATUS_FILTERS}
            optionKeyPrefix="myArtwork.statusOptions"
            prefixLabelKey="myArtwork.sortByPrefix"
            open={statusOpen}
            onToggle={() => {
              setStatusOpen((open) => !open);
              setSortOpen(false);
            }}
            onClose={() => setStatusOpen(false)}
            onSelect={(value) => {
              setStatusFilter(value);
              setStatusOpen(false);
              setPage(1);
            }}
          />
          <MemberFilterSelect
            label={t('myArtwork.sortFilterAria')}
            value={sort}
            options={MY_ARTWORK_SORT_OPTIONS}
            optionKeyPrefix="myArtwork.sortOptions"
            showFilterIcon={false}
            open={sortOpen}
            onToggle={() => {
              setSortOpen((open) => !open);
              setStatusOpen(false);
            }}
            onClose={() => setSortOpen(false)}
            onSelect={(value) => {
              setSort(value);
              setSortOpen(false);
              setPage(1);
            }}
          />
        </div>
      </div>

      {pagedItems.length === 0 ? (
        <p className="text-[16px] text-[#494453]" role="status">
          {t('myArtwork.empty')}
        </p>
      ) : (
        <section
          aria-label={t('myArtwork.gridAria')}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {pagedItems.map((item) => (
            <MemberArtworkCard
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
            {t('myArtwork.showing', {
              from: (currentPage - 1) * MY_ARTWORK_PAGE_SIZE + 1,
              to: Math.min(currentPage * MY_ARTWORK_PAGE_SIZE, filteredItems.length),
              total: filteredItems.length,
            })}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t('myArtwork.paginationAria')}
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

MyArtworkContent.displayName = 'MyArtworkContent';

export default MyArtworkContent;
