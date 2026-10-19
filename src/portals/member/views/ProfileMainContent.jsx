import React, { memo, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MemberProfileCoverHeader from '@/components/data-display/MemberProfileCoverHeader/MemberProfileCoverHeader';
import MemberProfileStatsBar from '@/components/data-display/MemberProfileStatsBar/MemberProfileStatsBar';
import {
  MEMBER_ARTWORK,
  MEMBER_FEATURED,
  MEMBER_MESSAGES,
  MEMBER_PREMIUM,
  MEMBER_PROFILE,
} from '@/portals/member/data/memberProfileData';
import useUserProfileMe from '@/portals/member/hooks/useUserProfileMe';
import PhotographerAboutSection from '@/portals/public/photographer/components/PhotographerAboutSection';
import PhotographerArtworkGrid from '@/portals/public/photographer/components/PhotographerArtworkGrid';
import PhotographerCompetitionBanner from '@/portals/public/photographer/components/PhotographerCompetitionBanner';
import PhotographerFeaturedVideo from '@/portals/public/photographer/components/PhotographerFeaturedVideo';
import PhotographerMessagesSection from '@/portals/public/photographer/components/PhotographerMessagesSection';
import PhotographerProfileTabs from '@/portals/public/photographer/components/PhotographerProfileTabs';
import PhotographerShareBanner from '@/portals/public/photographer/components/PhotographerShareBanner';
import PhotographerSlideshowsSection from '@/portals/public/photographer/components/PhotographerSlideshowsSection';
import PhotographerStoreSection from '@/portals/public/photographer/components/PhotographerStoreSection';
import PhotographerTalentAppreciation from '@/portals/public/photographer/components/PhotographerTalentAppreciation';
import {
  PHOTOGRAPHER_FEATURED_VIDEO,
  PHOTOGRAPHER_STORE_PRODUCTS,
  PHOTOGRAPHER_TALENT_APPRECIATION,
} from '@/portals/public/photographer/data/photographerProfileData';
import { SLIDESHOW_SEARCH_PARAM } from '@/shared/data/slideshows';

const ProfileMainContent = memo(() => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() =>
    searchParams.has(SLIDESHOW_SEARCH_PARAM) ? 'artwork' : 'profile',
  );

  const { data: profileData } = useUserProfileMe();

  const profile = useMemo(() => {
    if (!profileData) return MEMBER_PROFILE;

    const handle = profileData.username
      ? `@${profileData.username.replace(/^@/, '')}`
      : MEMBER_PROFILE.handle;
    const location =
      [profileData.city, profileData.country].filter(Boolean).join(', ') ||
      MEMBER_PROFILE.location;

    let socialObj = {};
    if (typeof profileData.socialLinks === 'string') {
      try {
        socialObj = JSON.parse(profileData.socialLinks);
      } catch {
        socialObj = {};
      }
    } else if (
      profileData.socialLinks &&
      typeof profileData.socialLinks === 'object' &&
      !Array.isArray(profileData.socialLinks)
    ) {
      socialObj = profileData.socialLinks;
    } else if (Array.isArray(profileData.socialLinks)) {
      profileData.socialLinks.forEach((url) => {
        if (typeof url === 'string') {
          if (url.includes('instagram.com')) socialObj.instagram = url;
          else if (url.includes('twitter.com') || url.includes('x.com'))
            socialObj.twitter = url;
          else if (url.includes('youtube.com')) socialObj.youtube = url;
          else if (url.includes('tiktok.com')) socialObj.tiktok = url;
          else if (!socialObj.website) socialObj.website = url;
        }
      });
    }

    return {
      ...MEMBER_PROFILE,
      name: profileData.name || MEMBER_PROFILE.name,
      avatar: profileData.avatar || MEMBER_PROFILE.avatar,
      cover: profileData.coverPhoto || MEMBER_PROFILE.cover,
      handle,
      location,
      bio: profileData.bio ?? MEMBER_PROFILE.bio,
      website: socialObj.website ?? MEMBER_PROFILE.website,
      instagram: socialObj.instagram ?? MEMBER_PROFILE.instagram,
      twitter: socialObj.twitter ?? MEMBER_PROFILE.twitter,
      youtube: socialObj.youtube ?? MEMBER_PROFILE.youtube,
      tiktok: socialObj.tiktok ?? MEMBER_PROFILE.tiktok,
      socials:
        Array.isArray(profileData.socialLinks) && profileData.socialLinks.length
          ? profileData.socialLinks.map((url) => ({
              label: url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
              href: url,
            }))
          : MEMBER_PROFILE.socials,
      stats: {
        ...MEMBER_PROFILE.stats,
        ...(profileData.stats || {}),
        profileViews:
          profileData.profileViews ?? MEMBER_PROFILE.stats?.profileViews,
      },
    };
  }, [profileData]);

  const featuredVideo = useMemo(() => {
    if (!profileData?.introVideo) return PHOTOGRAPHER_FEATURED_VIDEO;
    return {
      ...PHOTOGRAPHER_FEATURED_VIDEO,
      url: profileData.introVideo,
    };
  }, [profileData?.introVideo]);

  const appreciation = useMemo(() => {
    if (!profileData?.appreciation) return PHOTOGRAPHER_TALENT_APPRECIATION;
    return profileData.appreciation;
  }, [profileData?.appreciation]);

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col pb-8 sm:pb-10">
      <MemberProfileCoverHeader profile={profile} />
      <PhotographerProfileTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'profile' ? (
        <>
          <MemberProfileStatsBar stats={profile.stats} />
          <PhotographerAboutSection profile={profile} />
          <PhotographerFeaturedVideo video={featuredVideo} />
          <PhotographerTalentAppreciation
            appreciation={appreciation}
            photographerName={profile.name}
            userId={profile.id}
          />
        </>
      ) : null}

      {activeTab === 'artwork' ? (
        <>
          <PhotographerCompetitionBanner featured={MEMBER_FEATURED} />
          <PhotographerSlideshowsSection
            canManage
            ownerName={MEMBER_PROFILE.name}
          />
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
