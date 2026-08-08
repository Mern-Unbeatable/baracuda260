import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';
import { ImgIcon, Shell, SitePageLayout, useMonthMenu, AppLink } from '@/shared/site-chrome';
import {
  WINNER_BADGE_KEYS,
  WINNERS_ARCHIVE as WINNERS,
  winnerDetailPath,
} from '@/modules/public/winners/data/winnersArchive';
import { MarketingPagination, SectionHeader } from '@/shared/ui/marketing';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

const A = '/assets/home';
const PAGE_SIZE = 8;

const ASSETS = {
  logo: `${A}/logo.png`,
  logoFooter: `${A}/logo-footer.png`,
  chevron: `${A}/chevron-down.svg`,
  mail: `${A}/icon-mail.svg`,
  ig: `${A}/icon-ig.svg`,
  fb: `${A}/icon-fb.svg`,
  x: `${A}/icon-x.svg`,
  newsletterBg: `${A}/newsletter-bg.png`,
  calendar: `${A}/icon-calendar.svg`,
  trophy: `${A}/icon-trophy-cup.svg`,
  badge: `${A}/icon-badge.svg`,
};

const FILTER_TABS = ['All Entries', 'Single Photo', '6 Photos', '12 photos - full Zodiac Story'];

const FILTER_TAB_LABEL_KEYS = {
  'All Entries': 'common.allEntries',
  'Single Photo': 'common.singlePhoto',
  '6 Photos': 'common.sixPhotos',
  '12 photos - full Zodiac Story': 'common.twelveZodiac',
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

const WinnerCard = memo(({ item, t }) => (
  <AppLink
    href={winnerDetailPath(item.id)}
    className="group flex flex-col overflow-hidden rounded-xl bg-[#f4f4f4] transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4048cd]"
  >
    <article className="flex h-full flex-col">
      <div className="relative h-[220px] overflow-hidden sm:h-[254px]">
      <img
        src={item.image}
        alt={item.title}
        width={369}
        height={254}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="absolute left-[13px] top-[15px] inline-flex items-center gap-2 rounded bg-black/50 px-[7px] py-1">
        <ImgIcon src={item.badgeIcon === 'trophy' ? ASSETS.trophy : ASSETS.badge} size={18} />
        <span className="text-[14px] leading-6 text-[#fdc700]">
          {t(WINNER_BADGE_KEYS[item.badge] || item.badge, { defaultValue: item.badge })}
        </span>
      </div>
      <div className="absolute bottom-4 right-4 rounded-lg bg-black/55 px-2 py-1">
        <span className="text-[14px] leading-6 text-white sm:text-[16px]">{item.date}</span>
      </div>
      </div>
      <div className="flex flex-col gap-6 px-4 py-6">
        <div>
          <p className="text-[14px] font-medium leading-6 text-[#42444a] sm:text-[16px]">
            {t('common.themeSilentStreets')}
          </p>
          <h2 className="mt-1 text-[22px] font-semibold leading-tight text-[#0d0d14] sm:text-[24px]">
            {item.title}
          </h2>
        </div>
        <div>
          <div className="h-px w-full bg-black/15" />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[14px] leading-6 text-[#2c2e30] sm:text-[16px]">
              {t('common.categorySingleShort')}
            </p>
            <p className="shrink-0 text-[16px] font-semibold text-[#25252b] sm:text-[18px]">
              {item.votes}
            </p>
          </div>
        </div>
      </div>
    </article>
  </AppLink>
));
WinnerCard.displayName = 'WinnerCard';

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

  const filteredWinners = useMemo(() => {
    return WINNERS.filter((item) => {
      const albumOk = filterTab === 'All Entries' || item.album === filterTab;
      const monthOk = item.month === month || month === 'July';
      if (month === 'July') return albumOk;
      return albumOk && monthOk;
    });
  }, [filterTab, month]);

  const {
    currentPage,
    setPage,
    totalPages,
    pagedItems: pagedWinners,
  } = usePaginatedSlice(filteredWinners, PAGE_SIZE, [filterTab, month]);

  return (
    <SitePageLayout
      activeHref={ROUTES.WINNERS}
      rootClassName="winners-page-root"
      announcementTone="blue"
      newsletterVariant="page"
    >
      {/* Archive */}
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

                {monthOpen && (
                  <ul
                    role="listbox"
                    aria-label={t('common.selectMonth')}
                    className="absolute right-0 z-30 mt-2 max-h-64 w-[180px] overflow-y-auto rounded-lg border border-black/10 bg-white py-1 shadow-[0_12px_30px_rgba(13,13,20,0.12)]"
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
                )}
              </div>
            }
          />

          <div className="mt-6 flex flex-col gap-4 lg:mt-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex items-center gap-2.5 text-[16px] font-medium text-[#222]">
              <ImgIcon src={ASSETS.calendar} size={13} />
              <span>{t('winners.historicRecords', { count: filteredWinners.length })}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {FILTER_TABS.map((tab) => {
                const active = filterTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterTab(tab)}
                    className={`rounded-full px-4 py-2 text-[14px] font-semibold capitalize transition ${
                      active
                        ? 'bg-[#4048cd] text-white'
                        : 'bg-[#f2f2f2] text-[#6b7280] hover:text-[#0d0d14]'
                    } ${tab.startsWith('12') && !active ? 'text-[#0d0d14]' : ''}`}
                  >
                    {t(FILTER_TAB_LABEL_KEYS[tab])}
                  </button>
                );
              })}
            </div>
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
                  <WinnerCard key={item.id} item={item} t={t} />
                ))}
              </div>
              <MarketingPagination
                className="mt-10"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                ariaLabel={t('winners.paginationAria', { defaultValue: 'Winners pagination' })}
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
