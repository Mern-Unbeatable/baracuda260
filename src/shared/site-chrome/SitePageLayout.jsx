import React, { memo, useLayoutEffect, useRef, useState } from 'react';
import useSitePageStyles from './useSitePageStyles';
import SiteAnnouncement from './SiteAnnouncement';
import SiteHeader from './SiteHeader';
import StayUpdated from './StayUpdated';
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
    const chromeRef = useRef(null);
    const [chromeHeight, setChromeHeight] = useState(118);

    useLayoutEffect(() => {
      const node = chromeRef.current;
      if (!node) return undefined;

      const updateHeight = () => {
        setChromeHeight(node.getBoundingClientRect().height);
      };

      updateHeight();
      const observer = new ResizeObserver(updateHeight);
      observer.observe(node);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        className={`site-page-root ${rootClassName} w-full overflow-x-clip bg-white`.trim()}
        style={{ '--site-chrome-height': `${chromeHeight}px` }}
      >
        <div ref={chromeRef} className="fixed inset-x-0 top-0 z-[100]">
          <SiteAnnouncement tone={announcementTone} />
          <SiteHeader activeHref={activeHref} />
        </div>
        <div style={{ height: chromeHeight }} aria-hidden="true" />
        {children}
        <StayUpdated variant={newsletterVariant} />
        <SiteFooter />
      </div>
    );
  },
);

SitePageLayout.displayName = 'SitePageLayout';

export default SitePageLayout;
