import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ABOUT_STATS } from '@/portals/public/about/data/aboutData';

const AboutStats = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="relative z-10 w-full">
      {/* -translate-y-1/2 centers the card on the hero/white seam */}
      <div className="mx-auto flex w-full max-w-480 -translate-y-1/2 justify-center px-4 sm:px-6 md:px-10 xl:px-48">
        <div className="grid w-full max-w-4xl gap-8 rounded-[20px] border border-black/8 bg-white px-6 py-8 text-center shadow-[0_18px_50px_rgba(27,30,86,0.12)] sm:grid-cols-3 sm:gap-6 sm:px-10 sm:py-11">
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
      </div>
    </section>
  );
});

AboutStats.displayName = 'AboutStats';

export default AboutStats;
