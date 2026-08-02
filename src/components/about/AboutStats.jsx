import React, { memo } from 'react';
import { Shell } from '../site';
import { ABOUT_STATS } from './aboutData';

const AboutStats = memo(() => (
  <section className="relative z-10 -mt-8 xl:-mt-12">
    <Shell>
      <div className="grid gap-8 rounded-[20px] border border-black/20 bg-white p-8 text-center sm:grid-cols-3 sm:gap-6 sm:p-11">
        {ABOUT_STATS.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-5">
            <p className="text-[36px] font-extrabold leading-none tracking-[-1.2px] text-[#212133] sm:text-[40px] xl:text-[48px] xl:leading-[48px]">
              {value}
            </p>
            <p className="text-[12px] font-semibold uppercase tracking-[1.2px] text-[#6b7280]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </Shell>
  </section>
));

AboutStats.displayName = 'AboutStats';

export default AboutStats;
