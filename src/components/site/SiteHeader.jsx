import React, { memo, useState } from 'react';
import { SITE_NAV_LINKS } from '../../config';
import { SITE_ASSETS } from './siteAssets';
import AppLink from './AppLink';
import ImgIcon from './ImgIcon';

const SiteHeader = memo(({ activeHref }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = SITE_NAV_LINKS.map(({ label, href }) => ({
    label,
    href,
    active: href === activeHref,
  }));

  return (
    <header className="relative z-50 border-b border-black/[0.04] bg-[rgba(236,237,250,0.16)] backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 md:px-10 xl:px-[192px]">
        <AppLink
          href="/"
          className="relative h-[52px] w-[170px] shrink-0 overflow-hidden sm:h-[67px] sm:w-[220px]"
        >
          <img
            src={SITE_ASSETS.logo}
            alt="My 12 Photos"
            width={220}
            height={68}
            className="absolute left-0 top-[-110%] h-[326%] w-full max-w-none object-cover"
          />
        </AppLink>

        <nav className="hidden items-center gap-1 2xl:flex" aria-label="Primary">
          {navLinks.map(({ label, href, active }) => (
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
            <ImgIcon src={SITE_ASSETS.chevron} size={24} />
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
            {navLinks.map(({ label, href, active }) => (
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
  );
});

SiteHeader.displayName = 'SiteHeader';

export default SiteHeader;
