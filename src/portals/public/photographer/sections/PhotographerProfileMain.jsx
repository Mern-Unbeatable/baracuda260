import React, { memo } from 'react';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import PhotographerAboutSection from '@/portals/public/photographer/components/PhotographerAboutSection';
import PhotographerArtworkGrid from '@/portals/public/photographer/components/PhotographerArtworkGrid';
import PhotographerFeaturedCompetition from '@/portals/public/photographer/components/PhotographerFeaturedCompetition';
import PhotographerMessagesSection from '@/portals/public/photographer/components/PhotographerMessagesSection';
import PhotographerProfileHeader from '@/components/data-display/PhotographerProfileHeader/PhotographerProfileHeader';
import PhotographerShareBanner from '@/portals/public/photographer/components/PhotographerShareBanner';
import PhotographerStatsBar from '@/components/data-display/PhotographerStatsBar/PhotographerStatsBar';
import {
  PHOTOGRAPHER_ARTWORK,
  PHOTOGRAPHER_FEATURED,
  PHOTOGRAPHER_MESSAGES,
  PHOTOGRAPHER_PREMIUM,
  PHOTOGRAPHER_PROFILE,
} from '@/portals/public/photographer/data/photographerProfileData';

const PhotographerProfileMain = memo(() => (
  <SitePageLayout
    activeHref=""
    rootClassName="photographer-profile-root"
    announcementTone="blue"
    newsletterVariant="page"
  >
    <section className="bg-white section-py-top pb-8 sm:pb-10">
      <Shell>
        <PhotographerProfileHeader profile={PHOTOGRAPHER_PROFILE} />
        <PhotographerStatsBar stats={PHOTOGRAPHER_PROFILE.stats} />
        <PhotographerAboutSection profile={PHOTOGRAPHER_PROFILE} />
        <PhotographerFeaturedCompetition featured={PHOTOGRAPHER_FEATURED} />
      </Shell>
    </section>

    <section className="bg-white section-py-bottom pt-8 sm:pt-10">
      <Shell>
        <PhotographerArtworkGrid
          titleKey="photographerProfile.artwork.title"
          subtitleKey="photographerProfile.artwork.subtitle"
          photos={PHOTOGRAPHER_ARTWORK}
          showCompetitionTag
        />
        <PhotographerArtworkGrid
          titleKey="photographerProfile.premium.title"
          subtitleKey="photographerProfile.premium.subtitle"
          photos={PHOTOGRAPHER_PREMIUM}
          showPrice
        />
        <PhotographerMessagesSection messages={PHOTOGRAPHER_MESSAGES} />
        <PhotographerShareBanner />
      </Shell>
    </section>
  </SitePageLayout>
));

PhotographerProfileMain.displayName = 'PhotographerProfileMain';

export default PhotographerProfileMain;
