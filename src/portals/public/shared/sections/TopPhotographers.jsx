import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { ROUTES } from '@/shared/config';
import {
  LEADERBOARD_MONTHS,
  LEADERBOARD_PODIUM,
  LEADERBOARD_ROWS,
  LEADERBOARD_STANDINGS_YEAR,
  LEADERBOARD_ALBUM_TABS,
  LEADERBOARD_ALBUM_TAB_LABEL_KEYS,
} from '@/shared/data/leaderboardStandings';
import { AppLink, ImgIcon, Shell, homeAsset, useMonthMenu } from '@/shared/site-chrome';
import { FilterPillGroup, MarketingButton, SectionHeader } from '@/shared/ui/marketing';

const ASSETS = {
  calendar: homeAsset('icon-calendar.svg'),
  chevron: homeAsset('chevron-down.svg'),
  arrowRed: homeAsset('icon-arrow-red.svg'),
};

const LeaderboardPodium = memo(() => {
  const { t } = useTranslation();

  return (
    <div className="mb-9 flex items-end justify-center gap-6 sm:gap-10">
      {LEADERBOARD_PODIUM.map((p) => (
        <div
          key={p.name}
          className={`flex w-22 flex-col items-center text-center ${
            p.lift ? '-translate-y-5' : ''
          }`}
        >
          <span className="text-[30px] leading-9">{p.emoji}</span>
          <div
            className={`mt-2 overflow-hidden rounded-full border-2 bg-[#f3f4f6] ${p.border}`}
            style={{ width: p.size, height: p.size }}
          >
            <img
              src={p.avatar}
              alt={p.name}
              width={p.size}
              height={p.size}
              className="h-full w-full object-cover"
            />
          </div>
          <p className={`mt-2 font-bold text-[#0d0d14] ${p.lift ? 'text-[16px]' : 'text-[14px]'}`}>
            {p.name}
          </p>
          <p className="text-[12px] text-[#6b7280]">{t(`common.cities.${p.cityKey}`)}</p>
          <p className="mt-1 text-[14px] font-bold text-[#e31837]">
            {t('home.winners.votesLabel', { count: p.votesCount })}
          </p>
        </div>
      ))}
    </div>
  );
});

LeaderboardPodium.displayName = 'LeaderboardPodium';

const LeaderboardStandings = memo(() => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {LEADERBOARD_ROWS.map((row) => (
          <article key={row.name} className="rounded-2xl border border-black/20 bg-white p-4">
            <div className="flex items-center gap-3">
              <span
                className={`w-8 shrink-0 text-center text-[16px] font-extrabold ${
                  row.rank.length <= 1 ? 'text-[#6b7280]' : 'text-[#e31837]'
                }`}
              >
                {row.rank}
              </span>
              {row.avatar ? (
                <img
                  src={row.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[rgba(227,24,55,0.1)] text-[12px] font-bold text-[#e31837]">
                  {row.initial}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-[#0d0d14]">{row.name}</p>
                <p className="text-[12px] text-[#6b7280]">{t(`common.cities.${row.cityKey}`)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-[13px]">
              <span className="text-[#6b7280]">
                {t('common.votes')}:{' '}
                <span className="font-extrabold text-[#0d0d14]">{row.votes}</span>
              </span>
              <span className="text-[#6b7280]">
                {t('common.points')}: <span className="text-[#0d0d14]">{row.points}</span>
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-black/20 bg-white md:block">
        <table className="w-full min-w-160 table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-black/20 bg-[#f7f8fa] text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
              <th className="w-1/5 px-6 py-4 font-extrabold">{t('common.rank')}</th>
              <th className="w-1/5 px-6 py-4 font-extrabold">{t('common.photographer')}</th>
              <th className="w-1/5 px-6 py-4 font-extrabold">{t('common.city')}</th>
              <th className="w-1/5 px-6 py-4 font-extrabold">{t('common.votes')}</th>
              <th className="w-1/5 px-6 py-4 font-extrabold">{t('common.points')}</th>
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD_ROWS.map((row) => (
              <tr key={row.name} className="border-b border-black/20 last:border-b-0">
                <td
                  className={`px-6 py-5 text-[16px] font-extrabold ${
                    row.rank.length <= 1 ? 'text-[#6b7280]' : 'text-[#e31837]'
                  }`}
                >
                  {row.rank}
                </td>
                <td className="px-6 py-5">
                  <div className="flex min-w-0 items-center gap-3">
                    {row.avatar ? (
                      <img
                        src={row.avatar}
                        alt=""
                        width={36}
                        height={36}
                        className="size-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(227,24,55,0.1)] text-[12px] font-bold text-[#e31837]">
                        {row.initial}
                      </span>
                    )}
                    <span className="truncate text-[14px] font-bold text-[#0d0d14]">
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[14px] text-[#6b7280]">
                  {t(`common.cities.${row.cityKey}`)}
                </td>
                <td className="px-6 py-5 text-[14px] font-extrabold text-[#0d0d14]">{row.votes}</td>
                <td className="px-6 py-5 text-[14px] text-[#6b7280]">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

LeaderboardStandings.displayName = 'LeaderboardStandings';

const LeaderboardPageFilters = memo(({ albumTab, onAlbumTabChange, monthMenu }) => {
  const { t } = useTranslation();
  const { month, setMonth, open: monthOpen, setOpen: setMonthOpen, ref: monthRef } = monthMenu;

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
          className="inline-flex cursor-pointer items-center gap-2.5 rounded bg-[#f0f0f0] px-3 py-2 text-[16px] font-medium text-[#222]"
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
            {LEADERBOARD_MONTHS.map((name) => {
              const selected = name === month;
              return (
                <li key={name} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      setMonth(name);
                      setMonthOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-[14px] font-medium transition ${
                      selected ? 'bg-[#4048cd]/10 text-[#4048cd]' : 'text-[#222] hover:bg-[#f7f8fa]'
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
    </div>
  );
});

LeaderboardPageFilters.displayName = 'LeaderboardPageFilters';

/**
 * Shared Top Photographers / Leaderboard UI.
 * - home: eyebrow + Full leaderboard CTA
 * - page: album tabs + month picker (navbar Leaderboard)
 */
const TopPhotographers = memo(({ variant = 'home' }) => {
  const { t } = useTranslation();
  const isPage = variant === 'page';
  const [albumTab, setAlbumTab] = useState(LEADERBOARD_ALBUM_TABS[1]);
  const monthMenu = useMonthMenu('July');
  const liveStandings = isPage
    ? t('leaderboard.liveStandings', {
        month: t(`common.months.${monthMenu.month}`),
        year: LEADERBOARD_STANDINGS_YEAR,
      })
    : t('home.leaderboard.liveStandings');

  return (
    <section className="bg-[#f7f8fa] section-py">
      <Shell>
        <SectionHeader
          className={`mb-11 ${isPage ? 'xl:mb-11' : ''}`}
          align="left"
          badge={t('home.leaderboard.eyebrow')}
          badgeTone="brand"
          title={isPage ? t('leaderboard.title') : t('home.leaderboard.title')}
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
                {t('home.leaderboard.fullLeaderboard')}
              </MarketingButton>
            )
          }
        />

        <LeaderboardPodium />
        <LeaderboardStandings />
      </Shell>
    </section>
  );
});

TopPhotographers.displayName = 'TopPhotographers';

export default TopPhotographers;
