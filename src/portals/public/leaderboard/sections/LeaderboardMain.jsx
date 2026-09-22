import React, { memo } from 'react';
import TopPhotographers from '@/components/marketing/TopPhotographers/TopPhotographers';
import { ROUTES } from '@/shared/config';
import { SitePageLayout } from '@/shared/site-chrome';

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
