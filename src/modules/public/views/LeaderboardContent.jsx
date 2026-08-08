import React, { memo } from 'react';
import { ROUTES } from '@/shared/config';
import { SitePageLayout } from '@/shared/site-chrome';
import TopPhotographers from '@/modules/public/views/TopPhotographers';

/**
 * Navbar Leaderboard page — same standings UI as Home, with album/month tabs.
 */
const LeaderboardContent = memo(() => (
  <SitePageLayout
    activeHref={ROUTES.LEADERBOARD}
    rootClassName="leaderboard-page-root"
    announcementTone="blue"
    newsletterVariant="page"
  >
    <TopPhotographers variant="page" />
  </SitePageLayout>
));

LeaderboardContent.displayName = 'LeaderboardContent';

export default LeaderboardContent;
