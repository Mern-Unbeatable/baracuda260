import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination/Pagination';
import PhotoShowcaseCard from '@/components/data-display/PhotoShowcaseCard/PhotoShowcaseCard';
import FilterPillGroup from '@/components/marketing/FilterPillGroup/FilterPillGroup';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import Button from '@/components/ui/Button';
import {
  SHOWCASE_BADGE_KEYS,
  WINNER_BADGE_KEYS,
  WINNER_FILTER_TABS,
} from '@/portals/public/winners/data/winnersArchive';
import {
  COMPETITIONS_QUERY_KEY,
  getWinnersArchiveApi,
} from '@/shared/api/competitions.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { ROUTES } from '@/shared/config';
import {
  ImgIcon,
  Shell,
  SitePageLayout,
  useMonthMenu,
} from '@/shared/site-chrome';

const PAGE_SIZE = 12;

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

const filterTabToKind = (filterTab) => {
  if (filterTab === 'Single Photo') return 'SINGLE';
  if (filterTab === '6 Photos') return 'SIX';
  if (filterTab === '12 photos - full Zodiac Story') return 'TWELVE';
  return 'ALL';
};

const defaultMonthName = () => {
  const prev = new Date();
  prev.setMonth(prev.getMonth() - 1);
  return MONTHS[prev.getMonth()];
};

const WinnersContent = memo(() => {
  const { t } = useTranslation();
  const [filterTab, setFilterTab] = useState('All Entries');
  const [page, setPage] = useState(1);
  const {
    month,
    setMonth,
    open: monthOpen,
    setOpen: setMonthOpen,
    ref: monthRef,
  } = useMonthMenu(defaultMonthName());

  const monthNumber = MONTHS.indexOf(month) + 1;
  const year = useMemo(() => {
    const now = new Date();
    // If selected month is after the current month, treat it as previous year
    if (monthNumber > now.getMonth() + 1) return now.getFullYear() - 1;
    return now.getFullYear();
  }, [monthNumber]);

  const kind = filterTabToKind(filterTab);

  const {
    data: winnersResult,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      ...COMPETITIONS_QUERY_KEY,
      'winners-archive',
      { year, month: monthNumber, kind, page, limit: PAGE_SIZE },
    ],
    queryFn: () =>
      getWinnersArchiveApi({
        year,
        month: monthNumber,
        kind,
        page,
        limit: PAGE_SIZE,
      }),
    placeholderData: (previous) => previous,
    staleTime: 60 * 1000,
  });

  const winners = winnersResult?.data || [];
  const meta = winnersResult?.meta || {
    currentPage: page,
    totalPages: 1,
    totalRecords: winners.length,
  };

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
                <Button
                  unstyled
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
                </Button>

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
                          <Button
                            unstyled
                            type="button"
                            onClick={() => {
                              setMonth(name);
                              setMonthOpen(false);
                              setPage(1);
                            }}
                            className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[14px] font-medium transition ${
                              selected
                                ? 'bg-[#4048cd]/10 text-[#4048cd]'
                                : 'text-[#222] hover:bg-[#f7f8fa]'
                            }`}
                          >
                            <ImgIcon src={ASSETS.calendar} size={12} />
                            {t(`common.months.${name}`)}
                          </Button>
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
              {t('winners.historicRecords', {
                count: meta.totalRecords ?? winners.length,
              })}
              {isFetching && !isLoading ? (
                <Loader2
                  size={14}
                  className="ml-2 inline animate-spin text-[#4048cd]"
                  aria-hidden="true"
                />
              ) : null}
            </p>

            <FilterPillGroup
              items={filterItems}
              value={filterTab}
              onChange={(next) => {
                setFilterTab(next);
                setPage(1);
              }}
              density="compact"
              layout="scroll"
              ariaLabel={t('winners.filterAria', {
                defaultValue: 'Filter winners by album type',
              })}
              className="lg:justify-end"
            />
          </div>

          {isLoading ? (
            <div className="mt-11 flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-[#e5e7eb] bg-[#f9fafb]">
              <Loader2
                size={28}
                className="animate-spin text-[#4048cd]"
                aria-hidden="true"
              />
              <p className="text-[14px] text-[#6b7280]">
                {t('common.loading', 'Loading...')}
              </p>
            </div>
          ) : isError ? (
            <div className="mt-11 flex flex-col items-center justify-center gap-3 rounded-xl border border-[#fee2e2] bg-[#fef2f2] px-6 py-16 text-center">
              <AlertCircle size={28} className="text-[#ee1c25]" />
              <p className="text-[16px] font-semibold text-[#111827]">
                {getApiErrorMessage(
                  error,
                  t('winners.error', 'Could not load winners.'),
                )}
              </p>
              <Button
                unstyled
                type="button"
                onClick={() => refetch()}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0d0d14] px-4 py-2 text-[14px] font-medium text-white"
              >
                <RefreshCw size={14} aria-hidden="true" />
                {t('common.retry', 'Try again')}
              </Button>
            </div>
          ) : winners.length === 0 ? (
            <div className="mt-11 rounded-xl border border-dashed border-black/15 px-6 py-16 text-center">
              <p className="text-[18px] font-bold text-[#0d0d14]">
                {t('winners.emptyTitle')}
              </p>
              <p className="mt-2 text-[14px] text-[#6b7280]">
                {t('winners.emptyBody')}
              </p>
            </div>
          ) : (
            <>
              <div className="mt-11 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {winners.map((item) => (
                  <PhotoShowcaseCard
                    key={item.id}
                    id={item.submissionId || item.id}
                    href={item.href}
                    image={item.image}
                    imageAlt={item.title}
                    title={item.title}
                    titleAs="h2"
                    badge={t(
                      SHOWCASE_BADGE_KEYS[item.albumBadge] || item.albumBadge,
                      {
                        defaultValue: item.albumBadge,
                      },
                    )}
                    description={item.description}
                    likes={item.votes}
                    views={item.views}
                    date={item.date}
                    winnerRank={t(WINNER_BADGE_KEYS[item.rank] || item.rank, {
                      defaultValue: item.rank,
                    })}
                    extraPhotosLabel={
                      item.extraPhotoCount != null
                        ? t('winners.extraPhotos', {
                            count: item.extraPhotoCount,
                          })
                        : undefined
                    }
                    engagementDisabled
                  />
                ))}
              </div>
              {meta.totalPages > 1 ? (
                <Pagination
                  className="mt-10"
                  currentPage={meta.currentPage || page}
                  totalPages={meta.totalPages}
                  onPageChange={setPage}
                  ariaLabel={t('winners.paginationAria')}
                />
              ) : null}
            </>
          )}
        </Shell>
      </section>
    </SitePageLayout>
  );
});

WinnersContent.displayName = 'WinnersContent';

export default WinnersContent;
