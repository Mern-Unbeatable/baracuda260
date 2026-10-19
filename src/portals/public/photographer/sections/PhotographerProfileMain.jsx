import { useQuery } from '@tanstack/react-query';
import React, { memo, useMemo, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import PhotographerProfileHeader from '@/components/data-display/PhotographerProfileHeader/PhotographerProfileHeader';
import PhotographerStatsBar from '@/components/data-display/PhotographerStatsBar/PhotographerStatsBar';
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
  PHOTOGRAPHER_ARTWORK,
  PHOTOGRAPHER_FEATURED,
  PHOTOGRAPHER_FEATURED_VIDEO,
  PHOTOGRAPHER_MESSAGES,
  PHOTOGRAPHER_PREMIUM,
  PHOTOGRAPHER_PROFILE,
  PHOTOGRAPHER_STORE_PRODUCTS,
  PHOTOGRAPHER_TALENT_APPRECIATION,
} from '@/portals/public/photographer/data/photographerProfileData';
import {
  getUserProfileByUsernameApi,
  USER_PROFILE_USERNAME_QUERY_KEY,
} from '@/shared/api/userProfile.api';
import { SLIDESHOW_SEARCH_PARAM } from '@/shared/data/slideshows';
import { Shell, SitePageLayout } from '@/shared/site-chrome';

const PhotographerProfileMain = memo(() => {
  const location = useLocation();
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    () =>
      location.state?.tab ||
      (searchParams.has(SLIDESHOW_SEARCH_PARAM) ? 'artwork' : 'profile'),
  );

  const { data: profileResponse } = useQuery({
    queryKey: USER_PROFILE_USERNAME_QUERY_KEY(username),
    queryFn: () => getUserProfileByUsernameApi(username),
    enabled: Boolean(username),
    staleTime: 60 * 1000,
  });

  const profile = useMemo(() => {
    const raw = profileResponse?.data;
    if (!raw) return PHOTOGRAPHER_PROFILE;

    const handle = raw.username
      ? `@${raw.username.replace(/^@/, '')}`
      : PHOTOGRAPHER_PROFILE.handle;
    const location =
      [raw.city, raw.country].filter(Boolean).join(', ') ||
      PHOTOGRAPHER_PROFILE.location;

    let socialObj = {};
    if (typeof raw.socialLinks === 'string') {
      try {
        socialObj = JSON.parse(raw.socialLinks);
      } catch {
        socialObj = {};
      }
    } else if (
      raw.socialLinks &&
      typeof raw.socialLinks === 'object' &&
      !Array.isArray(raw.socialLinks)
    ) {
      socialObj = raw.socialLinks;
    } else if (Array.isArray(raw.socialLinks)) {
      raw.socialLinks.forEach((url) => {
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
      ...PHOTOGRAPHER_PROFILE,
      id: raw.id,
      username: raw.username,
      name: raw.name || PHOTOGRAPHER_PROFILE.name,
      avatar: raw.avatar || PHOTOGRAPHER_PROFILE.avatar,
      coverImage: raw.coverPhoto || PHOTOGRAPHER_PROFILE.coverImage,
      handle,
      location,
      bio: raw.bio ?? PHOTOGRAPHER_PROFILE.bio,
      isFollowing: raw.isFollowing ?? false,
      website: socialObj.website ?? PHOTOGRAPHER_PROFILE.website,
      instagram: socialObj.instagram ?? PHOTOGRAPHER_PROFILE.instagram,
      twitter: socialObj.twitter ?? PHOTOGRAPHER_PROFILE.twitter,
      youtube: socialObj.youtube ?? PHOTOGRAPHER_PROFILE.youtube,
      tiktok: socialObj.tiktok ?? PHOTOGRAPHER_PROFILE.tiktok,
      stats: {
        ...PHOTOGRAPHER_PROFILE.stats,
        ...(raw.stats || {}),
        profileVisitors:
          raw.profileViews ??
          raw.stats?.profileVisitors ??
          PHOTOGRAPHER_PROFILE.stats.profileVisitors,
      },
      appreciation: raw.appreciation || PHOTOGRAPHER_TALENT_APPRECIATION,
    };
  }, [profileResponse]);

  const featuredVideo = useMemo(() => {
    if (profileResponse?.data?.introVideo) {
      return {
        ...PHOTOGRAPHER_FEATURED_VIDEO,
        url: profileResponse.data.introVideo,
      };
    }
    return PHOTOGRAPHER_FEATURED_VIDEO;
  }, [profileResponse?.data?.introVideo]);

  return (
    <SitePageLayout
      activeHref=""
      rootClassName="photographer-profile-root"
      announcementTone="blue"
      newsletterVariant="page"
    >
      <section className="bg-white section-py-top pb-10 sm:pb-12">
        <Shell>
          <PhotographerProfileHeader profile={profile} />
          <PhotographerProfileTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'profile' ? (
            <>
              <PhotographerStatsBar stats={profile.stats} />
              <PhotographerAboutSection profile={profile} />
              <PhotographerFeaturedVideo video={featuredVideo} />
              <PhotographerTalentAppreciation
                appreciation={profile.appreciation}
                photographerName={profile.name}
                userId={profile.id}
              />
            </>
          ) : null}

          {activeTab === 'artwork' ? (
            <>
              <PhotographerCompetitionBanner featured={PHOTOGRAPHER_FEATURED} />
              <PhotographerSlideshowsSection
                ownerName={PHOTOGRAPHER_PROFILE.name}
              />
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

          <PhotographerShareBanner photographerName={profile.name} />
        </Shell>
      </section>
    </SitePageLayout>
  );
});

PhotographerProfileMain.displayName = 'PhotographerProfileMain';

export default PhotographerProfileMain;
