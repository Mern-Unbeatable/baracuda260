import { Award, Camera, Sparkles } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Highlighted Info Banner at the top of the User Profile.
 * Informs visitors and members about their weekly Gold, Silver, and Bronze
 * Camera Artwork Appreciation Awards.
 */
const WeeklyAppreciationBanner = memo(({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('appreciationBanner.aria', 'Artwork Appreciation Award notice')}
      className={`relative overflow-hidden rounded-2xl border border-amber-300/80 bg-linear-to-r from-amber-50 via-yellow-50/70 to-orange-50 p-4 sm:p-5 sm:px-6 shadow-xs ${className}`}
    >
      {/* Decorative background glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-amber-200/40 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-10 -bottom-10 size-32 rounded-full bg-yellow-200/40 blur-xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Main Text Content */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-yellow-500 text-white shadow-sm ring-2 ring-amber-200">
            <Camera size={22} strokeWidth={2.2} />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/70 px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase text-amber-900">
                <Sparkles size={11} className="text-amber-700" />
                {t('appreciationBanner.badge', 'Weekly Artwork Appreciation')}
              </span>
              <span className="text-[11px] font-semibold text-amber-800/80">
                {t('appreciationBanner.frequency', '• Resets Every Week')}
              </span>
            </div>

            <h2 className="mt-1 text-[15px] sm:text-[16px] font-bold leading-snug text-amber-950">
              {t(
                'appreciationBanner.headline',
                'Each week you can award your favorite Artist: 1 Gold 1 Silver 1 Bronze Camera Artwork Appreciation Award.',
              )}
            </h2>

            <p className="mt-0.5 text-[13px] text-amber-900/80">
              {t(
                'appreciationBanner.subtext',
                'Support standout creators and help them rise on the weekly leaderboard. Award cameras directly on any artwork.',
              )}
            </p>
          </div>
        </div>

        {/* 3 Award Tiers Visual Chips */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-2.5 pt-1 lg:pt-0">
          {/* Gold Camera */}
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white/90 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-2xs backdrop-blur-xs">
            <span className="flex size-5 items-center justify-center rounded-full bg-linear-to-br from-yellow-300 to-amber-500 text-[11px] text-white shadow-2xs">
              🥇
            </span>
            <span>{t('appreciationBanner.gold', '1 Gold Camera')}</span>
          </div>

          {/* Silver Camera */}
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs backdrop-blur-xs">
            <span className="flex size-5 items-center justify-center rounded-full bg-linear-to-br from-slate-200 to-slate-400 text-[11px] text-white shadow-2xs">
              🥈
            </span>
            <span>{t('appreciationBanner.silver', '1 Silver Camera')}</span>
          </div>

          {/* Bronze Camera */}
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-amber-600/30 bg-white/90 px-3 py-1.5 text-xs font-bold text-amber-950 shadow-2xs backdrop-blur-xs">
            <span className="flex size-5 items-center justify-center rounded-full bg-linear-to-br from-amber-600 to-orange-700 text-[11px] text-white shadow-2xs">
              🥉
            </span>
            <span>{t('appreciationBanner.bronze', '1 Bronze Camera')}</span>
          </div>
        </div>
      </div>
    </section>
  );
});

WeeklyAppreciationBanner.displayName = 'WeeklyAppreciationBanner';

export default WeeklyAppreciationBanner;
