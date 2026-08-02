import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  camera: `${A}/icon-camera.svg`,
  book: `${A}/icon-book.svg`,
  sparkle: `${A}/icon-sparkle.svg`,
  check: `${A}/icon-check.svg`,
  checkAlt: `${A}/icon-check-alt.svg`,
  arrow: `${A}/icon-arrow.svg`,
  mail: `${A}/icon-mail.svg`,
  ig: `${A}/icon-ig.svg`,
  fb: `${A}/icon-fb.svg`,
  x: `${A}/icon-x.svg`,
  newsletterBg: `${A}/newsletter-bg.png`,
};

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Competitions', href: '/competitions', active: true },
  { label: 'Gallery', href: '#' },
  { label: 'Leaderboard', href: '#' },
  { label: 'Winners', href: '#' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const ANNOUNCEMENT =
  "🎉 May 2026 winners announced — View now · 📢 June competition is now open — Free to enter · 🏆 This month's prize: $500 · 📅 Competition ends in 7 days · ";

const COMPETITIONS = [
  {
    icon: ASSETS.camera,
    title: 'Single Photo',
    description:
      'Submit one outstanding photograph that speaks for itself. Pure skill, pure story — judged by the community.',
    features: ['Monthly competition', 'Public community voting', 'Top 3 win cash prizes'],
    prize: '$1500.00',
    check: ASSETS.check,
  },
  {
    icon: ASSETS.book,
    title: '6-Photos Story',
    description:
      'Craft a visual narrative using six carefully sequenced images that guide the viewer through an arc.',
    features: ['Sequential storytelling', 'Community votes', 'Best story wins'],
    prize: '$2500.00',
    popular: true,
    check: ASSETS.checkAlt,
  },
  {
    icon: ASSETS.sparkle,
    title: '12 photos - full Zodiac Story',
    description:
      'Create a complete zodiac-themed visual journey across twelve stunning images — our grandest format.',
    features: ['12-sign visual arc', 'Zodiac-order display', 'Grand prize category'],
    prize: '$3500.00',
    check: ASSETS.check,
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Create an Account',
    text: 'Sign up for free in seconds. No fees, no hidden costs — ever.',
  },
  {
    num: '02',
    title: 'Submit Your Photos',
    text: 'Choose a competition category and upload your best work before the deadline.',
  },
  {
    num: '03',
    title: 'Earn Votes',
    text: 'The photography community votes for their favourites. The more votes, the higher your rank.',
  },
  {
    num: '04',
    title: 'Claim Your Prize',
    text: 'Winners receive cash prizes via PayPal. Fast, transparent, and reliable.',
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

const CompetitionsContent = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className="site-page-root competitions-page-root w-full overflow-x-hidden bg-white">
      {/* Announcement */}
      <div className="flex h-[46px] items-center overflow-hidden bg-[#1b1e56]">
        <div className="site-marquee-track flex w-max whitespace-nowrap text-[14px] leading-[22px] text-white">
          <span className="px-4">{ANNOUNCEMENT}</span>
          <span className="px-4" aria-hidden="true">
            {ANNOUNCEMENT}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-black/[0.04] bg-[rgba(236,237,250,0.16)] backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 md:px-10 xl:px-[192px]">
          <AppLink href="/" className="relative h-[52px] w-[170px] shrink-0 overflow-hidden sm:h-[67px] sm:w-[220px]">
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

      {/* Active Competitions */}
      <section className="bg-[#f7f8fa] py-16 sm:py-20 xl:py-[114px]">
        <Shell>
          <div className="mx-auto mb-11 max-w-[682px] text-center">
            <p className="text-[16px] font-bold uppercase tracking-[1.2px] text-[#e31837]">
              Active Competitions
            </p>
            <h1 className="mt-5 text-[32px] font-extrabold leading-tight text-[#0d0d14] sm:text-[40px] xl:text-[48px] xl:leading-[48px]">
              Choose Your Album Type
            </h1>
            <p className="mt-2.5 text-[16px] leading-[1.45] text-[#6b7280] sm:text-[20px] sm:leading-[29.25px]">
              Three competition album type. One goal: show your talent and win a prize.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {COMPETITIONS.map((card) => (
              <article
                key={card.title}
                className="relative flex h-full flex-col justify-between rounded-[20px] border border-black/16 bg-white p-6 sm:p-8"
              >
                {card.popular && (
                  <span className="absolute left-1/2 top-[-12px] -translate-x-1/2 rounded-full bg-[#4048cd] px-3 py-1 text-[10px] font-extrabold tracking-[0.5px] text-white">
                    MOST POPULAR
                  </span>
                )}
                <div className="flex flex-col gap-4">
                  <div className="flex size-14 items-center justify-center rounded-lg bg-[#fde8e9]">
                    <ImgIcon src={card.icon} size={32} />
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      <h2 className="text-[24px] font-semibold capitalize leading-7 text-[#0d0d14] sm:text-[32px]">
                        {card.title}
                      </h2>
                      <p className="text-[16px] leading-normal text-[#6b7280]">{card.description}</p>
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {card.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-[14px] text-[#111827]"
                        >
                          <ImgIcon src={card.check} size={13} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[16px] text-[#1b1e56]">
                    <span className="text-[28px] font-semibold text-[#4048cd] sm:text-[32px]">
                      {card.prize}
                    </span>
                    /prize money
                  </p>
                </div>
                <a
                  href="#"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-bold text-white"
                >
                  Enter Now
                  <ImgIcon src={ASSETS.arrow} size={16} />
                </a>
              </article>
            ))}
          </div>
        </Shell>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 sm:py-20 xl:py-[112px]">
        <Shell>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="max-w-[576px]">
              <p className="text-[16px] font-bold uppercase tracking-[1.2px] text-[#e31837]">
                How It Works
              </p>
              <h2 className="mt-2.5 text-[36px] font-extrabold leading-[1.1] text-[#0d0d14] sm:text-[48px] sm:leading-[48px]">
                From Photo to Prize
                <br />
                in 4 Steps
              </h2>
              <p className="mt-2.5 text-[16px] leading-[1.45] text-[#6b7280] sm:text-[20px] sm:leading-[29.25px]">
                A simple, transparent process. Join thousands of photographers who have already won.
              </p>
            </div>

            <div className="flex flex-col">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex gap-5">
                  <div className="flex w-11 flex-col items-center">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[rgba(227,24,55,0.08)] text-[12px] font-extrabold text-[#e31837]">
                      {step.num}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="my-2 min-h-10 w-px flex-1 bg-black/8" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-[20px] font-extrabold leading-6 text-[#0d0d14]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[16px] leading-normal text-[#6b7280]">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
        <div className="border-t border-black/5 px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-0">
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

CompetitionsContent.displayName = 'CompetitionsContent';

export default CompetitionsContent;
