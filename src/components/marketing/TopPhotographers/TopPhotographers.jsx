import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/data-display/Table/Table';
import FilterPillGroup from '@/components/marketing/FilterPillGroup/FilterPillGroup';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  COMPETITIONS_QUERY_KEY,
  getActiveCompetitionsApi,
  getCompetitionWinnersApi,
  getLiveLeaderboardApi,
} from '@/shared/api/competitions.api';
import { ROUTES } from '@/shared/config';
import {
  LEADERBOARD_ALBUM_TAB_LABEL_KEYS,
  LEADERBOARD_ALBUM_TABS,
  LEADERBOARD_MONTHS,
  LEADERBOARD_STANDINGS_YEAR,
} from '@/shared/data/leaderboardStandings';
import {
  AppLink,
  homeAsset,
  ImgIcon,
  Shell,
  useMonthMenu,
} from '@/shared/site-chrome';

const ASSETS = {
  calendar: homeAsset('icon-calendar.svg'),
  chevron: homeAsset('chevron-down.svg'),
  arrowRed: homeAsset('icon-arrow-red.svg'),
};

const getKindFromTab = (tab) => {
  const s = String(tab || '').toUpperCase();
  if (s.includes('12') || s.includes('ZODIAC')) return 'TWELVE';
  if (s.includes('6') || s.includes('SIX')) return 'SIX';
  return 'SINGLE';
};

const tabFromKind = (kind) => {
  const k = String(kind || '').toUpperCase();
  if (k === 'TWELVE') return LEADERBOARD_ALBUM_TABS[2];
  if (k === 'SIX') return LEADERBOARD_ALBUM_TABS[1];
  return LEADERBOARD_ALBUM_TABS[0];
};

const monthNameFromIndex = (month) => {
  const idx = Number(month);
  if (Number.isFinite(idx) && idx >= 1 && idx <= 12) {
    return LEADERBOARD_MONTHS[idx - 1];
  }
  return null;
};

/**
 * Circular photographer avatar with initials fallback when URL is missing or fails.
 */
