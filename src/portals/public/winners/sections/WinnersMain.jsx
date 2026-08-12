import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';
import { ImgIcon, Shell, SitePageLayout, useMonthMenu } from '@/shared/site-chrome';
import {
  matchesWinnerAlbumFilter,
  SHOWCASE_BADGE_KEYS,
  WINNER_BADGE_KEYS,
  WINNER_FILTER_TABS,
  WINNERS_ARCHIVE as WINNERS,
  winnerDetailPath,
} from '@/portals/public/winners/data/winnersArchive';
import {
  FilterPillGroup,
  MarketingPagination,
  PhotoShowcaseCard,
  SectionHeader,
} from '@/shared/ui/marketing';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

const PAGE_SIZE = 8;

const ASSETS = {
  chevron: '/assets/home/chevron-down.svg',
  calendar: '/assets/home/icon-calendar.svg',
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WinnersContent = memo(() => {
  const { t } = useTranslation();
  const [filterTab, setFilterTab] = useState('All Entries');
  const {
    month,
    setMonth,
    open: monthOpen,
    setOpen: setMonthOpen,
    ref: monthRef,
  } = useMonthMenu('July');

  const filteredWinners = useMemo(
    () =>
      WINNERS.filter(
        (item) => item.month === month && matchesWinnerAlbumFilter(item, filterTab),
      ),
    [filterTab, month],
  );

  const {
    currentPage,
    setPage,
    totalPages,
    pagedItems: pagedWinners,
  } = usePaginatedSlice(filteredWinners, PAGE_SIZE, [filterTab, month]);

  const filterItems = WINNER_FILTER_TABS.map((tab) => ({
    value: tab.value,
    label: t(tab.labelKey),
  }));

  return (
    <SitePageLayout
      activeHref={ROUTES.WINNERS}
      rootClassName="winners-page-root"
      announcementTone="blue"
      newsletterVariant="page"
    >
      <section className="bg-white section-py">
        <Shell>
          <SectionHeader
            align="left"
            badge={t('winners.eyebrow')}
            badgeTone="brand"
            title={t('winners.title')}
            description={t('winners.subtitle')}
            end={
              <div className="relative shrink-0 self-start" ref={monthRef}>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={monthOpen}
                  onClick={() => setMonthOpen((open) => !open)}
                  className="inline-flex items-center gap-2.5 rounded bg-[#f0f0f0] px-3 py-2 text-[16px] font-medium text-[#222]"
                >
                  <ImgIcon src={ASSETS.calendar} size={13} />
                  <span>{t(`common.months.${month}`)}</span>
                  <span
                    className={`inline-flex transition ${monthOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <ImgIcon src={ASSETS.chevron} size={24} />
                  </span>
                </button>

                {monthOpen ? (
                  <ul
                    role="listbox"
                    aria-label={t('common.selectMonth')}
                    className="absolute right-0 z-30 mt-2 max-h-64 w-45 overflow-y-auto rounded-lg border border-black/10 bg-white py-1 shadow-[0_12px_30px_rgba(13,13,20,0.12)]"
                  >
                    {MONTHS.map((name) => {
                      const selected = name === month;
                      return (
                        <li key={name} role="option" aria-selected={selected}>
                          <button
                            type="button"
                            onClick={() => {
                              setMonth(name);
                              setMonthOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[14px] font-medium transition ${
                              selected
                                ? 'bg-[#4048cd]/10 text-[#4048cd]'
                                : 'text-[#222] hover:bg-[#f7f8fa]'
                            }`}
                          >
                            <ImgIcon src={ASSETS.calendar} size={12} />
                            {t(`common.months.${name}`)}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            }
          />

          <div className="mt-6 flex flex-col gap-4 lg:mt-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[16px] font-medium uppercase tracking-[0.5px] text-[#222]">
              {t('winners.historicRecords', { count: filteredWinners.length })}
            </p>

            <FilterPillGroup
              items={filterItems}
              value={filterTab}
              onChange={setFilterTab}
              density="compact"
              layout="scroll"
              ariaLabel={t('winners.filterAria', { defaultValue: 'Filter winners by album type' })}
              className="lg:justify-end"
            />
          </div>

          {filteredWinners.length === 0 ? (
            <div className="mt-11 rounded-xl border border-dashed border-black/15 px-6 py-16 text-center">
              <p className="text-[18px] font-bold text-[#0d0d14]">{t('winners.emptyTitle')}</p>
              <p className="mt-2 text-[14px] text-[#6b7280]">{t('winners.emptyBody')}</p>
            </div>
          ) : (
            <>
              <div className="mt-11 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {pagedWinners.map((item) => (
                  <PhotoShowcaseCard
                    key={item.id}
                    href={winnerDetailPath(item.id)}
                    image={item.image}
                    imageAlt={item.title}
                    title={item.title}
                    titleAs="h2"
                    badge={t(SHOWCASE_BADGE_KEYS[item.albumBadge] || item.albumBadge, {
                      defaultValue: item.albumBadge,
                    })}
                    description={item.description}
                    likes={item.votes}
                    views={item.views}
                    date={item.date}
                    winnerRank={t(WINNER_BADGE_KEYS[item.rank] || item.rank, {
                      defaultValue: item.rank,
                    })}
                    extraPhotosLabel={
                      item.extraPhotoCount != null
                        ? t('winners.extraPhotos', { count: item.extraPhotoCount })
                        : undefined
                    }
                  />
                ))}
              </div>
              <MarketingPagination
                className="mt-10"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                ariaLabel={t('winners.paginationAria')}
              />
            </>
          )}
        </Shell>
      </section>
    </SitePageLayout>
  );
});

WinnersContent.displayName = 'WinnersContent';

export default WinnersContent;
