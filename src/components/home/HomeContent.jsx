import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import { ImgIcon, Shell, SitePageLayout } from '../site';
import HomeHero from './HomeHero';
import ActiveCompetitions from '../competitions/ActiveCompetitions';
import HowItWorks from '../competitions/HowItWorks';
import CommunityWork from '../gallery/CommunityWork';

const A = '/assets/home';

const ASSETS = {
  logo: `${A}/logo.png`,
  logoFooter: `${A}/logo-footer.png`,
  chevron: `${A}/chevron-down.svg`,
  hero: `${A}/hero.jpg`,
  heroDots: `${A}/hero-dots.svg`,
  camera: `${A}/icon-camera.svg`,
  book: `${A}/icon-book.svg`,
  sparkle: `${A}/icon-sparkle.svg`,
  check: `${A}/icon-check.svg`,
  checkAlt: `${A}/icon-check-alt.svg`,
  arrow: `${A}/icon-arrow.svg`,
  arrowRed: `${A}/icon-arrow-red.svg`,
  trophy: `${A}/icon-trophy.svg`,
  users: `${A}/icon-users.svg`,
  formats: `${A}/icon-formats.svg`,
  star: `${A}/icon-star.svg`,
  free: `${A}/icon-free.svg`,
  globe: `${A}/icon-globe.svg`,
  mail: `${A}/icon-mail.svg`,
  ig: `${A}/icon-ig.svg`,
  fb: `${A}/icon-fb.svg`,
  x: `${A}/icon-x.svg`,
  starFull: `${A}/star-full.svg`,
  starHalf: `${A}/star-half.svg`,
  newsletterBg: `${A}/newsletter-bg.png`,
  avatarAnna: `${A}/avatar-anna.jpg`,
  avatarPiotr: `${A}/avatar-piotr.jpg`,
  avatarMarta: `${A}/avatar-marta.jpg`,
  winnerEmma: `${A}/winner-emma.jpg`,
  winnerDavid: `${A}/winner-david.jpg`,
  winnerMarie: `${A}/winner-marie.jpg`,
};

const LEADERBOARD = [
  {
    rank: '🥇',
    name: 'Anna Kowalska',
    cityKey: 'krakow',
    votes: '4,821',
    points: '9,640',
    avatar: ASSETS.avatarAnna,
  },
  {
    rank: '🥈',
    name: 'Piotr Mazur',
    cityKey: 'warsaw',
    votes: '4,203',
    points: '8,406',
    avatar: ASSETS.avatarPiotr,
  },
  {
    rank: '🥉',
    name: 'Marta Wiśniewska',
    cityKey: 'wroclaw',
    votes: '3,981',
    points: '7,962',
    avatar: ASSETS.avatarMarta,
  },
  {
    rank: '4',
    name: 'Kamil Zając',
    cityKey: 'poznan',
    votes: '3,542',
    points: '7,084',
    initial: 'K',
  },
  {
    rank: '5',
    name: 'Ewa Krawczyk',
    cityKey: 'gdansk',
    votes: '3,218',
    points: '6,436',
    initial: 'E',
  },
  {
    rank: '6',
    name: 'Tomasz Nowak',
    cityKey: 'lodz',
    votes: '2,967',
    points: '5,934',
    initial: 'T',
  },
];

const WINNERS = [
  {
    medal: '🥇',
    name: 'Emma Kowalska',
    work: 'Silence at Dusk',
    votesCount: '3,210',
    prize: '$300',
    image: ASSETS.winnerEmma,
  },
  {
    medal: '🥈',
    name: 'David Nowak',
    work: 'Urban Rivers',
    votesCount: '2,891',
    prize: '$150',
    image: ASSETS.winnerDavid,
  },
  {
    medal: '🥉',
    name: 'Marie Blanche',
    work: 'Salt Flats Journey',
    votesCount: '2,654',
    prize: '$50',
    image: ASSETS.winnerMarie,
  },
];

