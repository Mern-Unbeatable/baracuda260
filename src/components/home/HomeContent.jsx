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
  hero: `${A}/hero.jpg`,
  heroDots: `${A}/hero-dots.svg`,
  camera: `${A}/icon-camera.svg`,
  book: `${A}/icon-book.svg`,
  sparkle: `${A}/icon-sparkle.svg`,
  check: `${A}/icon-check.svg`,
  checkAlt: `${A}/icon-check-alt.svg`,
  arrow: `${A}/icon-arrow.svg`,
  arrowRed: `${A}/icon-arrow-red.svg`,
  arrowGallery: `${A}/icon-arrow-gallery.svg`,
  heart: `${A}/icon-heart.svg`,
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
  photoGolden: `${A}/photo-golden.jpg`,
  photoAutumn: `${A}/photo-autumn.jpg`,
  photoWings: `${A}/photo-wings.jpg`,
  photoCity: `${A}/photo-city.jpg`,
  photoTidal: `${A}/photo-tidal.jpg`,
  photoForest: `${A}/photo-forest.jpg`,
  photoMorning: `${A}/photo-morning.jpg`,
  photoZodiac: `${A}/photo-zodiac.jpg`,
};

const NAV_LINKS = [
  { label: 'Home', href: '/', active: true },
  { label: 'Competitions', href: '/competitions' },
  { label: 'Gallery', href: '#' },
  { label: 'Leaderboard', href: '#' },
  { label: 'Winners', href: '#' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const ANNOUNCEMENT =
  '🎉 May 2026 winners announced — View now · 📢 June competition is now open — Free to enter · 🏆 This month\'s prize: $500 · 📅 Competition ends in 7 days · ';

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

//this is the home page content

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

const FILTERS = [
  'Single Photo',
  '6 Photo story',
  '12 photos - full Zodiac Story',
];

const SHOWCASE = [
  {
    title: 'Golden Hour Silence',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: 'Single Photo',
    image: ASSETS.photoGolden,
    filter: 'Single Photo',
  },
  {
    title: 'Autumn Sequence',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: '6 PHOTOS STORY',
    image: ASSETS.photoAutumn,
    filter: '6 Photo story',
  },
  {
    title: 'Winqs Over the Marsh',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: 'Single Photo',
    image: ASSETS.photoWings,
    filter: 'Single Photo',
  },
  {
    title: 'City After Midniqht',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: '6 PHOTOS STORY',
    image: ASSETS.photoCity,
    filter: '6 Photo story',
  },
  {
    title: 'Tidal Memory',
    author: 'Sofia R. · Italy',
    votes: '1,488',
    badge: '12 Photos - Full Zodiac Story',
    image: ASSETS.photoTidal,
    filter: '12 photos - full Zodiac Story',
  },
  {
    title: 'Forest Cathedral',
    author: 'Jan M. · Czech',
    votes: '1,488',
    badge: 'Single Photo',
    image: ASSETS.photoForest,
    filter: 'Single Photo',
  },
  {
    title: 'Morninq Fields',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: 'Single Photo',
    image: ASSETS.photoMorning,
    filter: 'Single Photo',
  },
  {
    title: 'Zodiac Journey',
    author: 'Kasia L. · Poland',
    votes: '1,488',
    badge: '12 Photos - Full Zodiac Story',
    image: ASSETS.photoZodiac,
    filter: '12 photos - full Zodiac Story',
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
  },
  {
    rank: '🥈',
    name: 'Piotr Mazur',
    city: 'Warsaw',
    votes: '4,203',
    points: '8,406',
    avatar: ASSETS.avatarPiotr,
  },
  {
    rank: '🥉',
    name: 'Marta Wiśniewska',
    city: 'Wrocław',
    votes: '3,981',
    points: '7,962',
    avatar: ASSETS.avatarMarta,
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

const WINNERS = [
  {
    medal: '🥇',
    name: 'Emma Kowalska',
    work: 'Silence at Dusk',
    votes: '3,210 votes',
    prize: '$300',
    image: ASSETS.winnerEmma,
  },
  {
    medal: '🥈',
    name: 'David Nowak',
    work: 'Urban Rivers',
    votes: '2,891 votes',
    prize: '$150',
    image: ASSETS.winnerDavid,
  },
  {
    medal: '🥉',
    name: 'Marie Blanche',
    work: 'Salt Flats Journey',
    votes: '2,654 votes',
    prize: '$50',
    image: ASSETS.winnerMarie,
  },
];

const FEATURES = [
  {
    icon: ASSETS.trophy,
    title: 'Monthly Cash Prizes',
    text: 'Real money paid via PayPal to top 3 finishers every month.',
  },
  {
    icon: ASSETS.users,
    title: 'Community Voting',
    text: 'Transparent peer voting — every registered user can participate.',
  },
  {
    icon: ASSETS.formats,
    title: '3 Competition Formats',
    text: 'Single photo, story albums, and zodiac series for every style.',
  },
  {
    icon: ASSETS.star,
    title: 'Hall of Fame',
    text: 'Past winners permanently featured in our winners archive.',
  },
  {
    icon: ASSETS.free,
    title: 'Always Free',
    text: 'Zero entry fees. Participation is and always will be free.',
  },
  {
    icon: ASSETS.globe,
    title: 'Global Community',
    text: 'Photographers from over 40 countries competing each month.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'Thanks to My12Photos, my work reached thousands of people. This is the best photography community I have ever been part of.',
    name: 'Anna Kowalska',
    role: 'July 2025 Winner',
    avatar: ASSETS.avatarAnna,
    stars: 5,
  },
  {
    quote:
      'The platform is incredibly clean and elegant. Voting is a pleasure, and the prizes genuinely motivate you to push your craft.',
    name: 'Piotr Mazur',
    role: 'Top 3 — June 2025',
    avatar: ASSETS.avatarPiotr,
    stars: 5,
  },
  {
    quote:
      'I received more meaningful feedback here than on every other platform combined. I recommend it to every photographer.',
    name: 'Marta Wiśniewska',
    role: 'Zodiac Album Winner',
    avatar: ASSETS.avatarMarta,
    stars: 4.5,
  },
];

const Shell = memo(({ children, className = '' }) => (
  <div className={`mx-auto w-full max-w-[1536px] px-4 sm:px-6 md:px-8 lg:px-12 ${className}`}>
    {children}
  </div>
));
Shell.displayName = 'Shell';

const ImgIcon = memo(({ src, size = 16, className = '' }) => (
  <span className={`inline-flex shrink-0 overflow-hidden ${className}`} style={{ width: size, height: size }}>
    <img src={src} alt="" width={size} height={size} className="h-full w-full object-contain" />
  </span>
));
ImgIcon.displayName = 'ImgIcon';

const HomeContent = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState(FILTERS[0]);

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

  const photos =
    filter === FILTERS[0]
      ? SHOWCASE
      : SHOWCASE.filter((p) => p.filter === filter);

  return (
    <div className="site-page-root home-page-root w-full overflow-x-hidden bg-white">
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
              <a
                href="#"
                className="rounded-full bg-[#4048cd] px-6 py-3 text-[16px] font-medium text-white"
              >
                Log IN
              </a>
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
              <a
                href="#"
                className="rounded-full bg-[#4048cd] px-6 py-3 text-center text-sm font-medium text-white"
              >
                Log IN
              </a>
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

      {/* Hero */}
      <section className="relative min-h-[560px] w-full overflow-hidden md:min-h-[720px] xl:min-h-[890px]">
        <img
          src={ASSETS.hero}
          alt=""
          width={1920}
          height={890}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b1e56] from-[28%] via-[#1b1e56]/70 to-transparent" />
        <div className="relative mx-auto flex min-h-[560px] w-full max-w-[1920px] items-center px-4 py-16 sm:px-6 md:min-h-[720px] md:px-10 xl:min-h-[890px] xl:px-[192px]">
          <div className="flex w-full max-w-[900px] flex-col gap-9">
            <div className="flex flex-col gap-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-[17px] py-[7px]">
                <span className="size-2 rounded-full bg-[#05df72]" />
                <span className="text-sm font-semibold text-white">Competitions live — July 2026</span>
              </div>
              <h1 className="text-[36px] font-extrabold uppercase leading-[1.15] tracking-[-1.44px] text-white sm:text-[48px] xl:text-[64px] xl:leading-[77.76px]">
                12 Photos - Full Zodiac Story
              </h1>
              <p className="max-w-[720px] text-[16px] leading-[1.6] text-white sm:text-[20px] sm:leading-[32.5px]">
                Join over 12,000 photographers. Free competitions, community voting, cash prizes
                every month.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
              >
                Join a Competition
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-[#4048cd] px-6 py-3 text-[16px] font-medium text-white"
              >
                Explore Gallery
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[50px] left-1/2 h-[14px] w-[77px] -translate-x-1/2">
          <img src={ASSETS.heroDots} alt="" width={77} height={14} className="h-full w-full" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1b1e56] py-10 xl:py-12">
        <Shell>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
            {[
              ['14,820+', 'Registered Photographers'],
              ['89,450+', 'Photos Submitted'],
              ['342,100+', 'Votes Cast'],
              ['120×', 'Cash Prizes Awarded'],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <p className="text-[32px] font-extrabold leading-none text-white sm:text-[40px] xl:text-[48px]">
                  {value}
                </p>
                <p className="mt-4 text-[14px] font-medium tracking-wide text-white/70 sm:text-[16px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Shell>
      </section>

      {/* Active Competitions */}
      <section className="bg-[#f7f8fa] py-16 sm:py-20 xl:py-[114px]">
        <Shell>
          <div className="mx-auto mb-11 max-w-[682px] text-center">
            <p className="text-[16px] font-bold uppercase tracking-[1.2px] text-[#e31837]">
              Active Competitions
            </p>
            <h2 className="mt-5 text-[32px] font-extrabold leading-tight text-[#0d0d14] sm:text-[40px] xl:text-[48px] xl:leading-[48px]">
              Choose Your Album Type
            </h2>
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
                      <h3 className="text-[24px] font-semibold capitalize leading-7 text-[#0d0d14] sm:text-[32px]">
                        {card.title}
                      </h3>
                      <p className="text-[16px] leading-normal text-[#6b7280]">{card.description}</p>
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {card.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-[14px] text-[#111827]">
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
                    <h3 className="text-[20px] font-extrabold leading-6 text-[#0d0d14]">{step.title}</h3>
                    <p className="mt-1.5 text-[16px] leading-normal text-[#6b7280]">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Shell>
      </section>

      {/* Photo Showcase */}
      <section className="bg-white py-16 sm:py-20">
        <Shell>
          <div className="mb-8 flex flex-col gap-6 lg:mb-[52px] lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#666dd7]">
                Community Work
              </p>
              <h2 className="mt-2 text-[36px] font-extrabold text-[#0d0d14] sm:text-[48px] sm:leading-[66px]">
                Photo Showcase
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold transition ${
                    filter === item
                      ? 'bg-[#4048cd] text-white'
                      : 'bg-[#f3f4f6] text-[#6b7280]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {photos.map((photo) => (
              <article
                key={photo.title}
                className="overflow-hidden rounded-[12px] border border-black/10 bg-white"
              >
                <div className="relative h-[220px] sm:h-[252px]">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    width={368}
                    height={252}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0d0d14]">
                    {photo.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-[16px] font-bold text-[#0d0d14]">{photo.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-[14px] text-[#6b7280]">
                    <span>{photo.author}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <ImgIcon src={ASSETS.heart} size={24} />
                      {photo.votes}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-[#ee1c25] px-8 py-3.5 text-[16px] font-bold text-white"
            >
              View Full Gallery
              <ImgIcon src={ASSETS.arrowGallery} size={16} />
            </a>
          </div>
        </Shell>
      </section>

      {/* Leaderboard */}
      <section className="bg-[#f7f8fa] py-16 sm:py-20 xl:py-[114px]">
        <Shell>
          <div className="mb-11 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#e31837]">
                Leaderboard
              </p>
              <h2 className="mt-3 text-[36px] font-extrabold text-[#0d0d14] sm:text-[48px] sm:leading-[48px]">
                Top Photographers
              </h2>
              <p className="mt-2 text-[16px] text-[#6b7280]">July 2026 — Live standings</p>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-[14px] font-bold text-[#e31837]">
              Full leaderboard
              <ImgIcon src={ASSETS.arrowRed} size={16} />
            </a>
          </div>

          <div className="mb-9 flex items-end justify-center gap-6 sm:gap-10">
            {[
              {
                emoji: '🥈',
                name: 'Piotr',
                city: 'Warsaw',
                votes: '4,203 votes',
                avatar: ASSETS.avatarPiotr,
                size: 64,
                border: 'border-[#e5e7eb]',
              },
              {
                emoji: '🥇',
                name: 'Anna',
                city: 'Kraków',
                votes: '4,821 votes',
                avatar: ASSETS.avatarAnna,
                size: 80,
                border: 'border-[#fdc700]',
                lift: true,
              },
              {
                emoji: '🥉',
                name: 'Marta',
                city: 'Wrocław',
                votes: '3,981 votes',
                avatar: ASSETS.avatarMarta,
                size: 56,
                border: 'border-[#fee685]',
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`flex w-[80px] flex-col items-center text-center ${p.lift ? '-mt-4' : 'mt-2'}`}
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
                <p className="text-[12px] text-[#6b7280]">{p.city}</p>
                <p className="mt-1 text-[14px] font-bold text-[#e31837]">{p.votes}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-black/20 bg-white">
            <table className="min-w-[720px] w-full text-left">
              <thead className="bg-[#f7f8fa] text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280]">
                <tr className="border-b border-black/20">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Photographer</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4 text-right">Votes</th>
                  <th className="px-6 py-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map((row) => (
                  <tr key={row.name} className="border-b border-black/20 last:border-b-0">
                    <td className="px-6 py-5 text-[14px] font-extrabold text-[#e31837]">{row.rank}</td>
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
                    <td className="px-6 py-5 text-right text-[14px] text-[#6b7280]">{row.points}</td>
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
                May 2026
              </p>
              <h2 className="mt-3 text-center text-[32px] font-extrabold tracking-[-0.9px] text-white sm:text-[36px]">
                Monthly Winners
              </h2>
              <p className="mt-2 text-center text-[16px] text-white">
                Congratulations to our May 2026 champions
              </p>

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
                    <h3 className="mt-3 text-[18px] font-extrabold">{w.name}</h3>
                    <p className="text-[14px]">{w.work}</p>
                    <p className="mt-1 text-[12px]">{w.votes}</p>
                    <p className="mt-4 text-[24px] font-extrabold">{w.prize}</p>
                    <p className="mb-4 text-[12px]">Cash prize via PayPal</p>
                    <a
                      href="#"
                      className="inline-flex h-[34px] w-full items-center justify-center rounded-[14px] border border-white/20 bg-white/8 text-[12px] font-bold"
                    >
                      View Album
                    </a>
                  </article>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a href="#" className="text-[14px] font-semibold text-white">
                  View all previous winners →
                </a>
              </div>
            </div>
          </div>
        </Shell>
      </section>

      {/* Why My12Photos */}
      <section className="bg-white py-16 sm:py-20">
        <Shell>
          <div className="mb-11 max-w-[290px]">
            <p className="text-[16px] font-bold uppercase tracking-[1.65px] text-[#3f51b5]">
              The Platform
            </p>
            <h2 className="mt-[18px] text-[36px] font-extrabold tracking-[-0.9px] text-[#111827]">
              Why My12Photos
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl border border-black/17 p-[25px]"
              >
                <div className="mb-2.5 flex size-10 items-center justify-center rounded-[14px] bg-[#eef2ff]">
                  <ImgIcon src={f.icon} size={18} />
                </div>
                <h3 className="text-[24px] font-extrabold leading-[27px] text-[#111827]">{f.title}</h3>
                <p className="mt-2.5 max-w-[324px] text-[16px] leading-[22.75px] text-[#6b7280]">
                  {f.text}
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
              Testimonials
            </p>
            <h2 className="mt-3 text-[32px] font-extrabold tracking-[-0.96px] text-[#0d0d14] sm:text-[48px]">
              What Photographers Say
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <article
                key={t.name}
                className="flex flex-col rounded-2xl border border-black/8 bg-white p-8"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ImgIcon
                      key={i}
                      src={i < Math.floor(t.stars) ? ASSETS.starFull : ASSETS.starHalf}
                      size={16}
                    />
                  ))}
                </div>
                <p className="flex-1 text-[14px] leading-[22.75px] text-[#0d0d14]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[14px] font-bold text-[#0d0d14]">{t.name}</p>
                    <p className="text-[12px] text-[#6b7280]">{t.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Shell>
      </section>

      {/* Newsletter */}
      <section className="bg-white py-10 sm:py-16">
        <Shell>
          <div className="relative overflow-hidden rounded-2xl bg-[#4048cd] px-4 py-16 sm:px-8 sm:py-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.22]"
              style={{
                backgroundImage: `url(${ASSETS.newsletterBg})`,
                backgroundSize: '1024px 1024px',
                backgroundPosition: 'top left',
              }}
            />
            <div className="relative mx-auto flex max-w-[640px] flex-col items-center gap-8 text-center">
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

HomeContent.displayName = 'HomeContent';

export default HomeContent;
