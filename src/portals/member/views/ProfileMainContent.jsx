import React, { memo } from 'react';
import PhotographerAboutSection from '@/portals/public/photographer/components/PhotographerAboutSection';
import PhotographerArtworkGrid from '@/portals/public/photographer/components/PhotographerArtworkGrid';
import PhotographerFeaturedCompetition from '@/portals/public/photographer/components/PhotographerFeaturedCompetition';
import PhotographerMessagesSection from '@/portals/public/photographer/components/PhotographerMessagesSection';
import PhotographerShareBanner from '@/portals/public/photographer/components/PhotographerShareBanner';
import MemberProfileCoverHeader from '@/components/data-display/MemberProfileCoverHeader/MemberProfileCoverHeader';
import MemberProfileStatsBar from '@/components/data-display/MemberProfileStatsBar/MemberProfileStatsBar';
import {
  MEMBER_ARTWORK,
  MEMBER_FEATURED,
  MEMBER_MESSAGES,
  MEMBER_PREMIUM,
  MEMBER_PROFILE,
} from '@/portals/member/data/memberProfileData';

const ProfileMainContent = memo(() => (
  <div className="mx-auto flex w-full max-w-[1580px] flex-col pb-8 sm:pb-10">
    <MemberProfileCoverHeader profile={MEMBER_PROFILE} />
    <MemberProfileStatsBar stats={MEMBER_PROFILE.stats} />
    <PhotographerAboutSection profile={MEMBER_PROFILE} />
    <PhotographerFeaturedCompetition featured={MEMBER_FEATURED} />
    <PhotographerArtworkGrid
      titleKey="photographerProfile.artwork.title"
      subtitleKey="photographerProfile.artwork.subtitle"
      photos={MEMBER_ARTWORK}
      showCompetitionTag
    />
    <PhotographerArtworkGrid
      titleKey="photographerProfile.premium.title"
      subtitleKey="photographerProfile.premium.subtitle"
      photos={MEMBER_PREMIUM}
      showPrice
    />
    <PhotographerMessagesSection messages={MEMBER_MESSAGES} />
    <PhotographerShareBanner />
  </div>
));

ProfileMainContent.displayName = 'ProfileMainContent';

export default ProfileMainContent;