const FEATURES = [
  {
    icon: ASSETS.trophy,
    titleKey: 'home.features.prizesTitle',
    textKey: 'home.features.prizesText',
  },
  {
    icon: ASSETS.users,
    titleKey: 'home.features.votingTitle',
    textKey: 'home.features.votingText',
  },
  {
    icon: ASSETS.formats,
    titleKey: 'home.features.formatsTitle',
    textKey: 'home.features.formatsText',
  },
  {
    icon: ASSETS.star,
    titleKey: 'home.features.hallTitle',
    textKey: 'home.features.hallText',
  },
  {
    icon: ASSETS.free,
    titleKey: 'home.features.freeTitle',
    textKey: 'home.features.freeText',
  },
  {
    icon: ASSETS.globe,
    titleKey: 'home.features.globalTitle',
    textKey: 'home.features.globalText',
  },
];

const TESTIMONIALS = [
  {
    quoteKey: 'home.testimonials.a1quote',
    name: 'Anna Kowalska',
    roleKey: 'home.testimonials.a1role',
    avatar: ASSETS.avatarAnna,
    stars: 5,
  },
  {
    quoteKey: 'home.testimonials.a2quote',
    name: 'Piotr Mazur',
    roleKey: 'home.testimonials.a2role',
    avatar: ASSETS.avatarPiotr,
    stars: 5,
  },
  {
    quoteKey: 'home.testimonials.a3quote',
    name: 'Marta Wiśniewska',
    roleKey: 'home.testimonials.a3role',
    avatar: ASSETS.avatarMarta,
    stars: 4.5,
  },
];

const STATS = [
  { value: '14,820+', labelKey: 'home.stats.photographers' },
  { value: '89,450+', labelKey: 'home.stats.photos' },
  { value: '342,100+', labelKey: 'home.stats.votes' },
  { value: '120×', labelKey: 'home.stats.prizes' },
];

