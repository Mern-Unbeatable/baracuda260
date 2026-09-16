import React, { memo, useState } from 'react';
import PhotographerAboutSection from '@/portals/public/photographer/components/PhotographerAboutSection';
import PhotographerArtworkGrid from '@/portals/public/photographer/components/PhotographerArtworkGrid';
import PhotographerCompetitionBanner from '@/portals/public/photographer/components/PhotographerCompetitionBanner';
import PhotographerFeaturedVideo from '@/portals/public/photographer/components/PhotographerFeaturedVideo';
import PhotographerMessagesSection from '@/portals/public/photographer/components/PhotographerMessagesSection';
import PhotographerProfileTabs from '@/portals/public/photographer/components/PhotographerProfileTabs';
import PhotographerShareBanner from '@/portals/public/photographer/components/PhotographerShareBanner';
import PhotographerStoreSection from '@/portals/public/photographer/components/PhotographerStoreSection';
import PhotographerTalentAppreciation from '@/portals/public/photographer/components/PhotographerTalentAppreciation';
import MemberProfileCoverHeader from '@/components/data-display/MemberProfileCoverHeader/MemberProfileCoverHeader';
import MemberProfileStatsBar from '@/components/data-display/MemberProfileStatsBar/MemberProfileStatsBar';
import {
  MEMBER_ARTWORK,
  MEMBER_FEATURED,
  MEMBER_MESSAGES,
  MEMBER_PREMIUM,
  MEMBER_PROFILE,
} from '@/portals/member/data/memberProfileData';
import {
  PHOTOGRAPHER_FEATURED_VIDEO,
  PHOTOGRAPHER_STORE_PRODUCTS,
  PHOTOGRAPHER_TALENT_APPRECIATION,
} from '@/portals/public/photographer/data/photographerProfileData';

const ProfileMainContent = memo(() => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col pb-8 sm:pb-10">
      <MemberProfileCoverHeader profile={MEMBER_PROFILE} />
      <PhotographerProfileTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'profile' ? (
        <>
          <MemberProfileStatsBar stats={MEMBER_PROFILE.stats} />
          <PhotographerAboutSection profile={MEMBER_PROFILE} />
          <PhotographerFeaturedVideo video={PHOTOGRAPHER_FEATURED_VIDEO} />
          <PhotographerTalentAppreciation appreciation={PHOTOGRAPHER_TALENT_APPRECIATION} />
        </>
      ) : null}

      {activeTab === 'artwork' ? (
        <>
          <PhotographerCompetitionBanner featured={MEMBER_FEATURED} />
          <PhotographerArtworkGrid
            titleKey="photographerProfile.artwork.title"
            subtitleKey="photographerProfile.artwork.subtitle"
            photos={MEMBER_ARTWORK}
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
          photos={MEMBER_PREMIUM}
          showPrice
        />
      ) : null}

      {activeTab === 'posts' ? (
        <PhotographerMessagesSection messages={MEMBER_MESSAGES} />
      ) : null}

      <PhotographerShareBanner />
    </div>
  );
});

ProfileMainContent.displayName = 'ProfileMainContent';

export default ProfileMainContent;
