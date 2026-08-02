import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, SITE_NAV_LINKS } from '../../config';

const A = '/assets/home';

const AppLink = memo(({ href = '#', children, ...props }) => {
  if (!href || href === '#' || /^https?:\/\//.test(href)) {
    return (
      <a href={href || '#'} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  );
});
AppLink.displayName = 'AppLink';

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

const NAV_LINKS = SITE_NAV_LINKS.map(({ label, href }) => ({
  label,
  href,
  active: href === ROUTES.WINNERS,
}));

const ANNOUNCEMENT =
  "🎉 May 2026 winners announced — View now · 📢 June competition is now open — Free to enter · 🏆 This month's prize: $500 · 📅 Competition ends in 7 days · ";

const FILTER_TABS = [
  'All Entries',
  'Single Photo',
  '6 Photos',
  '12 photos - full Zodiac Story',
];

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

const Shell = memo(({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-[1536px] px-4 sm:px-6 md:px-8 lg:px-12 ${className}`}>
    {children}
  </div>
));
Shell.displayName = 'Shell';

const ImgIcon = memo(({ src, size = 16, className = '' }) => (
  <span
    className={`inline-flex shrink-0 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <img src={src} alt="" width={size} height={size} className="h-full w-full object-contain" />
  </span>
));
ImgIcon.displayName = 'ImgIcon';

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
        <ImgIcon
          src={item.badgeIcon === 'trophy' ? ASSETS.trophy : ASSETS.badge}
          size={18}
        />
        <span className="text-[14px] leading-6 text-[#fdc700]">{item.badge}</span>
      </div>
      <div className="absolute bottom-4 right-4 rounded-lg bg-black/55 px-2 py-1">
        <span className="text-[14px] leading-6 text-white sm:text-[16px]">{item.date}</span>
      </div>
    </div>
    <div className="flex flex-col gap-6 px-4 py-6">
      <div>
        <p className="text-[14px] font-medium leading-6 text-[#42444a] sm:text-[16px]">{item.theme}</p>
        <h2 className="mt-1 text-[22px] font-extrabold leading-tight text-[#0d0d14] sm:text-[24px]">
          {item.title}
        </h2>
      </div>
      <div>
        <div className="h-px w-full bg-black/15" />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[14px] leading-6 text-[#2c2e30] sm:text-[16px]">{item.category}</p>
          <p className="shrink-0 text-[16px] font-semibold text-[#25252b] sm:text-[20px]">{item.votes}</p>
        </div>
      </div>
    </div>
  </article>
));
WinnerCard.displayName = 'WinnerCard';

const WinnersContent = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterTab, setFilterTab] = useState('All Entries');
  const [month, setMonth] = useState('July');
  const [monthOpen, setMonthOpen] = useState(false);
  const monthRef = useRef(null);

  useEffect(() => {
    if (!monthOpen) return undefined;
    const onPointerDown = (event) => {
      if (monthRef.current && !monthRef.current.contains(event.target)) {
        setMonthOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMonthOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [monthOpen]);

  useEffect(() => {
    if (!document.querySelector('link[data-manrope-font]')) {
      const font = document.createElement('link');
      font.rel = 'stylesheet';
      font.href =
        'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
      font.setAttribute('data-manrope-font', 'true');
      document.head.appendChild(font);
    }

    if (!document.querySelector('style[data-site-page-layout]')) {
      const style = document.createElement('style');
      style.setAttribute('data-site-page-layout', 'true');
      style.textContent = `
        .min-h-screen:has(.site-page-root) > nav { display: none !important; }
        .min-h-screen:has(.site-page-root) > main {
          max-width: none !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .min-h-screen:has(.site-page-root) { background: #fff !important; }
        .site-page-root { font-family: Manrope, sans-serif; color: #0d0d14; }
        @keyframes site-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .site-marquee-track { animation: site-marquee 28s linear infinite; }
      `;
      document.head.appendChild(style);
    }

    return () => {
      requestAnimationFrame(() => {
        if (!document.querySelector('.site-page-root')) {
          document.querySelector('style[data-site-page-layout]')?.remove();
        }
      });
    };
  }, []);

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
    <div className="site-page-root winners-page-root w-full overflow-x-hidden bg-white">
      {/* Announcement */}
      <div className="flex h-[46px] items-center overflow-hidden bg-[#4048cd]">
        <div className="site-marquee-track flex w-max whitespace-nowrap text-[14px] leading-[22px] text-white sm:text-[16px]">
          <span className="px-4">{ANNOUNCEMENT}</span>
          <span className="px-4" aria-hidden="true">
            {ANNOUNCEMENT}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-black/[0.04] bg-[rgba(236,237,250,0.16)] backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 md:px-10 xl:px-[192px]">
          <AppLink
            href="/"
            className="relative h-[52px] w-[170px] shrink-0 overflow-hidden sm:h-[67px] sm:w-[220px]"
          >
            <img
              src={ASSETS.logo}
              alt="My 12 Photos"
              width={220}
              height={68}
              className="absolute left-0 top-[-110%] h-[326%] w-full max-w-none object-cover"
            />
          </AppLink>

          <nav className="hidden items-center gap-1 2xl:flex" aria-label="Primary">
            {NAV_LINKS.map(({ label, href, active }) => (
              <AppLink
                key={label}
                href={href}
                className={`px-2.5 py-2 text-center text-[14px] font-semibold leading-5 ${
                  active ? 'text-[#ee1c25]' : 'text-[#6b7280]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </AppLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <button
              type="button"
              className="flex items-center gap-2.5 rounded bg-[#f0f0f0] px-3 py-2 text-[16px] font-medium text-[#222]"
            >
              English
              <ImgIcon src={ASSETS.chevron} size={24} />
            </button>
            <div className="flex items-center gap-4">
              <AppLink
                href="/login"
                className="rounded-full bg-[#4048cd] px-6 py-3 text-[16px] font-medium text-white"
              >
                Log IN
              </AppLink>
              <a
                href="#"
                className="rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
              >
                Register Free
              </a>
            </div>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1b1e56] xl:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 h-0.5 w-full bg-current transition ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full bg-current transition ${menuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-black/5 bg-white px-4 py-4 xl:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href, active }) => (
                <AppLink
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    active ? 'bg-[#ee1c25]/5 text-[#ee1c25]' : 'text-[#6b7280]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </AppLink>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-black/5 pt-4">
              <AppLink
                href="/login"
                className="rounded-full bg-[#4048cd] px-6 py-3 text-center text-sm font-medium text-white"
              >
                Log IN
              </AppLink>
              <a
                href="#"
                className="rounded-full bg-[#ee1c25] px-6 py-3 text-center text-sm font-medium text-white"
              >
                Register Free
              </a>
            </div>
          </div>
        )}
      </header>

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

      {/* Newsletter */}
      <section className="bg-white py-10 sm:py-16">
        <Shell>
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-[#4048cd] px-4 py-16 sm:min-h-[400px] sm:px-8 sm:py-20 xl:min-h-[465px]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.22]"
              style={{
                backgroundImage: `url(${ASSETS.newsletterBg})`,
                backgroundSize: '1024px 1024px',
                backgroundPosition: 'top left',
              }}
            />
            <div className="relative mx-auto flex h-full max-w-[640px] flex-col items-center justify-center gap-8 text-center">
              <div>
                <h2 className="text-[36px] font-semibold text-white sm:text-[48px]">Stay Updated</h2>
                <p className="mt-2 text-[16px] text-[#eaeaea] sm:text-[20px]">
                  Receive competition announcements, winner reveals, and photography tips.
                </p>
              </div>
              <form
                className="flex w-full max-w-[520px] flex-col gap-3 rounded-[33px] bg-white/24 p-3 sm:flex-row sm:items-center"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="flex flex-1 items-center gap-1 rounded-3xl bg-white px-4 py-3">
                  <ImgIcon src={ASSETS.mail} size={24} />
                  <input
                    type="email"
                    placeholder="Enter your email here..."
                    className="w-full bg-transparent text-[12px] text-[#222] outline-none placeholder:text-[#7d7d7d]"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-[27px] bg-[#ee1c25] px-10 py-3 text-[16px] text-white"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </Shell>
      </section>

      {/* Footer */}
      <footer className="bg-[#ecedfa]">
        <Shell className="py-14 xl:py-[69px]">
          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="relative h-[67px] w-[220px] overflow-hidden">
                <img
                  src={ASSETS.logoFooter}
                  alt="My 12 Photos"
                  width={220}
                  height={68}
                  className="absolute left-0 top-[-110%] h-[326%] w-full max-w-none object-cover"
                />
              </div>
              <p className="mt-5 max-w-[320px] text-[16px] leading-[22.75px] text-[#1a1a1a]">
                A photography platform connecting photo enthusiasts and rewarding the best work
                every month.
              </p>
              <div className="mt-6 flex gap-3">
                {[ASSETS.ig, ASSETS.fb, ASSETS.x].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex size-9 items-center justify-center rounded-2xl bg-[#2d3392]"
                    aria-label="Social link"
                  >
                    <ImgIcon src={icon} size={16} />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Competitions',
                links: ['Single Photo', '6-Photo Story', 'Zodiac Album', 'Winners', 'Leaderboard'],
              },
              {
                title: 'Platform',
                links: ['Gallery', 'Leaderboard', 'About', 'FAQ', 'Contact'],
              },
              {
                title: 'Legal',
                links: ['Privacy Policy', 'Terms of Service', 'Cookies'],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[16px] font-extrabold uppercase tracking-[1.2px] text-[#1a1a1a]">
                  {col.title}
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[16px] text-[#1a1a1a]">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Shell>
        <div className="border-t border-black/5 px-4 py-6 sm:px-6 md:px-8 lg:px-10">
          <Shell>
            <p className="text-[16px] font-medium text-[#191818] sm:text-[20px]">
              © 2026 My12Photos. All rights reserved.
            </p>
          </Shell>
        </div>
      </footer>
    </div>
  );
});

WinnersContent.displayName = 'WinnersContent';

export default WinnersContent;
