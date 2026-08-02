import React, { memo, useMemo, useState } from 'react';
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
  trophy: `${A}/icon-trophy-cup.svg`,
  badge: `${A}/icon-badge.svg`,
};

const FILTER_TABS = ['All Entries', 'Single Photo', '6 Photos', '12 photos - full Zodiac Story'];

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

const WINNERS = [
  {
    id: 'golden-horizons',
    title: 'Golden Horizons',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,612 Votes',
    date: 'Jan 2026',
    month: 'January',
    badge: '1st PLACE',
    badgeIcon: 'trophy',
    album: 'Single Photo',
    image: `${A}/winner-golden.jpg`,
  },
  {
    id: 'into-the-wild',
    title: 'Into the Wild',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '4,028 Votes',
    date: 'July 2026',
    month: 'July',
    badge: '2nd PLACE',
    badgeIcon: 'trophy',
    album: 'Single Photo',
    image: `${A}/winner-wild.jpg`,
  },
  {
    id: 'natures-whisper',
    title: "Nature's Whisper",
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,891 Votes',
    date: 'March 2026',
    month: 'March',
    badge: '3rd PLACE',
    badgeIcon: 'trophy',
    album: 'Single Photo',
    image: `${A}/winner-nature.jpg`,
  },
  {
    id: 'frozen-moments',
    title: 'Frozen Moments',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,745 Votes',
    date: 'Oct 2026',
    month: 'October',
    badge: 'Popular Vote',
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-frozen.jpg`,
  },
  {
    id: 'urban-reflections',
    title: 'Urban Reflections',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '4,156 Votes',
    date: 'Feb 2026',
    month: 'February',
    badge: 'Top Rated',
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-urban.jpg`,
  },
  {
    id: 'beyond-the-forest',
    title: 'Beyond the Forest',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,967 Votes',
    date: 'Apr 2026',
    month: 'April',
    badge: 'Popular Vote',
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-forest.jpg`,
  },
  {
    id: 'colors-of-dawn',
    title: 'Colors of Dawn',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '4,221 Votes',
    date: 'Aug 2026',
    month: 'August',
    badge: "Editor's Choice",
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-dawn.jpg`,
  },
  {
    id: 'klaus-fischer',
    title: 'Klaus Fischer',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,840 Votes',
    date: 'May 2026',
    month: 'May',
    badge: 'Top Rated',
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-klaus.jpg`,
  },
];

const WinnerCard = memo(({ item }) => (
  <article className="flex flex-col overflow-hidden rounded-xl bg-[#f4f4f4]">
    <div className="relative h-[220px] overflow-hidden sm:h-[254px]">
      <img
        src={item.image}
        alt={item.title}
        width={369}
        height={254}
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
      <div className="absolute left-[13px] top-[15px] inline-flex items-center gap-2 rounded bg-black/50 px-[7px] py-1">
        <ImgIcon src={item.badgeIcon === 'trophy' ? ASSETS.trophy : ASSETS.badge} size={18} />
        <span className="text-[14px] leading-6 text-[#fdc700]">{item.badge}</span>
      </div>
      <div className="absolute bottom-4 right-4 rounded-lg bg-black/55 px-2 py-1">
        <span className="text-[14px] leading-6 text-white sm:text-[16px]">{item.date}</span>
      </div>
    </div>
    <div className="flex flex-col gap-6 px-4 py-6">
      <div>
        <p className="text-[14px] font-medium leading-6 text-[#42444a] sm:text-[16px]">
          {item.theme}
        </p>
        <h2 className="mt-1 text-[22px] font-extrabold leading-tight text-[#0d0d14] sm:text-[24px]">
          {item.title}
        </h2>
      </div>
      <div>
        <div className="h-px w-full bg-black/15" />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[14px] leading-6 text-[#2c2e30] sm:text-[16px]">{item.category}</p>
          <p className="shrink-0 text-[16px] font-semibold text-[#25252b] sm:text-[20px]">
            {item.votes}
          </p>
        </div>
      </div>
    </div>
  </article>
));
WinnerCard.displayName = 'WinnerCard';

const WinnersContent = memo(() => {
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
      // Figma default shows full archive for July; keep all months visible on July
      // and filter strictly when another month is selected.
      if (month === 'July') return albumOk;
      return albumOk && monthOk;
    });
  }, [filterTab, month]);
  return (
    <SitePageLayout
      activeHref={ROUTES.WINNERS}
      rootClassName="winners-page-root"
      announcementTone="blue"
      newsletterVariant="page"
    >
      {/* Archive */}
      <section className="bg-white py-12 sm:py-16 xl:py-[70px]">
        <Shell>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-[720px]">
              <h1 className="text-[32px] font-extrabold leading-tight text-[#0d0d14] sm:text-[40px] sm:leading-[48px] xl:text-[48px]">
                Complete Winners Archive
              </h1>
              <p className="mt-4 text-[16px] leading-6 text-[#6b7280]">
                Review past legendary lens achievements, themes, and winning statistics.
              </p>
            </div>

            <div className="relative shrink-0 self-start" ref={monthRef}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={monthOpen}
                onClick={() => setMonthOpen((open) => !open)}
                className="inline-flex items-center gap-2.5 rounded bg-[#f0f0f0] px-3 py-2 text-[16px] font-medium text-[#222]"
              >
                <ImgIcon src={ASSETS.calendar} size={13} />
                <span>{month}</span>
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
                  aria-label="Select month"
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
                          {name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:mt-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex items-center gap-2.5 text-[16px] font-medium text-[#222]">
              <ImgIcon src={ASSETS.calendar} size={13} />
              <span>HISTORIC RECORDS: {filteredWinners.length} ITEMS</span>
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
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredWinners.length === 0 ? (
            <div className="mt-11 rounded-xl border border-dashed border-black/15 px-6 py-16 text-center">
              <p className="text-[18px] font-bold text-[#0d0d14]">No winners found</p>
              <p className="mt-2 text-[14px] text-[#6b7280]">
                Try another album type or month to see more historic records.
              </p>
            </div>
          ) : (
            <div className="mt-11 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filteredWinners.map((item) => (
                <WinnerCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </Shell>
      </section>
    </SitePageLayout>
  );
});

WinnersContent.displayName = 'WinnersContent';

export default WinnersContent;
