import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, SITE_NAV_LINKS } from '../../config';
import { GALLERY_PHOTOS, galleryDetailPath } from '../../data/galleryPhotos';

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
  heart: `${A}/icon-heart.svg`,
  checkbox: `${A}/icon-checkbox.svg`,
  pageFirst: `${A}/icon-page-first.svg`,
  pagePrev: `${A}/icon-page-prev.svg`,
  pageNext: `${A}/icon-page-next.svg`,
};

const NAV_LINKS = SITE_NAV_LINKS.map(({ label, href }) => ({
  label,
  href,
  active: href === ROUTES.GALLERY,
}));

const ANNOUNCEMENT =
  "🎉 May 2026 winners announced — View now · 📢 June competition is now open — Free to enter · 🏆 This month's prize: $500 · 📅 Competition ends in 7 days · ";

const ALBUM_TYPES = [
  'Single Photo',
  '6 Photo Story',
  '12 photos - full Zodiac Story',
];

const CATEGORIES = [
  'Nature',
  'Portrait',
  'Wildlife',
  'Landscape',
  'Street Photography',
  'Architecture',
  'Black & White',
  'Travel',
  'Wedding',
  'Macro',
  'Fine Art',
  'Pets',
  'Sports',
  'Night Photography',
];

const PHOTOS = GALLERY_PHOTOS;

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

const FilterGroup = memo(({ title, options, selected, onToggle }) => (
  <div>
    <h3 className="text-[18px] font-bold leading-6 text-[#0d0d14] sm:text-[20px]">{title}</h3>
    <ul className="mt-4 flex flex-col gap-4">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <li key={option}>
            <label className="flex cursor-pointer items-center gap-2 text-[14px] leading-5 text-[#111827]">
              <span className="relative inline-flex size-4 shrink-0 items-center justify-center overflow-hidden">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(option)}
                  className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                />
                <span className="size-4 rounded-[3px] border border-[#d1d5db] bg-white peer-checked:border-[#ee1c25] peer-checked:bg-[#ee1c25]" />
                {checked && (
                  <img
                    src={ASSETS.checkbox}
                    alt=""
                    width={10}
                    height={10}
                    className="pointer-events-none absolute size-2.5 invert"
                  />
                )}
              </span>
              <span>{option}</span>
            </label>
          </li>
        );
      })}
    </ul>
  </div>
));
FilterGroup.displayName = 'FilterGroup';

const GalleryContent = memo(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [albumTypes, setAlbumTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);

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

  const toggle = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  return (
    <div className="site-page-root gallery-page-root w-full overflow-x-hidden bg-white">
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

      {/* Gallery main */}
      <section className="bg-white py-10 sm:py-14 xl:py-16">
        <Shell>
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#666dd7]">
                Community Work
              </p>
              <h1 className="mt-1 text-[32px] font-extrabold text-[#0d0d14]">Photo Showcase</h1>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-[#0d0d14]"
            >
              {filtersOpen ? 'Hide Filters' : 'Filters'}
            </button>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-[103px]">
            {/* Sidebar */}
            <aside
              className={`w-full shrink-0 lg:w-[285px] ${filtersOpen ? 'block' : 'hidden lg:block'}`}
            >
              <div className="flex flex-col gap-10">
                <FilterGroup
                  title="Album Type"
                  options={ALBUM_TYPES}
                  selected={albumTypes}
                  onToggle={(value) => toggle(albumTypes, setAlbumTypes, value)}
                />
                <FilterGroup
                  title="Category"
                  options={CATEGORIES}
                  selected={categories}
                  onToggle={(value) => toggle(categories, setCategories, value)}
                />
              </div>
            </aside>

            {/* Grid */}
            <div className="min-w-0 flex-1">
              <div className="mb-8 hidden lg:block">
                <p className="text-[14px] font-bold uppercase tracking-[1.2px] text-[#666dd7]">
                  Community Work
                </p>
                <h1 className="mt-2 text-[48px] font-extrabold leading-[66px] text-[#0d0d14]">
                  Photo Showcase
                </h1>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {PHOTOS.map((photo) => (
                  <AppLink
                    key={photo.id}
                    href={galleryDetailPath(photo.id)}
                    className="block overflow-hidden rounded-[12px] border border-black/10 bg-white transition hover:border-black/20 hover:shadow-sm"
                  >
                    <article>
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
                        <h2 className="text-[16px] font-bold text-[#0d0d14]">{photo.title}</h2>
                        <div className="mt-2 flex items-center justify-between text-[14px] text-[#6b7280]">
                          <span>{photo.author}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <ImgIcon src={ASSETS.heart} size={24} />
                            {photo.votes}
                          </span>
                        </div>
                      </div>
                    </article>
                  </AppLink>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-[5px]">
                <button
                  type="button"
                  aria-label="First page"
                  onClick={() => setPage(1)}
                  className="flex size-8 items-center justify-center rounded-full border border-[#e5e7eb]"
                >
                  <ImgIcon src={ASSETS.pageFirst} size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex size-8 items-center justify-center rounded-full border border-[#e5e7eb]"
                >
                  <ImgIcon src={ASSETS.pagePrev} size={14} />
                </button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`flex size-8 items-center justify-center rounded-full text-[14px] font-semibold ${
                      page === n
                        ? 'bg-[#ee1c25] text-white'
                        : 'border border-[#e5e7eb] text-[#0d0d14]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-1 text-[14px] text-[#6b7280]">…</span>
                <button
                  type="button"
                  onClick={() => setPage(10)}
                  className={`flex size-8 items-center justify-center rounded-full text-[14px] font-semibold ${
                    page === 10
                      ? 'bg-[#ee1c25] text-white'
                      : 'border border-[#e5e7eb] text-[#0d0d14]'
                  }`}
                >
                  10
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => setPage((p) => Math.min(10, p + 1))}
                  className="flex size-8 items-center justify-center rounded-full border border-[#e5e7eb]"
                >
                  <ImgIcon src={ASSETS.pageNext} size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Last page"
                  onClick={() => setPage(10)}
                  className="flex size-8 items-center justify-center rounded-full border border-[#e5e7eb]"
                >
                  <span className="inline-flex scale-x-[-1]">
                    <ImgIcon src={ASSETS.pageFirst} size={14} />
                  </span>
                </button>
              </div>
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

GalleryContent.displayName = 'GalleryContent';

export default GalleryContent;
