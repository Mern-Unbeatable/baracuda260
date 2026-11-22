import React, { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/app/store/slices/authSlice';
import LanguageSwitcher from '@/components/common/LanguageSwitcher/LanguageSwitcher';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { ROUTES, SITE_NAV_LINKS } from '@/shared/config';
import { ACTION_BTN_PRIMARY } from '@/shared/ui/actionStyles';
import { getDashboardRouteByRole } from '@/shared/utils/roles';
import AppLink from './AppLink';
import { SITE_ASSETS } from './siteAssets';

const SiteHeader = memo(({ activeHref }) => {
  const { t } = useTranslation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = SITE_NAV_LINKS.map(({ labelKey, href }) => ({
    labelKey,
    href,
    active: href === activeHref,
  }));

  const headerBtnClass = `${ACTION_BTN_PRIMARY} whitespace-nowrap`;

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  // Close when navigating to a different page via activeHref change.
  useEffect(() => {
    setMenuOpen(false);
  }, [activeHref]);

  const authActions = isAuthenticated ? (
    <AppLink
      href={getDashboardRouteByRole(user?.role)}
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

  const mobileMenu =
    menuOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-x-0 bottom-0 top-[var(--site-chrome-height,118px)] z-[190] 2xl:hidden"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label={t('header.closeMenu')}
              className="absolute inset-0 bg-black/40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="relative max-h-full overflow-y-auto overscroll-contain border-t border-black/5 bg-white px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {navLinks.map(({ labelKey, href, active }) => (
                  <AppLink
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                      active
                        ? 'bg-[#ee1c25]/5 text-[#ee1c25]'
                        : 'text-[#6b7280]'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {t(labelKey)}
                  </AppLink>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-black/5 pt-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <LanguageSwitcher className="w-full [&_button]:w-full [&_button]:justify-between" />
                <div className="flex flex-col gap-2 [&_a]:text-center [&_a]:text-sm">
                  {authActions}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <header className="relative border-b border-black/4 bg-white">
      <div className="mx-auto flex w-full max-w-480 items-center justify-between gap-3 py-2.5 pl-4 pr-3 sm:gap-4 sm:px-6 md:px-10 lg:px-12 2xl:gap-6 2xl:px-16 min-[1920px]:px-48">
        <AppLink
          href={ROUTES.HOME}
          className="relative flex h-13 w-42.5 shrink-0 items-center sm:h-16.75 sm:w-55"
        >
          <Image
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
                active
                  ? 'text-[#ee1c25]'
                  : 'text-[#6b7280] hover:text-[#4049CD] hover:underline'
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

        <Button
          unstyled
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
        </Button>
      </div>

      {mobileMenu}
    </header>
  );
});

SiteHeader.displayName = 'SiteHeader';

export default SiteHeader;