const HomeContent = memo(() => {
  const { t } = useTranslation();

  return (
    <SitePageLayout
      activeHref={ROUTES.HOME}
      rootClassName="home-page-root"
      announcementTone="navy"
      newsletterVariant="home"
    >
      <HomeHero />

      {/* Stats */}
      <section className="bg-[#1b1e56] py-10 xl:py-12">
        <Shell>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
            {STATS.map(({ value, labelKey }) => (
              <div key={labelKey} className="text-center">
                <p className="text-[32px] font-extrabold leading-none text-white sm:text-[40px] xl:text-[48px]">
                  {value}
                </p>
                <p className="mt-4 text-[14px] font-medium tracking-wide text-white/70 sm:text-[16px]">
                  {t(labelKey)}
                </p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      <ActiveCompetitions />

      <HowItWorks />

      <CommunityWork />

      {/* Leaderboard */}
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
              <p className="mt-2 text-[16px] text-[#6b7280]">{t('home.leaderboard.liveStandings')}</p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-[#e31837]"
            >
              {t('home.leaderboard.fullLeaderboard')}
              <ImgIcon src={ASSETS.arrowRed} size={16} />
            </a>
          </div>

          <div className="mb-9 flex items-end justify-center gap-6 sm:gap-10">
            {[
              {
                emoji: '🥈',
                name: 'Piotr',
                cityKey: 'warsaw',
                votesCount: '4,203',
                avatar: ASSETS.avatarPiotr,
                size: 64,
                border: 'border-[#e5e7eb]',
              },
              {
                emoji: '🥇',
                name: 'Anna',
                cityKey: 'krakow',
                votesCount: '4,821',
                avatar: ASSETS.avatarAnna,
                size: 80,
                border: 'border-[#fdc700]',
                lift: true,
              },
              {
                emoji: '🥉',
                name: 'Marta',
                cityKey: 'wroclaw',
                votesCount: '3,981',
                avatar: ASSETS.avatarMarta,
                size: 64,
                border: 'border-[#fee685]',
              },
            ].map((p) => (
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
            {LEADERBOARD.map((row) => (
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
                    <p className="text-[12px] text-[#6b7280]">
                      {t(`common.cities.${row.cityKey}`)}
                    </p>
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
                {LEADERBOARD.map((row) => (
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

      {/* Monthly Winners */}
      <section className="bg-white py-16 sm:py-20">
        <Shell>
          <div className="rounded-[20px] bg-[#4048cd] px-4 py-16 sm:px-8 sm:py-20 xl:px-6">
            <div className="mx-auto max-w-[896px]">
              <p className="text-center text-[11px] font-bold uppercase tracking-[1.65px] text-white">
                {t('home.winners.monthLabel')}
              </p>
              <h2 className="mt-3 text-center text-[32px] font-bold tracking-[-0.9px] text-white/90 sm:text-[36px]">
                {t('home.winners.title')}
              </h2>
              <p className="mt-2 text-center text-[16px] text-white">{t('home.winners.subtitle')}</p>

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {WINNERS.map((w) => (
                  <article
                    key={w.name}
                    className="flex flex-col items-center rounded-2xl bg-[#666dd7] p-6 text-center text-white"
                  >
                    <span className="text-[36px] leading-10">{w.medal}</span>
                    <img
                      src={w.image}
                      alt={w.name}
                      width={64}
                      height={64}
                      className="mt-3 size-16 rounded-full border-2 border-white/20 object-cover"
                    />
                    <h3 className="mt-3 text-[18px] font-semibold text-white/90">{w.name}</h3>
                    <p className="text-[14px]">{w.work}</p>
                    <p className="mt-1 text-[12px]">
                      {t('home.winners.votesLabel', { count: w.votesCount })}
                    </p>
                    <p className="mt-4 text-[24px] font-semibold text-white/90">{w.prize}</p>
                    <p className="mb-4 text-[12px]">{t('home.winners.cashPrize')}</p>
                    <a
                      href="#"
                      className="inline-flex h-[34px] w-full items-center justify-center rounded-[14px] border border-white/20 bg-white/8 text-[12px] font-bold"
                    >
                      {t('home.winners.viewAlbum')}
                    </a>
                  </article>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a href="#" className="text-[14px] font-semibold text-white">
                  {t('home.winners.viewAll')}
                </a>
              </div>
            </div>
          </div>
        </Shell>
      </section>

      {/* Why My12Photos */}
      <section className="bg-white py-16 sm:py-20">
        <Shell>
          <div className="mb-11">
            <p className="text-[16px] font-bold uppercase tracking-[1.65px] text-[#3f51b5]">
              {t('home.features.eyebrow')}
            </p>
            <h2 className="mt-[18px] whitespace-nowrap text-[36px] font-bold tracking-[-0.9px] text-[#3a3a42]">
              {t('home.features.title')}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.titleKey} className="rounded-2xl border border-black/17 p-[25px]">
                <div className="mb-2.5 flex size-10 items-center justify-center rounded-[14px] bg-[#eef2ff]">
                  <ImgIcon src={f.icon} size={18} />
                </div>
                <h3 className="text-[24px] font-semibold leading-[27px] text-[#3a3a42]">
                  {t(f.titleKey)}
                </h3>
                <p className="mt-2.5 max-w-[324px] text-[16px] leading-[22.75px] text-[#6b7280]">
                  {t(f.textKey)}
                </p>
              </article>
            ))}
          </div>
        </Shell>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f7f8fa] py-16 sm:py-20 xl:py-[106px]">
        <Shell>
          <div className="mb-11 text-center">
            <p className="text-[16px] font-bold uppercase tracking-[1.2px] text-[#e31837]">
              {t('home.testimonials.eyebrow')}
            </p>
            <h2 className="mt-3 text-[32px] font-bold tracking-[-0.96px] text-[#3a3a42] sm:text-[48px]">
              {t('home.testimonials.title')}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <article
                key={item.name}
                className="flex flex-col rounded-2xl border border-black/8 bg-white p-8"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ImgIcon
                      key={i}
                      src={i < Math.floor(item.stars) ? ASSETS.starFull : ASSETS.starHalf}
                      size={16}
                    />
                  ))}
                </div>
                <p className="flex-1 text-[14px] leading-[22.75px] text-[#0d0d14]">
                  &ldquo;{t(item.quoteKey)}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[14px] font-bold text-[#0d0d14]">{item.name}</p>
                    <p className="text-[12px] text-[#6b7280]">{t(item.roleKey)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

HomeContent.displayName = 'HomeContent';

export default HomeContent;
