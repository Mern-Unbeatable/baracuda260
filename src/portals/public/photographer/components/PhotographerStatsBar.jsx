import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const STAT_KEYS = [
  'followers',
  'following',
  'profileVisitors',
  'totalArtwork',
  'competitionEntries',
  'totalHearts',
];

const PhotographerStatsBar = memo(({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 w-full rounded-2xl border border-black/8 bg-[#fafafa] sm:mt-8">
      <div className="grid w-full grid-cols-2 divide-x divide-y divide-black/8 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
        {STAT_KEYS.map((key) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center gap-1 px-2 py-4 text-center sm:px-4 sm:py-5"
          >
            <p className="text-[20px] font-bold leading-none text-[#111827] sm:text-[24px]">
              {Number(stats[key] ?? 0).toLocaleString('en-US')}
            </p>
            <p className="max-w-full text-[10px] font-medium uppercase leading-snug tracking-wide text-[#6b7280] sm:text-[12px]">
              <span className="sm:hidden">{t(`photographerProfile.statsShort.${key}`)}</span>
              <span className="hidden sm:inline">{t(`photographerProfile.stats.${key}`)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

PhotographerStatsBar.displayName = 'PhotographerStatsBar';

export default PhotographerStatsBar;
