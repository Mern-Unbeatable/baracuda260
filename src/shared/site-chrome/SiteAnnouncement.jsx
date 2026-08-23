import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { SITE_ANNOUNCEMENT_BG } from './siteCopy';

const SiteAnnouncement = memo(({ tone = 'blue' }) => {
  const { t } = useTranslation();
  const bg = SITE_ANNOUNCEMENT_BG[tone] || SITE_ANNOUNCEMENT_BG.blue;
  const announcement = t('announcement');

  return (
    <div className={`flex h-11.5 items-center overflow-hidden ${bg}`}>
      <div className="site-marquee-track flex w-max whitespace-nowrap text-[14px] leading-5.5 text-white">
        <span className="px-4">{announcement}</span>
        <span className="px-4" aria-hidden="true">
          {announcement}
        </span>
      </div>
    </div>
  );
});

SiteAnnouncement.displayName = 'SiteAnnouncement';

export default SiteAnnouncement;
