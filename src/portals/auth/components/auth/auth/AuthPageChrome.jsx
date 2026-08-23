import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { LanguageSwitcher } from '@/shared/site-chrome';

/**
 * Shared auth chrome: back-home + language switcher (login / signup).
 */
const AuthPageChrome = memo(({ backLabelKey }) => {
  const { t } = useTranslation();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 sm:p-5 md:p-6">
      <Link
        to={ROUTES.HOME}
        aria-label={t(backLabelKey)}
        className="pointer-events-auto inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/95 text-[#0c0c0c] shadow-[0_2px_10px_rgba(0,0,0,0.18)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ee1c25]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <div className="pointer-events-auto shrink-0">
        <LanguageSwitcher />
      </div>
    </div>
  );
});

AuthPageChrome.displayName = 'AuthPageChrome';

export default AuthPageChrome;
