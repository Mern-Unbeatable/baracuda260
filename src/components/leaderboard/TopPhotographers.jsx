import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import { LEADERBOARD_PODIUM, LEADERBOARD_ROWS } from '../../data/leaderboardStandings';
import { AppLink, ImgIcon, Shell, homeAsset } from '../site';

/**
 * Shared Top Photographers / Leaderboard preview (Home).
 * Full leaderboard CTA links to the Leaderboard route.
 */
const TopPhotographers = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-[#f7f8fa] py-16 sm:py-20 xl:py-[114px]">
      <Shell>
        <div className="mb-11 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#e31837]">
              {t('home.leaderboard.eyebrow')}
            </p>
            <h2 className="mt-3 text-[36px] font-bold text-[#3a3a42] sm:text-[48px] sm:leading-[48px]">
              {t('home.leaderboard.title')}
            </h2>
            <p className="mt-2 text-[16px] font-normal text-[#9ca3af]">
              {t('home.leaderboard.liveStandings')}
            </p>
          </div>
          <AppLink
            href={ROUTES.LEADERBOARD}
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#e31837]"
          >
            {t('home.leaderboard.fullLeaderboard')}
            <ImgIcon src={homeAsset('icon-arrow-red.svg')} size={16} />
          </AppLink>
        </div>

        <div className="mb-9 flex items-end justify-center gap-6 sm:gap-10">
          {LEADERBOARD_PODIUM.map((p) => (
            <div
              key={p.name}
              className={`flex w-[88px] flex-col items-center text-center ${
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
              <p
                className={`mt-2 font-bold text-[#0d0d14] ${p.lift ? 'text-[16px]' : 'text-[14px]'}`}
              >
                {p.name}
              </p>
              <p className="text-[12px] text-[#6b7280]">{t(`common.cities.${p.cityKey}`)}</p>
              <p className="mt-1 text-[14px] font-bold text-[#e31837]">
                {t('home.winners.votesLabel', { count: p.votesCount })}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {LEADERBOARD_ROWS.map((row) => (
            <article
              key={row.name}
              className="rounded-2xl border border-black/20 bg-white p-4"
            >
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

        {/* Desktop table */}
        <div className="hidden overflow-x-auto rounded-2xl border border-black/20 bg-white md:block">
          <table className="w-full min-w-[640px] table-fixed border-collapse text-left">
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
                  <td className="px-6 py-5 text-[14px] font-extrabold text-[#0d0d14]">
                    {row.votes}
                  </td>
                  <td className="px-6 py-5 text-[14px] text-[#6b7280]">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Shell>
    </section>
  );
});

TopPhotographers.displayName = 'TopPhotographers';

export default TopPhotographers;
