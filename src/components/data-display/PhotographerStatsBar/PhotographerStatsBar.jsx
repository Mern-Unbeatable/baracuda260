import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';

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
    <div className="mt-7 w-full sm:mt-8">
      <div className="hidden lg:flex lg:items-stretch">
        {STAT_KEYS.map((key, index) => (
          <div
            key={key}
            className={[
              'flex flex-1 flex-col items-center justify-center px-3 py-4 text-center',
              index < STAT_KEYS.length - 1 ? 'border-r border-[#e5e7eb]' : '',
            ].join(' ')}
          >
            <p className="text-[28px] sm:text-[36px] font-semibold leading-none text-[#111827]">
              {stats[key] ?? 0}
            </p>
            <p className="mt-1 text-[12px] font-normal leading-tight text-[#6b7280]">
              {t(`photographerProfile.stats.${key}`)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-[#e5e7eb] lg:hidden">
        {STAT_KEYS.map((key) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center px-2 py-3 text-center sm:px-3"
          >
            <p className="text-[28px] sm:text-[36px] font-semibold leading-none text-[#111827]">
              {stats[key] ?? 0}
            </p>
            <p className="mt-1 text-[12px] font-normal leading-tight text-[#6b7280]">
              {t(`photographerProfile.statsShort.${key}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

PhotographerStatsBar.displayName = 'PhotographerStatsBar';

export default PhotographerStatsBar;
