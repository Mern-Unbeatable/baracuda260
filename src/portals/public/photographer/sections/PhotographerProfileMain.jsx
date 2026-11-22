import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { selectUser } from '@/app/store/slices/authSlice';
import PhotographerProfileHeader from '@/components/data-display/PhotographerProfileHeader/PhotographerProfileHeader';
import PhotographerStatsBar from '@/components/data-display/PhotographerStatsBar/PhotographerStatsBar';
import WeeklyAppreciationBanner from '@/components/data-display/WeeklyAppreciationBanner/WeeklyAppreciationBanner';
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
import PhotographerStandaloneVideosSection from '@/portals/public/photographer/components/PhotographerStandaloneVideosSection';
import {
  getUserArtworksApi,
  mapArtworkToFeaturedBanner,
  mapArtworkToProfileShowcase,
} from '@/shared/api/artworks.api';
import {
  getMarketplacePremiumPhotosApi,
  MARKETPLACE_PREMIUM_PHOTOS_QUERY_KEY,
} from '@/shared/api/premiumPhotos.api';
import { getPostsApi, USER_POSTS_QUERY_KEY } from '@/shared/api/posts.api';
import {
  getUserProfileByUsernameApi,
  USER_PROFILE_USERNAME_QUERY_KEY,
} from '@/shared/api/userProfile.api';
import { SLIDESHOW_SEARCH_PARAM } from '@/shared/data/slideshows';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import { resolveMediaUrl } from '@/shared/utils/media';

const mapPostToProfileMessage = (post) => {
  if (!post) return null;
  return {
    id: post.id,
    author: post.authorName || post.user?.name || 'Photographer',
    avatar:
      post.authorAvatar ||
      resolveMediaUrl(post.user?.avatar) ||
      DASHBOARD_ASSETS.avatar,
    date: post.postedDate || '',
    time: post.postedTime || '',
    text: post.body || '',
    image: post.image || post.mediaUrl || null,
    likes: post.likesCount ?? post.likes ?? 0,
  };
};

const PROFILE_TAB_IDS = new Set([
  'profile',
  'artwork',
  'store',
  'premium',
  'posts',
]);
const PROFILE_TAB_SEARCH_PARAM = 'tab';

const resolveProfileTab = (searchParams) => {
  if (searchParams.has(SLIDESHOW_SEARCH_PARAM)) return 'artwork';
  const tab = searchParams.get(PROFILE_TAB_SEARCH_PARAM);
  return PROFILE_TAB_IDS.has(tab) ? tab : 'profile';
};

