import { Award, Camera } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Clean Info Banner on top of the User Profile.
 * Informs visitors about the weekly 1 Gold, 1 Silver, 1 Bronze Camera Artwork Appreciation Awards
 * with the authentic colored camera badges used across the site.
 */
const WeeklyAppreciationBanner = memo(({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-label={t('appreciationBanner.aria', 'Artwork Appreciation Award notice')}
      className={`flex items-start gap-3 rounded-xl border border-amber-200/70 bg-[#fffdf8] px-4 py-3 sm:px-5 sm:py-3.5 shadow-2xs ${className}`}
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-100/80 text-amber-700 mt-0.5">
        <Award size={16} strokeWidth={2.2} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
            {t('appreciationBanner.badge', 'Weekly Artwork Appreciation')}
          </span>
          <span className="text-[11px] text-[#9ca3af]">
            {t('appreciationBanner.frequency', '• Resets Every Week')}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[14px] sm:text-[15px] font-medium text-[#1f2937]">
          <span>
            {t(
              'appreciationBanner.prefix',
              'Each week you can award your favorite Artist:',
            )}
          </span>

          {/* 1 Gold Camera */}
          <span className="inline-flex items-center gap-1 rounded-md border border-[#eab308] bg-linear-to-r from-[#fef08a] via-[#fde047] to-[#facc15] px-2 py-0.5 text-xs font-bold text-[#713f12] shadow-2xs">
            <Camera size={12} strokeWidth={2.4} className="text-[#854d0e]" />
            1 Gold
          </span>

          {/* 1 Silver Camera */}
          <span className="inline-flex items-center gap-1 rounded-md border border-[#cbd5e1] bg-[#f1f5f9] px-2 py-0.5 text-xs font-bold text-[#475569] shadow-2xs">
            <Camera size={12} strokeWidth={2.4} className="text-[#64748b]" />
            1 Silver
          </span>

          {/* 1 Bronze Camera */}
          <span className="inline-flex items-center gap-1 rounded-md border border-[#fed7aa] bg-[#fff7ed] px-2 py-0.5 text-xs font-bold text-[#9a3412] shadow-2xs">
            <Camera size={12} strokeWidth={2.4} className="text-[#b45309]" />
            1 Bronze
          </span>

          <span>
            {t(
              'appreciationBanner.suffix',
              'Camera Artwork Appreciation Award.',
            )}
          </span>
        </div>
      </div>
    </div>
  );
});

WeeklyAppreciationBanner.displayName = 'WeeklyAppreciationBanner';

export default WeeklyAppreciationBanner;
