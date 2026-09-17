import React, { memo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import PhotographerAboutSection from '@/portals/public/photographer/components/PhotographerAboutSection';
import PhotographerArtworkGrid from '@/portals/public/photographer/components/PhotographerArtworkGrid';
import PhotographerCompetitionBanner from '@/portals/public/photographer/components/PhotographerCompetitionBanner';
import PhotographerFeaturedVideo from '@/portals/public/photographer/components/PhotographerFeaturedVideo';
import PhotographerMessagesSection from '@/portals/public/photographer/components/PhotographerMessagesSection';
import PhotographerProfileTabs from '@/portals/public/photographer/components/PhotographerProfileTabs';
import PhotographerShareBanner from '@/portals/public/photographer/components/PhotographerShareBanner';
import PhotographerStoreSection from '@/portals/public/photographer/components/PhotographerStoreSection';
import PhotographerTalentAppreciation from '@/portals/public/photographer/components/PhotographerTalentAppreciation';
import PhotographerProfileHeader from '@/components/data-display/PhotographerProfileHeader/PhotographerProfileHeader';
import PhotographerStatsBar from '@/components/data-display/PhotographerStatsBar/PhotographerStatsBar';
import {
  PHOTOGRAPHER_ARTWORK,
  PHOTOGRAPHER_FEATURED,
  PHOTOGRAPHER_FEATURED_VIDEO,
  PHOTOGRAPHER_MESSAGES,
  PHOTOGRAPHER_PREMIUM,
  PHOTOGRAPHER_PROFILE,
  PHOTOGRAPHER_STORE_PRODUCTS,
  PHOTOGRAPHER_TALENT_APPRECIATION,
} from '@/portals/public/photographer/data/photographerProfileData';

const PhotographerProfileMain = memo(() => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');

  return (
    <SitePageLayout
      activeHref=""
      rootClassName="photographer-profile-root"
      announcementTone="blue"
      newsletterVariant="page"
    >
      <section className="bg-white section-py-top pb-10 sm:pb-12">
        <Shell>
          <PhotographerProfileHeader profile={PHOTOGRAPHER_PROFILE} />
          <PhotographerProfileTabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'profile' ? (
            <>
              <PhotographerStatsBar stats={PHOTOGRAPHER_PROFILE.stats} />
              <PhotographerAboutSection profile={PHOTOGRAPHER_PROFILE} />
              <PhotographerFeaturedVideo video={PHOTOGRAPHER_FEATURED_VIDEO} />
              <PhotographerTalentAppreciation appreciation={PHOTOGRAPHER_TALENT_APPRECIATION} />
            </>
          ) : null}

          {activeTab === 'artwork' ? (
            <>
              <PhotographerCompetitionBanner featured={PHOTOGRAPHER_FEATURED} />
              <PhotographerArtworkGrid
                titleKey="photographerProfile.artwork.title"
                subtitleKey="photographerProfile.artwork.subtitle"
                photos={PHOTOGRAPHER_ARTWORK}
                showCompetitionTag
              />
            </>
          ) : null}

          {activeTab === 'store' ? (
            <PhotographerStoreSection products={PHOTOGRAPHER_STORE_PRODUCTS} />
          ) : null}

          {activeTab === 'premium' ? (
            <PhotographerArtworkGrid
              titleKey="photographerProfile.premium.title"
              subtitleKey="photographerProfile.premium.subtitle"
              photos={PHOTOGRAPHER_PREMIUM}
              showPrice
            />
          ) : null}

          {activeTab === 'posts' ? (
            <PhotographerMessagesSection messages={PHOTOGRAPHER_MESSAGES} />
          ) : null}

          <PhotographerShareBanner />
        </Shell>
      </section>
    </SitePageLayout>
  );
});

PhotographerProfileMain.displayName = 'PhotographerProfileMain';

export default PhotographerProfileMain;
