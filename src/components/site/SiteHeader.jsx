import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ROUTES, SITE_NAV_LINKS } from '../../config';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { SITE_ASSETS } from './siteAssets';
import AppLink from './AppLink';
import LanguageSwitcher from './LanguageSwitcher';

const SiteHeader = memo(({ activeHref }) => {
  const { t } = useTranslation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = SITE_NAV_LINKS.map(({ labelKey, href }) => ({
    labelKey,
    href,
    active: href === activeHref,
  }));

  const authActions = isAuthenticated ? (
    <AppLink
      href={ROUTES.ADMIN_DASHBOARD}
      onClick={() => setMenuOpen(false)}
      className="rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
    >
      {t('header.dashboard')}
    </AppLink>
  ) : (
    <>
      <AppLink
        href={ROUTES.LOGIN}
        onClick={() => setMenuOpen(false)}
        className="rounded-full bg-[#4048cd] px-6 py-3 text-[16px] font-medium text-white"
      >
        {t('header.logIn')}
      </AppLink>
      <AppLink
        href={ROUTES.SIGNUP}
        onClick={() => setMenuOpen(false)}
        className="rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
      >
        {t('header.registerFree')}
      </AppLink>
    </>
  );

  return (
    <header className="relative border-b border-black/[0.04] bg-white">
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 md:px-10 xl:px-[192px]">
        <AppLink
          href="/"
          className="relative flex h-[52px] w-[170px] shrink-0 items-center sm:h-[67px] sm:w-[220px]"
        >
          <img
            src={SITE_ASSETS.logo}
            alt="My 12 Photos"
            width={220}
            height={68}
            className="h-full w-full object-contain object-left"
          />
        </AppLink>

        <nav className="hidden items-center gap-4 2xl:flex" aria-label="Primary">
          {navLinks.map(({ labelKey, href, active }) => (
            <AppLink
              key={href}
              href={href}
              className={`px-3 py-2 text-center text-[14px] font-semibold leading-5 ${
                active ? 'text-[#ee1c25]' : 'text-[#6b7280]'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {t(labelKey)}
            </AppLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <LanguageSwitcher />
          <div className="flex items-center gap-4">{authActions}</div>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1b1e56] xl:hidden"
          aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
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
            {navLinks.map(({ labelKey, href, active }) => (
              <AppLink
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  active ? 'bg-[#ee1c25]/5 text-[#ee1c25]' : 'text-[#6b7280]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {t(labelKey)}
              </AppLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-black/5 pt-4">
            <LanguageSwitcher className="w-full [&_button]:w-full [&_button]:justify-between" />
            <div className="flex flex-col gap-2 [&_a]:text-center [&_a]:text-sm">
              {authActions}
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

SiteHeader.displayName = 'SiteHeader';

export default SiteHeader;
