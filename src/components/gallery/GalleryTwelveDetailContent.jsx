import React, { memo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES, SITE_NAV_LINKS } from '../../config';
import { getGalleryTwelveStoryById } from '../../data/galleryTwelveStory';

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
  photographer: `${A}/avatar-photographer.jpg`,
  commentAvatar: `${A}/avatar-comment.jpg`,
  verified: `${A}/icon-verified.svg`,
  voteHeart: `${A}/icon-vote-heart.svg`,
  arrow: `${A}/icon-arrow-nav.svg`,
  curve: `${A}/curve-story-12.svg`,
};

const NAV_LINKS = SITE_NAV_LINKS.map(({ label, href }) => ({
  label,
  href,
  active: href === ROUTES.GALLERY,
}));

const ANNOUNCEMENT =
  "🎉 May 2026 winners announced — View now · 📢 June competition is now open — Free to enter · 🏆 This month's prize: $500 · 📅 Competition ends in 7 days · ";

const COMMENTS = [
  {
    name: 'Darrell Steward',
    text: 'I really like the composition and the colors. Amazing work!',
  },
  {
    name: 'Darrell Steward',
    text: 'Your creativity really stands out. Best of luck in the competition!',
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

const GalleryTwelveDetailContent = memo(() => {
  const { id } = useParams();
  const story = getGalleryTwelveStoryById(id);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [comment, setComment] = useState('');

  const slides = story.slides;
  const activeSlide = slides[activeIndex] || slides[0];
  const isBlueTheme = activeSlide.theme === 'blue';

  useEffect(() => {
    setActiveIndex(0);
  }, [story.id]);

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

  const goPrev = () => setActiveIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const goNext = () => setActiveIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className="site-page-root gallery-twelve-detail-page-root w-full overflow-x-hidden bg-white">
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

      {/* Hero + story strip */}
      <section className="bg-white pt-8 sm:pt-10 xl:pt-12">
        <Shell>
          <div className="relative aspect-[1536/653] w-full overflow-hidden rounded-[16px] sm:rounded-[20px]">
            <img
              src={activeSlide.hero}
              alt={`${story.title} — ${activeSlide.sign}`}
              width={1536}
              height={653}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className={`absolute left-3 top-3 flex items-center gap-2 rounded-[20px] px-4 py-1 sm:left-6 sm:top-6 sm:px-5 sm:py-[5px] ${
                isBlueTheme ? 'bg-[#4048cd]' : 'bg-[#ee1c25]'
              }`}
            >
              <span
                className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${
                  isBlueTheme
                    ? 'size-[28px] sm:size-[35px]'
                    : 'h-[18px] w-[20px] sm:h-[21px] sm:w-6'
                } ${activeSlide.iconBoxed ? 'rounded-[4px] bg-[#4048cd]' : ''}`}
              >
                <img
                  src={activeSlide.icon}
                  alt=""
                  width={35}
                  height={35}
                  className={`object-contain ${
                    activeSlide.iconBoxed
                      ? 'h-[16px] w-[16px] sm:h-[20px] sm:w-[20px]'
                      : 'h-full w-full'
                  }`}
                />
              </span>
              <span className="text-[16px] leading-none text-white sm:text-[20px]">
                {activeSlide.sign}
              </span>
            </div>

            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex size-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:left-[51px] sm:size-[51px]"
            >
              <img
                src={ASSETS.arrow}
                alt=""
                width={16}
                height={32}
                className="h-7 w-3.5 rotate-180 object-contain sm:h-8 sm:w-4"
              />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex size-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm sm:right-[51px] sm:size-[51px]"
            >
              <img
                src={ASSETS.arrow}
                alt=""
                width={16}
                height={32}
                className="h-7 w-3.5 object-contain sm:h-8 sm:w-4"
              />
            </button>
          </div>

          <div className="relative mt-2 h-10 w-full overflow-hidden sm:mt-3 sm:h-[72px] xl:h-[103px]">
            <img
              src={ASSETS.curve}
              alt=""
              className="h-full w-full object-contain object-top"
            />
          </div>

          <div className="mt-2 w-full overflow-x-auto pb-2">
            <div className="grid min-w-[1100px] grid-cols-12 gap-2 lg:min-w-0 xl:gap-3">
              {slides.map((slide, index) => {
                const blue = slide.theme === 'blue';
                return (
                  <div key={slide.id} className="flex flex-col items-center gap-2">
                    <div className="flex w-full flex-col items-center gap-2">
                      <span
                        className={`inline-flex size-[26px] items-center justify-center rounded-full bg-[#fde8e9] text-[14px] sm:size-[30px] sm:text-[18px] ${
                          blue ? 'text-[#4048cd]' : 'text-[#ee1c25]'
                        }`}
                      >
                        {slide.number}
                      </span>
                      <span
                        className={`relative inline-flex size-[28px] items-center justify-center overflow-hidden sm:size-[35px] ${
                          blue
                            ? slide.iconBoxed
                              ? 'rounded-[4px] bg-[#4048cd]'
                              : ''
                            : 'rounded bg-[#ee1c25] px-1.5 py-1'
                        }`}
                      >
                        <img
                          src={slide.icon}
                          alt=""
                          width={35}
                          height={35}
                          className={`object-contain ${
                            blue
                              ? slide.iconBoxed
                                ? 'h-[16px] w-[16px] sm:h-[20px] sm:w-[20px]'
                                : 'h-full w-full'
                              : 'h-[16px] w-[18px] sm:h-[21px] sm:w-6'
                          }`}
                        />
                      </span>
                      <span className="truncate text-center text-[12px] text-[#2b2b2b] sm:text-[14px] xl:text-[16px]">
                        {slide.sign}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show ${slide.sign}`}
                      aria-pressed={index === activeIndex}
                      className={`relative h-[72px] w-full overflow-hidden rounded-lg sm:h-[100px] xl:h-[120px] ${
                        index === activeIndex
                          ? 'border-[3px] border-[#ee1c25]'
                          : 'border border-black/10'
                      }`}
                    >
                      <img
                        src={slide.thumb}
                        alt={slide.sign}
                        width={112}
                        height={120}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
            >
              Download
            </a>
          </div>
        </Shell>
      </section>

      {/* Details */}
      <section className="bg-white py-10 sm:py-12 xl:py-14">
        <Shell>
          <div className="flex flex-wrap gap-3 sm:gap-8">
            {[story.badge, story.category].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#ecedfa] px-4 py-[5px] text-[14px] font-bold uppercase tracking-[1.2px] text-[#4048cd] sm:text-[16px]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-[#111827] sm:mt-5 sm:text-[32px] xl:text-[36px]">
            {story.title}
          </h1>
          <p className="mt-4 text-[16px] font-medium leading-7 text-[#3e3f40] sm:text-[18px] sm:leading-8 xl:text-[20px] xl:leading-[30px]">
            {story.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-[21px]">
            {[
              { label: 'VOTES RECEIVED', value: story.votes },
              { label: 'VIEWS COUNTED', value: story.views },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center gap-[15px] rounded-2xl border border-black/[0.08] bg-[#f5f5f5] p-3 text-center"
              >
                <p className="w-full text-[14px] font-bold uppercase tracking-[1.2px] text-[#6b7280]">
                  {stat.label}
                </p>
                <p className="w-full text-[20px] font-bold text-[#111827]">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-black/10 pt-8">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
            >
              <ImgIcon src={ASSETS.voteHeart} size={20} />
              Cast Your Vote
            </button>
          </div>

          <div className="mt-8 flex items-center gap-[12px] sm:mt-9">
            <img
              src={ASSETS.photographer}
              alt={story.photographer}
              width={57}
              height={57}
              className="size-[48px] rounded-full object-cover sm:size-[57px]"
            />
            <div>
              <p className="text-[14px] leading-[22px] text-[#6b7280] sm:text-[16px]">
                Photographer
              </p>
              <p className="text-[18px] font-bold leading-[27px] text-[#111827] sm:text-[20px]">
                {story.photographer}
              </p>
            </div>
          </div>
        </Shell>
      </section>

      {/* Comments */}
      <section className="bg-white pb-12 sm:pb-16">
        <Shell>
          <div className="overflow-hidden rounded-lg bg-[#f8fafc] p-4 sm:p-6">
            <h2 className="text-[22px] font-semibold text-[#101112] sm:text-[24px]">Comments</h2>

            <ul className="mt-6 flex flex-col">
              {COMMENTS.map((item, index) => (
                <li
                  key={`${item.name}-${index}`}
                  className="border-b border-[#c8c8c8] pb-4 pt-0 first:pt-0 [&:not(:first-child)]:pt-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ASSETS.commentAvatar}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 rounded-full object-cover"
                      />
                      <p className="text-[14px] font-medium leading-5 text-[#191c1f]">{item.name}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#4048cd] px-1.5 py-0.5 text-[14px] text-white">
                      <ImgIcon src={ASSETS.verified} size={16} />
                      Verified
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] leading-5 text-[#475156]">{item.text}</p>
                </li>
              ))}
            </ul>

            <form
              className="mt-6 flex flex-col gap-4 rounded-lg bg-[#e6f0f8] p-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="gallery-six-comment"
                  className="text-[18px] font-medium text-black sm:text-[20px]"
                >
                  Comment
                </label>
                <textarea
                  id="gallery-six-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your comment"
                  rows={6}
                  className="w-full resize-y rounded-lg bg-white p-2.5 text-[12px] text-[#373737] outline-none placeholder:text-[#373737]"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded bg-[#ee1c25] px-2.5 py-3 text-[16px] font-medium text-white"
              >
                Submit
              </button>
            </form>
          </div>
        </Shell>
      </section>

      {/* Newsletter */}
      <section className="bg-white pb-10 xl:pb-12">
        <Shell>
          <div className="relative overflow-hidden rounded-2xl bg-[#4048cd] px-4 py-14 sm:px-8 sm:py-16 xl:py-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.22]"
              style={{
                backgroundImage: `url(${ASSETS.newsletterBg})`,
                backgroundSize: '1024px 1024px',
                backgroundPosition: 'top left',
              }}
            />
            <div className="relative mx-auto flex max-w-[640px] flex-col items-center gap-8 text-center">
              <div className="flex flex-col gap-2">
                <h2 className="text-[32px] font-semibold text-white sm:text-[40px] xl:text-[48px]">
                  Stay Updated
                </h2>
                <p className="text-[16px] text-[#eaeaea] sm:text-[18px] xl:text-[20px]">
                  Receive competition announcements, winner reveals, and photography tips.
                </p>
              </div>
              <form
                className="flex w-full max-w-[520px] flex-col gap-3 rounded-[33px] bg-white/24 p-3 sm:flex-row sm:items-center sm:justify-between"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="flex w-full items-center gap-1 rounded-3xl bg-white px-4 py-3 sm:max-w-[316px]">
                  <ImgIcon src={ASSETS.mail} size={24} />
                  <input
                    type="email"
                    placeholder="Enter your email here..."
                    className="w-full bg-transparent text-[12px] text-[#222] outline-none placeholder:text-[#7d7d7d]"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-[27px] bg-[#ee1c25] px-8 py-3 text-[16px] text-white sm:px-12"
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
        <Shell className="py-12 sm:py-16">
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(3,1fr)] xl:gap-8">
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
                A photography platform connecting photo enthusiasts and rewarding the best work every
                month.
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
        <div className="border-t border-black/5">
          <Shell className="py-6">
            <p className="text-[16px] font-medium text-[#191818] sm:text-[20px] sm:leading-5">
              © 2026 My12Photos. All rights reserved.
            </p>
          </Shell>
        </div>
      </footer>
    </div>
  );
});

GalleryTwelveDetailContent.displayName = 'GalleryTwelveDetailContent';

export default GalleryTwelveDetailContent;
