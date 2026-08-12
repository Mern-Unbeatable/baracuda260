import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Heart } from 'lucide-react';

const SHARE_ACTIONS = [
  { id: 'whatsapp', labelKey: 'whatsapp', className: 'bg-[#25D366] text-white' },
  { id: 'facebook', labelKey: 'facebook', className: 'bg-[#1877F2] text-white' },
  { id: 'x', labelKey: 'x', className: 'bg-[#0f172a] text-white' },
];

const PhotographerShareBanner = memo(({ profileName }) => {
  const { t } = useTranslation();

  const copyProfileLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard unavailable — no-op.
    }
  }, []);

  return (
    <section className="mt-10 sm:mt-12">
      <div className="rounded-2xl bg-[radial-gradient(circle_at_top_left,#4048cd,#1e293b)] px-5 py-8 sm:px-8 sm:py-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white">
          <Heart size={14} className="fill-white text-white" aria-hidden="true" />
          {t('photographerProfile.shareBanner.badge')}
        </span>
        <h2 className="mt-4 max-w-2xl text-[22px] font-bold leading-snug text-white sm:text-[26px]">
          {t('photographerProfile.shareBanner.title', { name: profileName })}
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-white/80 sm:text-[16px]">
          {t('photographerProfile.shareBanner.subtitle')}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {SHARE_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className={`inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-2 text-[14px] font-semibold ${action.className}`}
            >
              {t(`photographerProfile.shareBanner.${action.labelKey}`)}
            </button>
          ))}
          <button
            type="button"
            onClick={copyProfileLink}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-[#111827]"
          >
            <Copy size={16} aria-hidden="true" />
            {t('photographerProfile.shareBanner.copyLink')}
          </button>
        </div>
      </div>
    </section>
  );
});

PhotographerShareBanner.displayName = 'PhotographerShareBanner';

export default PhotographerShareBanner;
