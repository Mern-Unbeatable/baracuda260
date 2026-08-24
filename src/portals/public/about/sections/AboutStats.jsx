import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Shell } from '@/shared/site-chrome';
import { ABOUT_STATS } from '@/portals/public/about/data/aboutData';

const AboutStats = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 -mt-8 xl:-mt-12">
      <Shell>
        <div className="grid gap-8 rounded-[20px] border border-black/20 bg-white p-8 text-center sm:grid-cols-3 sm:gap-6 sm:p-11">
          {ABOUT_STATS.map(({ value, labelKey }) => (
            <div key={labelKey} className="text-center">
              <p className="text-[32px] font-bold leading-none text-(--primary-text-heading-color) sm:text-[40px]">
                {value}
              </p>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-(--primary-text-color) sm:text-[12px]">
                {t(labelKey)}
              </p>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
});

AboutStats.displayName = 'AboutStats';

export default AboutStats;
