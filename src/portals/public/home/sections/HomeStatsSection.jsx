import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shell } from '@/shared/site-chrome';

const STATS = [
  { value: '14,820+', labelKey: 'home.stats.photographers' },
  { value: '89,450+', labelKey: 'home.stats.photos' },
  { value: '342,100+', labelKey: 'home.stats.votes' },
  { value: '120×', labelKey: 'home.stats.prizes' },
];

const HomeStatsSection = memo(() => {
  const { t } = useTranslation();
  return (
    <section className="bg-white section-py border-y border-slate-100">
      <Shell>
        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4 lg:gap-6">
          {STATS.map(({ value, labelKey }) => (
            <div key={labelKey} className="text-center">
              <p className="text-[22px] font-bold leading-none text-(--primary-text-heading-color) sm:text-[32px] lg:text-[40px]">
                {value}
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-(--primary-text-color) sm:mt-3 sm:text-[11px] lg:text-[12px]">
                {t(labelKey)}
              </p>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
});

HomeStatsSection.displayName = 'HomeStatsSection';

export default HomeStatsSection;
