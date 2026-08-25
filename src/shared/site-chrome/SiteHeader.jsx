import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ROUTES, SITE_NAV_LINKS } from '@/shared/config';
import { ACTION_BTN_PRIMARY } from '@/shared/ui/actionStyles';
import { selectIsAuthenticated } from '@/app/store/slices/authSlice';
import { SITE_ASSETS } from './siteAssets';
import AppLink from './AppLink';
import LanguageSwitcher from '@/components/common/LanguageSwitcher/LanguageSwitcher';

const SiteHeader = memo(({ activeHref }) => {
  const { t } = useTranslation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = SITE_NAV_LINKS.map(({ labelKey, href }) => ({
    labelKey,
    href,
    active: href === activeHref,
  }));

  const headerBtnClass = `${ACTION_BTN_PRIMARY} whitespace-nowrap`;

  const authActions = isAuthenticated ? (
    <AppLink
      href={ROUTES.ADMIN_DASHBOARD}
      onClick={() => setMenuOpen(false)}
      className={headerBtnClass}
    >
      {t('header.dashboard')}
    </AppLink>
  ) : (
    <>
      <AppLink
        href={ROUTES.LOGIN}
        onClick={() => setMenuOpen(false)}
        className={`${headerBtnClass} !bg-[#4048CD] !hover:bg-[#333BB0]`}
      >
        {t('header.logIn')}
      </AppLink>
      <AppLink
        href={ROUTES.SIGNUP}
        onClick={() => setMenuOpen(false)}
        className={headerBtnClass}
      >
        {t('header.registerFree')}
      </AppLink>
    </>
  );

  return (
    <header className="relative border-b border-black/4 bg-white">
      <div className="mx-auto flex w-full max-w-480 items-center justify-between gap-3 py-2.5 pl-4 pr-3 sm:gap-4 sm:px-6 md:px-10 lg:px-12 2xl:gap-6 2xl:px-16 min-[1920px]:px-48">
        <AppLink
          href={ROUTES.HOME}
          className="relative flex h-13 w-42.5 shrink-0 items-center sm:h-16.75 sm:w-55"
        >
          <img
            src={SITE_ASSETS.logo}
            alt="My 12 Photos"
            width={220}
            height={68}
            className="h-full w-full object-contain object-left"
          />
        </AppLink>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 2xl:flex 2xl:gap-3 min-[1920px]:gap-4"
          aria-label="Primary"
        >
          {navLinks.map(({ labelKey, href, active }) => (
            <AppLink
              key={href}
              href={href}
              className={`whitespace-nowrap px-2 py-2 text-center text-[13px] font-semibold leading-5 min-[1920px]:px-3 min-[1920px]:text-[14px] transition-colors duration-300 ${
                active ? 'text-[#ee1c25]' : 'text-[#6b7280] hover:text-[#4049CD] hover:underline'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {t(labelKey)}
            </AppLink>
          ))}
        </nav>

      <div className="hidden shrink-0 items-center gap-2 sm:gap-3 2xl:flex 2xl:gap-4">
          <LanguageSwitcher />
          <div className="flex items-center gap-2 2xl:gap-3 [&_a]:px-4 [&_a]:py-2 [&_a]:text-[14px] min-[1920px]:[&_a]:px-6 min-[1920px]:[&_a]:py-2 min-[1920px]:[&_a]:text-[16px]">
            {authActions}
          </div>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 text-[#1b1e56] 2xl:hidden"
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
        <div className="border-t border-black/5 bg-white px-4 py-4 2xl:hidden">
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
            <div className="flex flex-col gap-2 [&_a]:text-center [&_a]:text-sm">{authActions}</div>
          </div>
        </div>
      )}
    </header>
  );
});

SiteHeader.displayName = 'SiteHeader';

export default SiteHeader;
