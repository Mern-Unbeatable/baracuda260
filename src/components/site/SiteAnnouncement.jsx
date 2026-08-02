import React, { memo } from 'react';
import { SITE_ANNOUNCEMENT, SITE_ANNOUNCEMENT_BG } from './siteCopy';

const SiteAnnouncement = memo(({ tone = 'blue' }) => {
  const bg = SITE_ANNOUNCEMENT_BG[tone] || SITE_ANNOUNCEMENT_BG.blue;

  return (
    <div className={`flex h-[46px] items-center overflow-hidden ${bg}`}>
      <div className="site-marquee-track flex w-max whitespace-nowrap text-[14px] leading-[22px] text-white">
        <span className="px-4">{SITE_ANNOUNCEMENT}</span>
        <span className="px-4" aria-hidden="true">
          {SITE_ANNOUNCEMENT}
        </span>
      </div>
    </div>
  );
});

SiteAnnouncement.displayName = 'SiteAnnouncement';

export default SiteAnnouncement;
