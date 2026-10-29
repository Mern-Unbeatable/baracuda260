import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  getCompetitionWinnersApi,
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

const ALBUM_TAB_TO_KIND = {
  'Single Photo': 'SINGLE',
  '6 Photos': 'SIX',
  '12 photos - full Zodiac Story': 'TWELVE',
};

const LeaderboardPodium = memo(({ winners = [] }) => {
  const { t } = useTranslation();

  const rank1 = winners.find((w) => w.rank === 1 || w.place === 'FIRST');
  const rank2 = winners.find((w) => w.rank === 2 || w.place === 'SECOND');
  const rank3 = winners.find((w) => w.rank === 3 || w.place === 'THIRD');

  const podiumItems = [
    rank2
      ? {
          emoji: '🥈',
          name: rank2.name,
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
          name: rank1.name,
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
          name: rank3.name,
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
          <div
            className={`mt-2 overflow-hidden rounded-full border-2 bg-[#f3f4f6] ${p.border}`}
            style={{ width: p.size, height: p.size }}
          >
            {p.avatar ? (
              <Image
                src={p.avatar}
                alt={p.name}
                width={p.size}
                height={p.size}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-[rgba(227,24,55,0.1)] text-[18px] font-bold text-[#e31837]">
                {p.initial}
              </span>
            )}
          </div>
          <p
            className={`mt-2 font-bold text-[#0d0d14] ${
              p.lift ? 'text-[16px]' : 'text-[14px]'
            }`}
          >
            {p.name}
          </p>
          {p.city ? (
            <p className="text-[12px] text-[#6b7280]">{p.city}</p>
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
                {row.avatar ? (
                  <Image
                    src={row.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[rgba(227,24,55,0.1)] text-[12px] font-bold text-[#e31837]">
                    {row.initial || row.name?.charAt(0) || '?'}
                  </span>
                )}
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
                      {row.avatar ? (
                        <Image
                          src={row.avatar}
                          alt=""
                          width={36}
                          height={36}
                          className="size-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(227,24,55,0.1)] text-[12px] font-bold text-[#e31837]">
                          {row.initial || row.name?.charAt(0) || '?'}
                        </span>
                      )}
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
  ({ albumTab, onAlbumTabChange, monthMenu }) => {
    const { t } = useTranslation();
    const {
      month,
      setMonth,
      open: monthOpen,
      setOpen: setMonthOpen,
      ref: monthRef,
    } = monthMenu;

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
          <Button
            unstyled
            type="button"
            aria-haspopup="listbox"
            aria-expanded={monthOpen}
            onClick={() => setMonthOpen((open) => !open)}
            className="inline-flex cursor-pointer items-center gap-2.5 rounded bg-[#f0f0f0] px-3 py-2 text-[16px] font-medium text-[#222]"
          >
            <ImgIcon src={ASSETS.calendar} size={13} />
            <span>{t(`common.months.${month}`, month)}</span>
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
              {LEADERBOARD_MONTHS.map((name) => {
                const selected = name === month;
                return (
                  <li key={name} role="option" aria-selected={selected}>
                    <Button
                      unstyled
                      type="button"
                      onClick={() => {
                        setMonth(name);
                        setMonthOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-[14px] font-medium transition ${
                        selected
                          ? 'bg-[#4048cd]/10 text-[#4048cd]'
                          : 'text-[#222] hover:bg-[#f7f8fa]'
                      }`}
                    >
                      <ImgIcon src={ASSETS.calendar} size={12} />
                      {t(`common.months.${name}`, name)}
                    </Button>
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
  const isPage = variant === 'page';
  const [albumTab, setAlbumTab] = useState(LEADERBOARD_ALBUM_TABS[0]);
  const monthMenu = useMonthMenu('September');

  const monthIndex = useMemo(() => {
    const idx = LEADERBOARD_MONTHS.indexOf(monthMenu.month);
    return idx !== -1 ? idx + 1 : 9;
  }, [monthMenu.month]);

  const kind = ALBUM_TAB_TO_KIND[albumTab] || 'SINGLE';

  const {
    data: winners = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      ...COMPETITIONS_QUERY_KEY,
      'leaderboard',
      kind,
      LEADERBOARD_STANDINGS_YEAR,
      monthIndex,
    ],
    queryFn: () =>
      getCompetitionWinnersApi({
        kind,
        year: LEADERBOARD_STANDINGS_YEAR,
        month: monthIndex,
        page: 1,
        limit: 10,
      }),
    staleTime: 60 * 1000,
  });

  const liveStandings = isPage
    ? t('leaderboard.liveStandings', {
        month: t(`common.months.${monthMenu.month}`, monthMenu.month),
        year: LEADERBOARD_STANDINGS_YEAR,
        defaultValue: `Live standings for ${monthMenu.month} ${LEADERBOARD_STANDINGS_YEAR}`,
      })
    : t('home.leaderboard.liveStandings', {
        defaultValue: 'Finalized monthly rankings and top photographers.',
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
              {t(
                'leaderboard.emptySubtitle',
                'Select another month or album format to see competition results.',
              )}
            </p>
          </div>
        ) : (
          <>
            <LeaderboardPodium winners={winners} />
            <LeaderboardStandings rows={winners} />
          </>
        )}
      </Shell>
    </section>
  );
});

TopPhotographers.displayName = 'TopPhotographers';

export default TopPhotographers;