const PhotographerProfileMain = memo(() => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectUser);
  const { username: paramUsername } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const username = (paramUsername || searchParams.get('username') || '')
    .trim()
    .replace(/^@/, '');
  const activeTab = resolveProfileTab(searchParams);

  const handleTabChange = useCallback(
    (tabId) => {
      if (!PROFILE_TAB_IDS.has(tabId)) return;

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (tabId === 'profile') {
            next.delete(PROFILE_TAB_SEARCH_PARAM);
          } else {
            next.set(PROFILE_TAB_SEARCH_PARAM, tabId);
          }
          if (tabId !== 'artwork') {
            next.delete(SLIDESHOW_SEARCH_PARAM);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
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

  const { data: premiumPhotosResponse } = useQuery({
    queryKey: MARKETPLACE_PREMIUM_PHOTOS_QUERY_KEY({
      kind: 'ALL',
      username,
    }),
    queryFn: () =>
      getMarketplacePremiumPhotosApi({
        kind: 'ALL',
        page: 1,
        limit: 20,
        username,
      }),
    enabled: Boolean(username),
    staleTime: 60 * 1000,
  });

  const { data: artworksResponse, isLoading: isArtworksLoading } = useQuery({
    queryKey: ['profile-artworks', username],
    queryFn: () =>
      getUserArtworksApi({
        username,
        status: 'all',
        sort: 'newest',
        page: 1,
        limit: 50,
      }),
    enabled: Boolean(username),
    staleTime: 60 * 1000,
  });

  const { data: competitionArtworksResponse } = useQuery({
    queryKey: ['profile-competition-artworks', username],
    queryFn: () =>
      getUserArtworksApi({
        username,
        status: 'inCompetition',
        sort: 'newest',
        page: 1,
        limit: 20,
      }),
    enabled: Boolean(username),
    staleTime: 60 * 1000,
  });

  const { data: postsResponse, isLoading: isPostsLoading } = useQuery({
    queryKey: USER_POSTS_QUERY_KEY({ username, page: 1, limit: 20 }),
    queryFn: () => getPostsApi({ username, page: 1, limit: 20 }),
    enabled: Boolean(username),
    staleTime: 60 * 1000,
  });

  const profile = useMemo(() => {
    const raw = profileResponse?.data || profileResponse;
    if (!raw || (!raw.id && !raw.username)) return null;

    const handle = raw.username ? `@${raw.username.replace(/^@/, '')}` : '';
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
        if (typeof url !== 'string') return;
        if (url.includes('instagram.com')) socialObj.instagram = url;
        else if (url.includes('twitter.com') || url.includes('x.com'))
          socialObj.twitter = url;
        else if (url.includes('youtube.com')) socialObj.youtube = url;
        else if (url.includes('tiktok.com')) socialObj.tiktok = url;
        else if (!socialObj.website) socialObj.website = url;
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
      standaloneVideos: raw.standaloneVideos || [],
      appreciation: raw.appreciation || null,
    };
  }, [profileResponse]);

  const isOwner = useMemo(() => {
    if (!currentUser || !profile) return false;
    if (username && currentUser.username === username) return true;
    if (profile.id && currentUser.id === profile.id) return true;
    if (profile.username && currentUser.username === profile.username) return true;
    return false;
  }, [currentUser, username, profile]);

  const introVideo = useMemo(() => {
    const raw = profileResponse?.data || profileResponse;
    if (!raw?.introVideo) return null;
    return {
      // Never fall back to coverPhoto — cover is the profile banner only
      image: resolveMediaUrl(raw.introVideoThumbnail) || '',
      url: resolveMediaUrl(raw.introVideo),
      title: `${profile?.name || 'Artist'} · Introduction Video`,
      isDummy: false,
    };
  }, [profileResponse, profile?.name]);

  const profileArtworks = useMemo(() => {
    const items = artworksResponse?.items || artworksResponse?.data || [];
    return items.map(mapArtworkToProfileShowcase).filter(Boolean);
  }, [artworksResponse]);

  const featuredCompetition = useMemo(() => {
    const items =
      competitionArtworksResponse?.items ||
      competitionArtworksResponse?.data ||
      [];
    return items.map(mapArtworkToFeaturedBanner).filter(Boolean);
  }, [competitionArtworksResponse]);

  const profilePosts = useMemo(() => {
    const items = postsResponse?.items || [];
    return items.map(mapPostToProfileMessage).filter(Boolean);
  }, [postsResponse]);

  const premiumPhotos = useMemo(() => {
    const items = premiumPhotosResponse?.data || [];
    return items.map((item) => {
      if (item.image && item.badge) return item;
      return {
        id: item.id,
        title: item.title || 'Premium Photo',
        description: item.description || item.story || '',
        image:
          resolveMediaUrl(
            item.coverImage || item.image || item.media?.[0]?.url,
          ) || '',
        badge: item.badge || 'Single Photo',
        votes: String(item.likesCount ?? item.votes ?? 0),
        views: String(item.viewsCount ?? item.views ?? 0),
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
        price: item.price
          ? `$${Number(item.price).toFixed(2)}`
          : item.formattedPrice,
        href: item.href,
        isAiGenerated: Boolean(item.isAiGenerated),
      };
    });
  }, [premiumPhotosResponse]);

  const activeSubmissionId = useMemo(() => {
    const raw = profileResponse?.data || profileResponse;
    return (
      profileArtworks[0]?.id ||
      featuredCompetition[0]?.id ||
      raw?.standaloneVideos?.[0]?.id ||
      premiumPhotosResponse?.data?.[0]?.submissionId ||
      premiumPhotosResponse?.data?.[0]?.id ||
      null
    );
  }, [
    profileArtworks,
    featuredCompetition,
    profileResponse,
    premiumPhotosResponse?.data,
  ]);

  if (!username) {
    return (
      <SitePageLayout
        activeHref=""
        rootClassName="photographer-profile-root"
        announcementTone="blue"
        newsletterVariant="page"
      >
        <section className="bg-white section-py-top pb-10 sm:pb-12">
          <Shell>
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 py-16 text-center">
              <p className="text-[18px] font-semibold text-[#111827]">
                {t(
                  'photographerProfile.notFound',
                  'Photographer profile not found',
                )}
              </p>
              <p className="text-[14px] text-[#6b7280]">
                {t(
                  'photographerProfile.usernameRequired',
                  'Open a photographer profile with a valid username.',
                )}
              </p>
            </div>
          </Shell>
        </section>
      </SitePageLayout>
    );
  }

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
                onChange={handleTabChange}
              />

              {activeTab === 'profile' ? (
                <>
                  <WeeklyAppreciationBanner className="mt-5 sm:mt-6" />
                  <PhotographerStatsBar stats={profile.stats} />
                  <PhotographerAboutSection profile={profile} />
                  {introVideo ? (
                    <PhotographerFeaturedVideo video={introVideo} />
                  ) : null}
                  <PhotographerTalentAppreciation
                    appreciation={profile.appreciation}
                    photographerName={profile.name}
                    userId={profile.id}
                    username={username || profile.username}
                    submissionId={activeSubmissionId}
                  />
                </>
              ) : null}

              {activeTab === 'artwork' ? (
                <>
                  {featuredCompetition.length > 0 ? (
                    <PhotographerCompetitionBanner
                      featured={featuredCompetition}
                      photographerName={profile.name}
                      userId={profile.id}
                      username={username || profile.username}
                    />
                  ) : null}
                  <PhotographerStandaloneVideosSection
                    videos={profile.standaloneVideos || []}
                    artistName={profile.name}
                  />
                  <PhotographerSlideshowsSection
                    username={username || profile.username}
                    ownerName={profile.name}
                    canManage={isOwner}
                  />
                  {isArtworksLoading ? (
                    <div className="mt-10 flex min-h-40 items-center justify-center">
                      <RefreshCw
                        size={24}
                        className="animate-spin text-[#4048cd]"
                      />
                    </div>
                  ) : (
                    <PhotographerArtworkGrid
                      titleKey="photographerProfile.artwork.title"
                      subtitleKey="photographerProfile.artwork.subtitle"
                      photos={profileArtworks}
                      showCompetitionTag
                    />
                  )}
                </>
              ) : null}

              {activeTab === 'store' ? (
                <PhotographerStoreSection
                  userId={profile?.id}
                  username={username || profile?.username}
                  isOwner={isOwner}
                />
              ) : null}

              {activeTab === 'premium' ? (
                <PhotographerArtworkGrid
                  titleKey="photographerProfile.premium.title"
                  subtitleKey="photographerProfile.premium.subtitle"
                  photos={premiumPhotos}
                  showPrice
                />
              ) : null}

              {activeTab === 'posts' ? (
                isPostsLoading ? (
                  <div className="mt-10 flex min-h-40 items-center justify-center">
                    <RefreshCw
                      size={24}
                      className="animate-spin text-[#4048cd]"
                    />
                  </div>
                ) : (
                  <PhotographerMessagesSection messages={profilePosts} />
                )
              ) : null}

              <PhotographerShareBanner photographerName={profile.name} />
            </>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 py-16 text-center">
              <p className="text-[18px] font-semibold text-[#111827]">
                {t(
                  'photographerProfile.notFound',
                  'Photographer profile not found',
                )}
              </p>
              <p className="text-[14px] text-[#6b7280]">
                {t(
                  'photographerProfile.notFoundDesc',
                  'The photographer profile you are looking for does not exist.',
                )}
              </p>
            </div>
          )}
        </Shell>
      </section>
    </SitePageLayout>
  );
});

PhotographerProfileMain.displayName = 'PhotographerProfileMain';

export default PhotographerProfileMain;
