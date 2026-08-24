import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES, changeLanguage } from '@/shared/i18n';
import { SITE_ASSETS } from '@/shared/site-chrome/siteAssets';
import ImgIcon from '@/shared/site-chrome/ImgIcon';

const LanguageSwitcher = memo(({ className = '' }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const currentLng = i18n.resolvedLanguage || i18n.language;
  const active =
    SUPPORTED_LOCALES.find((locale) => locale.code === currentLng) || SUPPORTED_LOCALES[0];

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('header.language')}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2.5 rounded bg-[#f0f0f0] px-3 py-2 text-[16px] font-medium text-[#222]"
      >
        {t(active.labelKey)}
        <span className={`inline-flex transition ${open ? 'rotate-180' : ''}`} aria-hidden="true">
          <ImgIcon src={SITE_ASSETS.chevron} size={24} />
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('header.language')}
          className="absolute right-0 z-50 mt-2 min-w-full overflow-hidden rounded-lg border border-black/10 bg-white py-1 shadow-[0_12px_30px_rgba(13,13,20,0.12)]"
        >
          {SUPPORTED_LOCALES.map((locale) => {
            const selected = locale.code === currentLng;
            return (
              <li key={locale.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex w-full px-3 py-2.5 text-left text-[14px] font-medium transition ${
                    selected
                      ? 'bg-[#4048cd]/10 text-[#4048cd]'
                      : 'text-[#222] hover:bg-[#f7f8fa]'
                  }`}
                  onClick={() => {
                    void changeLanguage(locale.code);
                    setOpen(false);
                  }}
                >
                  {t(locale.labelKey)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher;
