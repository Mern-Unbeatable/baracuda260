import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import { ImgIcon, Shell, SitePageLayout, useMonthMenu } from '../site';

const A = '/assets/home';

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
  avatarAnna: `${A}/avatar-anna.jpg`,
  avatarPiotr: `${A}/avatar-piotr.jpg`,
  avatarMarta: `${A}/avatar-marta.jpg`,
};

const ALBUM_TABS = ['Single Photo', '6 Photos', '12 photos - full Zodiac Story'];

const ALBUM_TAB_LABEL_KEYS = {
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

const STANDINGS_YEAR = 2026;

const PODIUM = [
  {
    emoji: '🥈',
    name: 'Piotr',
    city: 'Warsaw',
    votesCount: '4,203',
    avatar: ASSETS.avatarPiotr,
    size: 64,
    border: 'border-2 border-[#e5e7eb]',
    lift: false,
  },
  {
    emoji: '🥇',
    name: 'Anna',
    city: 'Kraków',
    votesCount: '4,821',
    avatar: ASSETS.avatarAnna,
    size: 80,
    border:
      'border-4 border-[#fdc700] shadow-[0px_10px_15px_-3px_#fff085,0px_4px_6px_-4px_#fff085]',
    lift: true,
    bold: true,
  },
  {
    emoji: '🥉',
    name: 'Marta',
    city: 'Wrocław',
    votesCount: '3,981',
    avatar: ASSETS.avatarMarta,
    size: 56,
    border: 'border-2 border-[#fee685]',
    lift: false,
  },
];

const LEADERBOARD = [
  {
    rank: '🥇',
    name: 'Anna Kowalska',
    city: 'Kraków',
    votes: '4,821',
    points: '9,640',
    avatar: ASSETS.avatarAnna,
    medal: true,
  },
  {
    rank: '🥈',
    name: 'Piotr Mazur',
    city: 'Warsaw',
    votes: '4,203',
    points: '8,406',
    avatar: ASSETS.avatarPiotr,
    medal: true,
  },
  {
    rank: '🥉',
    name: 'Marta Wiśniewska',
    city: 'Wrocław',
    votes: '3,981',
    points: '7,962',
    avatar: ASSETS.avatarMarta,
    medal: true,
  },
  {
    rank: '4',
    name: 'Kamil Zając',
    city: 'Poznań',
    votes: '3,542',
    points: '7,084',
    initial: 'K',
  },
  {
    rank: '5',
    name: 'Ewa Krawczyk',
    city: 'Gdańsk',
    votes: '3,218',
    points: '6,436',
    initial: 'E',
  },
  {
    rank: '6',
    name: 'Tomasz Nowak',
    city: 'Łódź',
    votes: '2,967',
    points: '5,934',
    initial: 'T',
  },
];

const LeaderboardContent = memo(() => {
  const { t } = useTranslation();
  const [albumTab, setAlbumTab] = useState('6 Photos');
  const {
    month,
    setMonth,
    open: monthOpen,
    setOpen: setMonthOpen,
    ref: monthRef,
  } = useMonthMenu('July');

  return (
    <SitePageLayout
      activeHref={ROUTES.LEADERBOARD}
      rootClassName="leaderboard-page-root"
      announcementTone="blue"
      newsletterVariant="page"
    >
      {/* Leaderboard */}
      <section className="bg-[#f7f8fa] py-12 sm:py-16 xl:py-[114px]">
        <Shell>
          <div className="mb-10 flex flex-col gap-6 xl:mb-11 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="pt-3 text-[32px] font-extrabold leading-[40px] text-[#0d0d14] sm:text-[40px] sm:leading-[48px] xl:text-[48px]">
                {t('leaderboard.title')}
              </h1>
              <p className="mt-2 text-[16px] leading-6 text-[#6b7280]">
                {t('leaderboard.liveStandings', {
                  month: t(`common.months.${month}`),
                  year: STANDINGS_YEAR,
                })}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                {ALBUM_TABS.map((tab) => {
                  const active = albumTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setAlbumTab(tab)}
                      className={`rounded-full px-4 py-2 text-[14px] font-semibold capitalize transition ${
                        active
                          ? 'bg-[#4048cd] text-white'
                          : 'bg-[#f2f2f2] text-[#6b7280] hover:text-[#0d0d14]'
                      } ${tab.startsWith('12') && !active ? 'text-[#0d0d14]' : ''}`}
                    >
                      {t(ALBUM_TAB_LABEL_KEYS[tab])}
                    </button>
                  );
                })}
              </div>

              <div className="relative self-start sm:self-auto" ref={monthRef}>
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
            </div>
          </div>

          <div className="mb-9 flex items-end justify-center gap-6 sm:gap-10">
            {PODIUM.map((p) => (
              <div
                key={p.name}
                className={`flex w-[76px] flex-col items-center text-center sm:w-[80px] ${
                  p.lift ? '-mt-4' : 'mt-2'
                }`}
              >
                <span className="text-[30px] leading-9">{p.emoji}</span>
                <div
                  className={`mt-2 overflow-hidden rounded-full bg-[#f3f4f6] p-0.5 ${p.border}`}
                  style={{ width: p.size, height: p.size }}
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    width={p.size}
                    height={p.size}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <p
                  className={`mt-2 text-[#0d0d14] ${
                    p.bold
                      ? 'text-[16px] font-extrabold leading-6'
                      : 'text-[14px] font-bold leading-5'
                  }`}
                >
                  {p.name}
                </p>
                <p className="text-[12px] leading-4 text-[#6b7280]">{p.city}</p>
                <p className="mt-1 text-[14px] font-bold leading-5 text-[#e31837]">
                  {t('home.winners.votesLabel', { count: p.votesCount })}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/20 bg-white">
            <table className="min-w-[720px] w-full text-left">
              <thead className="bg-[#f7f8fa] text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
                <tr className="border-b border-black/20">
                  <th className="px-6 py-4">{t('common.rank')}</th>
                  <th className="px-6 py-4">{t('common.photographer')}</th>
                  <th className="px-6 py-4">{t('common.city')}</th>
                  <th className="px-6 py-4 text-right">{t('common.votes')}</th>
                  <th className="px-6 py-4 text-right">{t('common.points')}</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map((row) => (
                  <tr key={row.name} className="border-b border-black/20 last:border-0">
                    <td
                      className={`px-6 py-5 text-[14px] font-extrabold ${
                        row.medal ? 'text-[#e31837]' : 'text-[#6b7280]'
                      }`}
                    >
                      {row.rank}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {row.avatar ? (
                          <img
                            src={row.avatar}
                            alt=""
                            width={36}
                            height={36}
                            className="size-9 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex size-9 items-center justify-center rounded-full bg-[rgba(227,24,55,0.1)] text-[12px] font-bold text-[#e31837]">
                            {row.initial}
                          </span>
                        )}
                        <span className="text-[14px] font-bold text-[#0d0d14]">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[14px] text-[#6b7280]">{row.city}</td>
                    <td className="px-6 py-5 text-right text-[14px] font-extrabold text-[#0d0d14]">
                      {row.votes}
                    </td>
                    <td className="px-6 py-5 text-right text-[14px] text-[#6b7280]">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

LeaderboardContent.displayName = 'LeaderboardContent';

export default LeaderboardContent;
