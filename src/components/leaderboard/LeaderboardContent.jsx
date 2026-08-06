import React, { memo } from 'react';
import { ROUTES } from '../../config';
import { SitePageLayout } from '../site';
import TopPhotographers from './TopPhotographers';

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
