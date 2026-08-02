import React, { memo } from 'react';
import useSitePageStyles from './useSitePageStyles';
import SiteAnnouncement from './SiteAnnouncement';
import SiteHeader from './SiteHeader';
import SiteNewsletter from './SiteNewsletter';
import SiteFooter from './SiteFooter';

/**
 * Shared chrome for Figma marketing pages: styles, announcement, header,
 * page body, newsletter, footer.
 */
const SitePageLayout = memo(
  ({
    activeHref,
    rootClassName = '',
    announcementTone = 'blue',
    newsletterVariant = 'page',
    children,
  }) => {
    useSitePageStyles();

    return (
      <div className={`site-page-root ${rootClassName} w-full overflow-x-hidden bg-white`.trim()}>
        <SiteAnnouncement tone={announcementTone} />
        <SiteHeader activeHref={activeHref} />
        {children}
        <SiteNewsletter variant={newsletterVariant} />
        <SiteFooter />
      </div>
    );
  },
);

SitePageLayout.displayName = 'SitePageLayout';

export default SitePageLayout;
