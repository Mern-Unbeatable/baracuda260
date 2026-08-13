import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus } from 'lucide-react';
import { ROUTES } from '@/shared/config';

const UPLOAD_OPTIONS = [
  {
    id: 'single',
    href: ROUTES.ADMIN_SELL_PHOTOS_UPLOAD_SINGLE,
    titleKey: 'sellPhotos.uploadMenu.single.title',
    descriptionKey: 'sellPhotos.uploadMenu.single.description',
  },
  {
    id: 'six',
    href: ROUTES.ADMIN_SELL_PHOTOS_UPLOAD_SIX,
    titleKey: 'sellPhotos.uploadMenu.six.title',
    descriptionKey: 'sellPhotos.uploadMenu.six.description',
  },
  {
    id: 'zodiac',
    href: ROUTES.ADMIN_SELL_PHOTOS_UPLOAD_ZODIAC12,
    titleKey: 'sellPhotos.uploadMenu.zodiac.title',
    descriptionKey: 'sellPhotos.uploadMenu.zodiac.description',
  },
];

const MemberUploadFormatMenu = memo(() => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#ee1c25] px-5 py-2.5 text-[16px] leading-6 text-white shadow-sm transition hover:bg-[#d41921]"
      >
        <Plus size={16} strokeWidth={2} aria-hidden="true" />
        {t('sellPhotos.uploadCta')}
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={`transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t('sellPhotos.uploadMenu.aria')}
          className="absolute right-0 top-full z-30 mt-2 w-[min(100vw-2rem,320px)] overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-xl"
        >
          <p className="border-b border-[rgba(0,0,0,0.06)] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-[#6b7280]">
            {t('sellPhotos.uploadMenu.heading')}
          </p>
          <ul className="py-1">
            {UPLOAD_OPTIONS.map((option) => (
              <li key={option.id}>
                <Link
                  to={option.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block cursor-pointer px-4 py-3 transition hover:bg-[#ecedfa]"
                >
                  <span className="block text-[15px] font-semibold text-[#161c27]">
                    {t(option.titleKey)}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-[#6b7280]">
                    {t(option.descriptionKey)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
});

MemberUploadFormatMenu.displayName = 'MemberUploadFormatMenu';

export default MemberUploadFormatMenu;
