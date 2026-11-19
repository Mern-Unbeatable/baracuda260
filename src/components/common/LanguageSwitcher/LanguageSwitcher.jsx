import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';
import { changeLanguage, SUPPORTED_LOCALES } from '@/shared/i18n';
import ImgIcon from '@/shared/site-chrome/ImgIcon';
import { SITE_ASSETS } from '@/shared/site-chrome/siteAssets';

const LanguageSwitcher = memo(
  ({
    className = '',
    variant = 'default', // 'default' | 'sidebar' | 'compact'
    direction = 'down', // 'down' | 'up'
  }) => {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const currentLng = i18n.resolvedLanguage || i18n.language;
    const active =
      SUPPORTED_LOCALES.find((locale) => locale.code === currentLng) ||
      SUPPORTED_LOCALES[0];

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

    if (variant === 'compact') {
      return (
        <div className={`relative ${className}`} ref={rootRef}>
          <Button
            unstyled
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            title={`${t('header.language')}: ${t(active.labelKey)}`}
            aria-label={`${t('header.language')}: ${t(active.labelKey)}`}
            onClick={() => setOpen((value) => !value)}
            className={`flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 ${
              open
                ? 'bg-[#fde8e9] text-[#ee1c25]'
                : 'text-gray-400 hover:bg-[#fde8e9]/60 hover:text-gray-900'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Globe size={20} aria-hidden="true" />
              <span className="absolute -bottom-1.5 -right-2 rounded bg-gray-100 px-1 py-0.2 text-[8px] font-bold uppercase leading-none text-gray-600 shadow-xs">
                {active.code}
              </span>
            </div>
          </Button>

          {open && (
            <ul
              role="listbox"
              aria-label={t('header.language')}
              className="absolute bottom-0 left-full z-50 ml-2 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-xl"
            >
              {SUPPORTED_LOCALES.map((locale) => {
                const selected = locale.code === currentLng;
                return (
                  <li key={locale.code} role="option" aria-selected={selected}>
                    <Button
                      unstyled
                      type="button"
                      className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                        selected
                          ? 'bg-[#fde8e9] font-semibold text-[#ee1c25]'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => {
                        void changeLanguage(locale.code);
                        setOpen(false);
                      }}
                    >
                      <span>{t(locale.labelKey)}</span>
                      {selected && (
                        <Check size={16} className="text-[#ee1c25]" aria-hidden="true" />
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      );
    }

    if (variant === 'sidebar') {
      const menuPositionClass =
        direction === 'up'
          ? 'bottom-full mb-1.5 left-0 right-0'
          : 'top-full mt-1.5 left-0 right-0';

      return (
        <div className={`relative ${className}`} ref={rootRef}>
          <Button
            unstyled
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={t('header.language')}
            title={t('header.language')}
            onClick={() => setOpen((value) => !value)}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200/90 bg-[#f9fafb] px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Globe size={18} className="shrink-0 text-gray-500" aria-hidden="true" />
              <span className="truncate">{t(active.labelKey)}</span>
            </div>
            <ChevronDown
              size={16}
              className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </Button>

          {open && (
            <ul
              role="listbox"
              aria-label={t('header.language')}
              className={`absolute z-50 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg ${menuPositionClass}`}
            >
              {SUPPORTED_LOCALES.map((locale) => {
                const selected = locale.code === currentLng;
                return (
                  <li key={locale.code} role="option" aria-selected={selected}>
                    <Button
                      unstyled
                      type="button"
                      className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                        selected
                          ? 'bg-[#fde8e9] font-semibold text-[#ee1c25]'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => {
                        void changeLanguage(locale.code);
                        setOpen(false);
                      }}
                    >
                      <span>{t(locale.labelKey)}</span>
                      {selected && (
                        <Check size={16} className="text-[#ee1c25]" aria-hidden="true" />
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      );
    }

    const defaultMenuPositionClass =
      direction === 'up' ? 'bottom-full mb-2 right-0' : 'right-0 mt-2';

    return (
      <div className={`relative ${className}`} ref={rootRef}>
        <Button
          unstyled
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={t('header.language')}
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2.5 rounded bg-[#f0f0f0] px-3 py-1.5 text-[16px] font-medium text-[#222]"
        >
          {t(active.labelKey)}
          <span
            className={`inline-flex transition ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <ImgIcon src={SITE_ASSETS.chevron} size={24} />
          </span>
        </Button>

        {open && (
          <ul
            role="listbox"
            aria-label={t('header.language')}
            className={`absolute z-50 min-w-full overflow-hidden rounded-lg border border-black/10 bg-white py-1 shadow-[0_12px_30px_rgba(13,13,20,0.12)] ${defaultMenuPositionClass}`}
          >
            {SUPPORTED_LOCALES.map((locale) => {
              const selected = locale.code === currentLng;
              return (
                <li key={locale.code} role="option" aria-selected={selected}>
                  <Button
                    unstyled
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
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher;