const PhotographerAvatar = memo(
  ({ src, name, initial, size = 36, className = '', borderClassName = '' }) => {
    const [failed, setFailed] = useState(false);
    const letter =
      initial ||
      (typeof name === 'string' && name.trim() ? name.trim().charAt(0) : '?');
    const showImage = Boolean(src) && !failed;

    return (
      <div
        className={`overflow-hidden rounded-full bg-[#f3f4f6] ${borderClassName} ${className}`.trim()}
        style={{ width: size, height: size }}
      >
        {showImage ? (
          <Image
            src={src}
            alt=""
            width={size}
            height={size}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center bg-[rgba(227,24,55,0.1)] font-bold text-[#e31837]"
            style={{ fontSize: Math.max(12, Math.round(size * 0.28)) }}
          >
            {String(letter).charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  },
);

PhotographerAvatar.displayName = 'PhotographerAvatar';

const LeaderboardPodium = memo(({ winners = [] }) => {
  const { t } = useTranslation();

  const rank1 = winners.find((w) => w.rank === 1 || w.place === 'FIRST');
  const rank2 = winners.find((w) => w.rank === 2 || w.place === 'SECOND');
  const rank3 = winners.find((w) => w.rank === 3 || w.place === 'THIRD');

  const podiumItems = [
    rank2
      ? {
          emoji: '🥈',
          name: rank2.firstName || rank2.name,
          city: rank2.city,
          votesCount: rank2.votes,
          avatar: rank2.avatar,
          size: 64,
          border: 'border-[#e5e7eb]',
          initial: rank2.initial || '?',
        }
      : null,
    rank1
      ? {
          emoji: '🥇',
          name: rank1.firstName || rank1.name,
          city: rank1.city,
          votesCount: rank1.votes,
          avatar: rank1.avatar,
          size: 80,
          border: 'border-[#fdc700]',
          lift: true,
          initial: rank1.initial || '?',
        }
      : null,
    rank3
      ? {
          emoji: '🥉',
          name: rank3.firstName || rank3.name,
          city: rank3.city,
          votesCount: rank3.votes,
          avatar: rank3.avatar,
          size: 64,
          border: 'border-[#fee685]',
          initial: rank3.initial || '?',
        }
      : null,
  ].filter(Boolean);

  if (podiumItems.length === 0) return null;

  return (
    <div className="mb-9 flex items-end justify-center gap-6 sm:gap-10">
      {podiumItems.map((p) => (
        <div
          key={`${p.emoji}-${p.name}`}
          className={`flex w-24 flex-col items-center text-center ${
            p.lift ? '-translate-y-5' : ''
          }`}
        >
          <span className="text-[30px] leading-9">{p.emoji}</span>
          <PhotographerAvatar
            src={p.avatar}
            name={p.name}
            initial={p.initial}
            size={p.size}
            className="mt-2"
            borderClassName={`border-2 ${p.border}`}
          />
          <p
            className={`mt-2 truncate font-bold text-[#0d0d14] ${
              p.lift ? 'text-[16px]' : 'text-[14px]'
            }`}
          >
            {p.name}
          </p>
          {p.city ? (
            <p className="truncate text-[12px] text-[#6b7280]">{p.city}</p>
          ) : null}
          <p className="mt-1 text-[14px] font-bold text-[#e31837]">
            {t('home.winners.votesLabel', {
              count:
                typeof p.votesCount === 'number'
                  ? p.votesCount.toLocaleString('en-US')
                  : p.votesCount,
              defaultValue: `${typeof p.votesCount === 'number' ? p.votesCount.toLocaleString('en-US') : p.votesCount} votes`,
            })}
          </p>
        </div>
      ))}
    </div>
  );
});

LeaderboardPodium.displayName = 'LeaderboardPodium';

const LeaderboardStandings = memo(({ rows = [] }) => {
  const { t } = useTranslation();

  if (rows.length === 0) return null;

  return (
    <>
      {/* Mobile Card View */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row, idx) => {
          const rankDisplay =
            row.rank === 1
              ? '🥇'
              : row.rank === 2
                ? '🥈'
                : row.rank === 3
                  ? '🥉'
                  : String(row.rank ?? idx + 1);

          return (
            <article
              key={row.id || `${row.name}-${idx}`}
              className="rounded-2xl border border-black/20 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 shrink-0 text-center text-[16px] font-extrabold ${
                    rankDisplay.length <= 2
                      ? 'text-[#e31837]'
                      : 'text-[#6b7280]'
                  }`}
                >
                  {rankDisplay}
                </span>
                <PhotographerAvatar
                  src={row.avatar}
                  name={row.name}
                  initial={row.initial}
                  size={40}
                  className="shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[#0d0d14]">
                    {row.name}
                  </p>
                  <p className="text-[12px] text-[#6b7280]">
                    {row.city || row.country || '—'}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-[13px]">
                <span className="text-[#6b7280]">
                  {t('common.votes')}:{' '}
                  <span className="font-extrabold text-[#0d0d14]">
                    {typeof row.votes === 'number'
                      ? row.votes.toLocaleString('en-US')
                      : row.votes}
                  </span>
                </span>
                <span className="text-[#6b7280]">
                  {t('common.points')}:{' '}
                  <span className="text-[#0d0d14]">
                    {typeof row.points === 'number'
                      ? row.points.toLocaleString('en-US')
                      : row.points}
                  </span>
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto rounded-2xl border border-black/20 bg-white md:block">
        <Table className="w-full min-w-160 table-fixed">
          <TableHeader>
            <TableRow
              isHeader
              className="border-b border-black/20 bg-[#f7f8fa]"
            >
              <TableHead className="w-1/5 text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
                {t('common.rank')}
              </TableHead>
              <TableHead className="w-1/5 text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
                {t('common.photographer')}
              </TableHead>
              <TableHead className="w-1/5 text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
                {t('common.city')}
              </TableHead>
              <TableHead className="w-1/5 text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
                {t('common.votes')}
              </TableHead>
              <TableHead className="w-1/5 text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
                {t('common.points')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => {
              const rankDisplay =
                row.rank === 1
                  ? '🥇'
                  : row.rank === 2
                    ? '🥈'
                    : row.rank === 3
                      ? '🥉'
                      : String(row.rank ?? idx + 1);

              return (
                <TableRow
                  key={row.id || `${row.name}-${idx}`}
                  className="border-b border-black/20 last:border-b-0"
                >
                  <TableCell
                    className={`text-[16px] font-extrabold ${
                      rankDisplay.length <= 2
                        ? 'text-[#e31837]'
                        : 'text-[#6b7280]'
                    }`}
                  >
                    {rankDisplay}
                  </TableCell>
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <PhotographerAvatar
                        src={row.avatar}
                        name={row.name}
                        initial={row.initial}
                        size={36}
                        className="shrink-0"
                      />
                      <span className="truncate text-[14px] font-bold text-[#0d0d14]">
                        {row.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[14px] text-[#6b7280]">
                    {row.city || row.country || '—'}
                  </TableCell>
                  <TableCell className="text-[14px] font-extrabold text-[#0d0d14]">
                    {typeof row.votes === 'number'
                      ? row.votes.toLocaleString('en-US')
                      : row.votes}
                  </TableCell>
                  <TableCell className="text-[14px] text-[#6b7280]">
                    {typeof row.points === 'number'
                      ? row.points.toLocaleString('en-US')
                      : row.points}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
});

LeaderboardStandings.displayName = 'LeaderboardStandings';

const LeaderboardPageFilters = memo(
  ({
    albumTab,
    onAlbumTabChange,
    monthMenu,
    onMonthChange,
    isFetching = false,
  }) => {
    const { t } = useTranslation();
    const {
      month,
      setMonth,
      open: monthOpen,
      setOpen: setMonthOpen,
      ref: monthRef,
    } = monthMenu;

    const selectMonth = onMonthChange || setMonth;

    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <FilterPillGroup
          density="compact"
          items={LEADERBOARD_ALBUM_TABS.map((tab) => ({
            id: tab,
            value: tab,
            label: t(LEADERBOARD_ALBUM_TAB_LABEL_KEYS[tab]),
          }))}
          value={albumTab}
          onChange={onAlbumTabChange}
          ariaLabel={t('leaderboard.title')}
        />

        <div className="relative self-start sm:self-auto" ref={monthRef}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={monthOpen}
            onClick={() => setMonthOpen((open) => !open)}
            className="inline-flex cursor-pointer items-center gap-2.5 rounded bg-[#f0f0f0] px-3 py-2 text-[16px] font-medium text-[#222] transition hover:bg-[#e6e6e6]"
          >
            {isFetching ? (
              <RefreshCw size={13} className="animate-spin text-[#ee1c25]" />
            ) : (
              <ImgIcon src={ASSETS.calendar} size={13} />
            )}
            <span>{t(`common.months.${month}`, month)}</span>
            <span
              className={`inline-flex transition-transform duration-200 ${
                monthOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            >
              <ImgIcon src={ASSETS.chevron} size={24} />
            </span>
          </button>

          {monthOpen ? (
            <ul
              role="listbox"
              aria-label={t('common.selectMonth')}
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute right-0 z-50 mt-2 max-h-64 w-48 overflow-y-auto rounded-lg border border-black/10 bg-white py-1 shadow-[0_12px_30px_rgba(13,13,20,0.12)]"
            >
              {LEADERBOARD_MONTHS.map((name) => {
                const selected =
                  String(name).toLowerCase() === String(month).toLowerCase();
                return (
                  <li key={name} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectMonth(name);
                        setMonthOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5 text-left text-[14px] font-medium transition ${
                        selected
                          ? 'bg-[#4048cd]/10 font-bold text-[#4048cd]'
                          : 'text-[#222] hover:bg-[#f7f8fa]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ImgIcon src={ASSETS.calendar} size={12} />
                        {t(`common.months.${name}`, name)}
                      </span>
                      {selected ? (
                        <span className="text-[12px] text-[#4048cd] font-bold">
                          ✓
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    );
  },
);

LeaderboardPageFilters.displayName = 'LeaderboardPageFilters';

/**
 * Shared Top Photographers / Leaderboard UI.
 * - home: eyebrow + Full leaderboard CTA
 * - page: album tabs + month picker (navbar Leaderboard)
 */
const TopPhotographers = memo(({ variant = 'home' }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const isPage = variant === 'page';

  const queryKind = isPage ? searchParams.get('kind') : null;
  const queryMonth = isPage ? searchParams.get('month') : null;
  const queryYear = isPage ? searchParams.get('year') : null;

  const [albumTab, setAlbumTab] = useState(() =>
    tabFromKind(queryKind),
  );
  const monthMenu = useMonthMenu(
    monthNameFromIndex(queryMonth) || 'September',
  );
  const [standingsYear, setStandingsYear] = useState(() => {
    const y = Number(queryYear);
    return Number.isFinite(y) && y >= 2000 ? y : LEADERBOARD_STANDINGS_YEAR;
  });
  const [useLiveStandings, setUseLiveStandings] = useState(
    () => !queryMonth && !queryYear,
  );

  const { data: activeCompetitions = [] } = useQuery({
    queryKey: [...COMPETITIONS_QUERY_KEY, 'active-open'],
    queryFn: () => getActiveCompetitionsApi(),
    staleTime: 60 * 1000,
  });

  const openCompetition = activeCompetitions[0] || null;

  // Sync month UI to the running OPEN competition when showing live standings
  useEffect(() => {
    if (!openCompetition?.month || !openCompetition?.year) return;
    if (!useLiveStandings && isPage) return;
    const monthName = monthNameFromIndex(openCompetition.month);
    if (monthName) monthMenu.setMonth(monthName);
    setStandingsYear(openCompetition.year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCompetition?.month, openCompetition?.year, useLiveStandings, isPage]);

  useEffect(() => {
    if (!isPage) return;
    if (queryKind) setAlbumTab(tabFromKind(queryKind));
    const monthName = monthNameFromIndex(queryMonth);
    if (monthName) {
      monthMenu.setMonth(monthName);
      setUseLiveStandings(false);
    }
    const y = Number(queryYear);
    if (Number.isFinite(y) && y >= 2000) {
      setStandingsYear(y);
      setUseLiveStandings(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from URL only
  }, [isPage, queryKind, queryMonth, queryYear]);

  const monthIndex = useMemo(() => {
    const target = String(monthMenu.month || '')
      .trim()
      .toLowerCase();
    const idx = LEADERBOARD_MONTHS.findIndex((m) => m.toLowerCase() === target);
    return idx !== -1 ? idx + 1 : 9;
  }, [monthMenu.month]);

  const kind = getKindFromTab(albumTab);

  // Home always shows the running OPEN competition.
  // Leaderboard page defaults to live; choosing a month loads that period.
  const isLiveQuery = !isPage || useLiveStandings;

  const {
    data: winners = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      ...COMPETITIONS_QUERY_KEY,
      'leaderboard',
      isLiveQuery ? 'live' : 'month',
      kind,
      isLiveQuery ? null : standingsYear,
      isLiveQuery ? null : monthIndex,
    ],
    queryFn: () =>
      isLiveQuery
        ? getLiveLeaderboardApi({ kind, limit: 10 })
        : getCompetitionWinnersApi({
            kind,
            year: standingsYear,
            month: monthIndex,
            page: 1,
            limit: 10,
          }),
    staleTime: 60 * 1000,
  });

  const handleMonthChange = (name) => {
    monthMenu.setMonth(name);
    const openMonthName = monthNameFromIndex(openCompetition?.month);
    const openYear = openCompetition?.year;
    if (
      openMonthName &&
      openYear &&
      String(name).toLowerCase() === String(openMonthName).toLowerCase() &&
      standingsYear === openYear
    ) {
      setUseLiveStandings(true);
      return;
    }
    setUseLiveStandings(false);
  };

  const liveStandings = !isPage
    ? t('home.leaderboard.liveStandings', {
        month: t(`common.months.${monthMenu.month}`, monthMenu.month),
        year: standingsYear,
        defaultValue: `${monthMenu.month} ${standingsYear} live standings`,
      })
    : isLiveQuery
      ? t('leaderboard.liveStandings', {
          month: t(`common.months.${monthMenu.month}`, monthMenu.month),
          year: standingsYear,
          defaultValue: `Live standings for ${monthMenu.month} ${standingsYear}`,
        })
      : t('leaderboard.closedStandings', {
          month: t(`common.months.${monthMenu.month}`, monthMenu.month),
          year: standingsYear,
          defaultValue: `Final standings for ${monthMenu.month} ${standingsYear}`,
        });

  return (
    <section className="bg-[#f7f8fa] section-py">
      <Shell>
        <SectionHeader
          className={`mb-11 ${isPage ? 'xl:mb-11' : ''}`}
          align="left"
          badge={t('home.leaderboard.eyebrow', 'Leaderboard')}
          badgeTone="brand"
          title={
            isPage
              ? t('leaderboard.title', 'Top Photographers')
              : t('home.leaderboard.title', 'Top Photographers')
          }
          description={liveStandings}
          end={
            isPage ? (
              <LeaderboardPageFilters
                albumTab={albumTab}
                onAlbumTabChange={setAlbumTab}
                monthMenu={monthMenu}
                onMonthChange={handleMonthChange}
                isFetching={isFetching}
              />
            ) : (
              <MarketingButton
                as={AppLink}
                href={ROUTES.LEADERBOARD}
                variant="ghost"
                icon={ASSETS.arrowRed}
              >
                {t('home.leaderboard.fullLeaderboard', 'Full leaderboard')}
              </MarketingButton>
            )
          }
        />

        {isLoading ? (
          <div className="space-y-6">
            <div className="mb-9 flex items-end justify-center gap-6 sm:gap-10">
              <div className="flex w-24 flex-col items-center">
                <div className="size-16 animate-pulse rounded-full bg-black/10" />
                <div className="mt-2 h-4 w-16 animate-pulse rounded bg-black/10" />
              </div>
              <div className="flex w-24 -translate-y-5 flex-col items-center">
                <div className="size-20 animate-pulse rounded-full bg-black/10" />
                <div className="mt-2 h-4 w-20 animate-pulse rounded bg-black/10" />
              </div>
              <div className="flex w-24 flex-col items-center">
                <div className="size-16 animate-pulse rounded-full bg-black/10" />
                <div className="mt-2 h-4 w-16 animate-pulse rounded bg-black/10" />
              </div>
            </div>
            <div className="h-64 animate-pulse rounded-2xl bg-black/5" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center sm:p-12">
            <AlertCircle size={36} className="text-red-500" />
            <p className="mt-3 text-[16px] font-bold text-[#0d0d14]">
              {t('leaderboard.errorTitle', 'Could not load leaderboard')}
            </p>
            <p className="mt-1 text-[14px] text-[#6b7280]">
              {getApiErrorMessage(
                error,
                t('common.errors.general', 'Please try again.'),
              )}
            </p>
            <Button
              unstyled
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#ee1c25] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#d61820]"
            >
              <RefreshCw size={15} />
              <span>{t('common.retry', 'Try again')}</span>
            </Button>
          </div>
        ) : winners.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-white p-8 text-center sm:p-12">
            <p className="text-[16px] font-semibold text-[#111827]">
              {t(
                'leaderboard.emptyTitle',
                'No leaderboard standings for this period',
              )}
            </p>
            <p className="mt-1 text-[14px] text-[#6b7280]">
              {isLiveQuery
                ? t(
                    'leaderboard.emptyLiveSubtitle',
                    'No votes yet for the running competition. Check back soon or try another album format.',
                  )
                : t(
                    'leaderboard.emptySubtitle',
                    'Select another month or album format to see competition results.',
                  )}
            </p>
          </div>
        ) : (
          <div
            className={`transition-opacity duration-200 ${
              isFetching && !isLoading
                ? 'opacity-50 pointer-events-none'
                : 'opacity-100'
            }`}
          >
            <LeaderboardPodium winners={winners} />
            <LeaderboardStandings rows={winners} />
          </div>
        )}
      </Shell>
    </section>
  );
});

TopPhotographers.displayName = 'TopPhotographers';

export default TopPhotographers;
