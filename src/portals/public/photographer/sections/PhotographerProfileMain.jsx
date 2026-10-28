import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import PhotographerProfileHeader from '@/components/data-display/PhotographerProfileHeader/PhotographerProfileHeader';
import PhotographerStatsBar from '@/components/data-display/PhotographerStatsBar/PhotographerStatsBar';
import { DASHBOARD_ASSETS } from '@/portals/member/data/dashboardAssets';
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
  PHOTOGRAPHER_MESSAGES,
  PHOTOGRAPHER_PREMIUM,
  PHOTOGRAPHER_STORE_PRODUCTS,
} from '@/portals/public/photographer/data/photographerProfileData';
import {
  getUserProfileByUsernameApi,
  USER_PROFILE_USERNAME_QUERY_KEY,
} from '@/shared/api/userProfile.api';
import { SLIDESHOW_SEARCH_PARAM } from '@/shared/data/slideshows';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import { resolveMediaUrl } from '@/shared/utils/media';

const PhotographerProfileMain = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const { username: paramUsername } = useParams();
  const [searchParams] = useSearchParams();
  const username = paramUsername || searchParams.get('username');

  const [activeTab, setActiveTab] = useState(
    () =>
      location.state?.tab ||
      (searchParams.has(SLIDESHOW_SEARCH_PARAM) ? 'artwork' : 'profile'),
  );

  const {
    data: profileResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: USER_PROFILE_USERNAME_QUERY_KEY(username),
    queryFn: () => getUserProfileByUsernameApi(username),
    enabled: Boolean(username),
    staleTime: 60 * 1000,
  });

  const profile = useMemo(() => {
    const raw = profileResponse?.data;
    if (!raw) return null;

    const handle = raw.username
      ? `@${raw.username.replace(/^@/, '')}`
      : '';
    const location = [raw.city, raw.country].filter(Boolean).join(', ');

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
      id: raw.id,
      username: raw.username,
      name: raw.name || raw.username || '',
      avatar: resolveMediaUrl(raw.avatar) || DASHBOARD_ASSETS.avatar,
      coverImage: resolveMediaUrl(raw.coverPhoto) || '',
      handle,
      tagline: raw.tagline || '',
      location,
      bio: raw.bio || '',
      isFollowing: Boolean(raw.isFollowing),
      website: socialObj.website || '',
      instagram: socialObj.instagram || '',
      twitter: socialObj.twitter || '',
      youtube: socialObj.youtube || '',
      tiktok: socialObj.tiktok || '',
      stats: {
        followers: Number(raw.stats?.followers ?? 0),
        following: Number(raw.stats?.following ?? 0),
        profileVisitors: Number(
          raw.profileViews ?? raw.stats?.profileVisitors ?? 0,
        ),
        totalArtwork: Number(raw.stats?.totalArtwork ?? 0),
        competitionEntries: Number(raw.stats?.competitionEntries ?? 0),
        totalHearts: Number(raw.stats?.totalHearts ?? 0),
      },
      appreciation: raw.appreciation || null,
    };
  }, [profileResponse]);

  const featuredVideo = useMemo(() => {
    if (!profileResponse?.data?.introVideo) return null;
    return {
      image: resolveMediaUrl(
        profileResponse.data.introVideoThumbnail ||
          profileResponse.data.coverPhoto,
      ),
      url: resolveMediaUrl(profileResponse.data.introVideo),
      title: profileResponse.data.name || '',
    };
  }, [profileResponse?.data]);

  return (
    <SitePageLayout
      activeHref=""
      rootClassName="photographer-profile-root"
      announcementTone="blue"
      newsletterVariant="page"
    >
      <section className="bg-white section-py-top pb-10 sm:pb-12">
        <Shell>
          {isLoading ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 py-16">
              <RefreshCw size={28} className="animate-spin text-[#4048cd]" />
              <p className="text-[14px] text-[#6b7280]">
                {t('common.loading', 'Loading profile...')}
              </p>
            </div>
          ) : isError && !profile ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 py-16 text-center">
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
          ) : profile ? (
            <>
              <PhotographerProfileHeader profile={profile} />
              <PhotographerProfileTabs
                activeTab={activeTab}
                onChange={setActiveTab}
              />

              {activeTab === 'profile' ? (
                <>
                  <PhotographerStatsBar stats={profile.stats} />
                  <PhotographerAboutSection profile={profile} />
                  {featuredVideo?.image ? (
                    <PhotographerFeaturedVideo video={featuredVideo} />
                  ) : null}
                  <PhotographerTalentAppreciation
                    appreciation={profile.appreciation}
                    photographerName={profile.name}
                    userId={profile.id}
                  />
                </>
              ) : null}

              {activeTab === 'artwork' ? (
                <>
                  <PhotographerCompetitionBanner
                    featured={PHOTOGRAPHER_FEATURED}
                  />
                  <PhotographerSlideshowsSection
                    username={username || profile.username}
                    ownerName={profile.name}
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
                <PhotographerStoreSection
                  products={PHOTOGRAPHER_STORE_PRODUCTS}
                />
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
            </>
          ) : null}
        </Shell>
      </section>
    </SitePageLayout>
  );
});

PhotographerProfileMain.displayName = 'PhotographerProfileMain';

export default PhotographerProfileMain;
