import { RefreshCw } from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import MemberProfileCoverHeader from '@/components/data-display/MemberProfileCoverHeader/MemberProfileCoverHeader';
import MemberProfileStatsBar from '@/components/data-display/MemberProfileStatsBar/MemberProfileStatsBar';
import { DASHBOARD_ASSETS } from '@/portals/member/data/dashboardAssets';
import {
  MEMBER_ARTWORK,
  MEMBER_FEATURED,
  MEMBER_MESSAGES,
  MEMBER_PREMIUM,
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
  PHOTOGRAPHER_STORE_PRODUCTS,
} from '@/portals/public/photographer/data/photographerProfileData';
import { SLIDESHOW_SEARCH_PARAM } from '@/shared/data/slideshows';
import { resolveMediaUrl } from '@/shared/utils/media';

const ProfileMainContent = memo(() => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() =>
    searchParams.has(SLIDESHOW_SEARCH_PARAM) ? 'artwork' : 'profile',
  );

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserProfileMe();

  const profile = useMemo(() => {
    if (!profileData) return null;

    const handle = profileData.username
      ? `@${profileData.username.replace(/^@/, '')}`
      : '';
    const location = [profileData.city, profileData.country]
      .filter(Boolean)
      .join(', ');

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
      id: profileData.id,
      username: profileData.username || '',
      name: profileData.name || profileData.username || '',
      avatar: resolveMediaUrl(profileData.avatar) || DASHBOARD_ASSETS.avatar,
      cover: resolveMediaUrl(profileData.coverPhoto) || '',
      handle,
      tagline: profileData.tagline || '',
      location,
      bio: profileData.bio || '',
      website: socialObj.website || '',
      instagram: socialObj.instagram || '',
      twitter: socialObj.twitter || '',
      youtube: socialObj.youtube || '',
      tiktok: socialObj.tiktok || '',
      socials:
        Array.isArray(profileData.socialLinks) && profileData.socialLinks.length
          ? profileData.socialLinks.map((url) => ({
              label: url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
              href: url,
            }))
          : [],
      stats: {
        followers: Number(profileData.stats?.followers ?? 0),
        following: Number(profileData.stats?.following ?? 0),
        profileVisitors: Number(
          profileData.profileViews ?? profileData.stats?.profileVisitors ?? 0,
        ),
        totalArtwork: Number(profileData.stats?.totalArtwork ?? 0),
        competitionEntries: Number(profileData.stats?.competitionEntries ?? 0),
        totalHearts: Number(profileData.stats?.totalHearts ?? 0),
        premiumPhotos: Number(
          profileData.stats?.premiumPhotos ?? profileData.stats?.totalVideos ?? 0,
        ),
      },
    };
  }, [profileData]);

  const featuredVideo = useMemo(() => {
    if (!profileData?.introVideo) return null;
    return {
      image: resolveMediaUrl(
        profileData.introVideoThumbnail || profileData.coverPhoto,
      ),
      url: resolveMediaUrl(profileData.introVideo),
      title: profileData.name || '',
    };
  }, [
    profileData?.introVideo,
    profileData?.introVideoThumbnail,
    profileData?.coverPhoto,
    profileData?.name,
  ]);

  const appreciation = useMemo(() => {
    return profileData?.appreciation || null;
  }, [profileData?.appreciation]);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-395 flex-col items-center justify-center gap-3 py-16">
        <RefreshCw size={28} className="animate-spin text-[#4048cd]" />
        <p className="text-[14px] text-[#6b7280]">
          {t('common.loading', 'Loading profile...')}
        </p>
      </div>
    );
  }

  if (isError && !profileData) {
    return (
      <div className="mx-auto flex min-h-[300px] w-full max-w-395 flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="text-[16px] font-semibold text-[#111827]">
          {error?.message || t('common.error', 'Failed to load profile.')}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center justify-center rounded-lg bg-[#4048cd] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#343bb0]"
        >
          {t('common.retry', 'Retry')}
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col pb-8 sm:pb-10">
      <MemberProfileCoverHeader profile={profile} />
      <PhotographerProfileTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'profile' ? (
        <>
          <MemberProfileStatsBar stats={profile.stats} />
          <PhotographerAboutSection profile={profile} />
          {featuredVideo?.image ? (
            <PhotographerFeaturedVideo video={featuredVideo} />
          ) : null}
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
            ownerName={profile.name}
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

      <PhotographerShareBanner photographerName={profile.name} />
    </div>
  );
});

ProfileMainContent.displayName = 'ProfileMainContent';

export default ProfileMainContent;
