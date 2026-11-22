import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import React, { memo, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import MemberProfileCoverHeader from '@/components/data-display/MemberProfileCoverHeader/MemberProfileCoverHeader';
import MemberProfileStatsBar from '@/components/data-display/MemberProfileStatsBar/MemberProfileStatsBar';
import WeeklyAppreciationBanner from '@/components/data-display/WeeklyAppreciationBanner/WeeklyAppreciationBanner';
import UploadIntroVideoModal from '@/portals/member/components/member-artwork/UploadIntroVideoModal';
import { DASHBOARD_ASSETS } from '@/portals/member/data/dashboardAssets';
import useUserProfileMe from '@/portals/member/hooks/useUserProfileMe';
import PhotographerAboutSection from '@/portals/public/photographer/components/PhotographerAboutSection';
import PhotographerArtworkGrid from '@/portals/public/photographer/components/PhotographerArtworkGrid';
import PhotographerCompetitionBanner from '@/portals/public/photographer/components/PhotographerCompetitionBanner';
import PhotographerFeaturedVideo from '@/portals/public/photographer/components/PhotographerFeaturedVideo';
import PhotographerMessagesSection from '@/portals/public/photographer/components/PhotographerMessagesSection';
import PhotographerProfileTabs from '@/portals/public/photographer/components/PhotographerProfileTabs';
import PhotographerShareBanner from '@/portals/public/photographer/components/PhotographerShareBanner';
import PhotographerSlideshowsSection from '@/portals/public/photographer/components/PhotographerSlideshowsSection';
import PhotographerStandaloneVideosSection from '@/portals/public/photographer/components/PhotographerStandaloneVideosSection';
import PhotographerStoreSection from '@/portals/public/photographer/components/PhotographerStoreSection';
import PhotographerTalentAppreciation from '@/portals/public/photographer/components/PhotographerTalentAppreciation';
import {
  deleteArtworkApi,
  getUserArtworksApi,
  mapArtworkToFeaturedBanner,
  mapArtworkToProfileShowcase,
  USER_ARTWORKS_QUERY_KEY,
  VIDEO_COMMENTS_QUERY_KEY,
} from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  getMarketplacePremiumPhotosApi,
  MARKETPLACE_PREMIUM_PHOTOS_QUERY_KEY,
} from '@/shared/api/premiumPhotos.api';
import { getPostsApi, USER_POSTS_QUERY_KEY } from '@/shared/api/posts.api';
import { USER_PROFILE_ME_QUERY_KEY } from '@/shared/api/userProfile.api';
import { SLIDESHOW_SEARCH_PARAM } from '@/shared/data/slideshows';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';
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

const ProfileMainContent = memo(() => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = resolveProfileTab(searchParams);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserProfileMe();

  const username = profileData?.username || '';

  const isArtworkTab = activeTab === 'artwork';
  const isPremiumTab = activeTab === 'premium';
  const isPostsTab = activeTab === 'posts';

  const { data: artworksResponse, isLoading: isArtworksLoading } = useQuery({
    queryKey: [...USER_ARTWORKS_QUERY_KEY, 'member-profile', 'all'],
    queryFn: () =>
      getUserArtworksApi({
        status: 'all',
        sort: 'newest',
        page: 1,
        limit: 24,
      }),
    enabled: Boolean(profileData?.id) && isArtworkTab,
    staleTime: 60 * 1000,
  });

  const { data: competitionArtworksResponse } = useQuery({
    queryKey: [...USER_ARTWORKS_QUERY_KEY, 'member-profile', 'competition'],
    queryFn: () =>
      getUserArtworksApi({
        status: 'inCompetition',
        sort: 'newest',
        page: 1,
        limit: 10,
      }),
    enabled: Boolean(profileData?.id) && isArtworkTab,
    staleTime: 60 * 1000,
  });

  const { data: premiumPhotosResponse } = useQuery({
    queryKey: MARKETPLACE_PREMIUM_PHOTOS_QUERY_KEY({
      kind: 'ALL',
      username,
      scope: 'member-profile',
    }),
    queryFn: () =>
      getMarketplacePremiumPhotosApi({
        kind: 'ALL',
        page: 1,
        limit: 20,
        username,
      }),
    enabled: Boolean(username) && isPremiumTab,
    staleTime: 60 * 1000,
  });

  const { data: postsResponse, isLoading: isPostsLoading } = useQuery({
    queryKey: USER_POSTS_QUERY_KEY({ scope: 'member-me', page: 1, limit: 20 }),
    queryFn: () => getPostsApi({ page: 1, limit: 20 }),
    enabled: Boolean(profileData?.id) && isPostsTab,
    staleTime: 60 * 1000,
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId) => deleteArtworkApi(videoId),
    onSuccess: () => {
      toast.success(
        t('standaloneVideos.deleteSuccess', 'Video deleted successfully.'),
      );
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_ME_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_ARTWORKS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: VIDEO_COMMENTS_QUERY_KEY });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(err) ||
          t('standaloneVideos.deleteError', 'Failed to delete video.'),
      );
    },
  });

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setIsEditModalOpen(true);
  };

  const handleDeleteVideo = async (video) => {
    if (!video?.id) return;
    const confirmed = await confirmDestructiveAction({
      title: t('standaloneVideos.deleteConfirmTitle', 'Delete this video?'),
      text: t(
        'standaloneVideos.deleteConfirmText',
        'This 1-minute video update will be permanently removed.',
      ),
      confirmButtonText: t('common.delete', 'Delete'),
      cancelButtonText: t('common.cancel', 'Cancel'),
    });
    if (!confirmed) return;
    deleteVideoMutation.mutate(video.id);
  };

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

  const introVideo = useMemo(() => {
    if (!profileData?.introVideo) return null;
    return {
      image:
        resolveMediaUrl(
          profileData.introVideoThumbnail || profileData.coverPhoto,
        ) || '',
      url: resolveMediaUrl(profileData.introVideo),
      title: `${profileData.name || 'Artist'} · Introduction Video`,
      isDummy: false,
    };
  }, [
    profileData?.introVideo,
    profileData?.introVideoThumbnail,
    profileData?.coverPhoto,
    profileData?.name,
  ]);

  const appreciation = useMemo(
    () => profileData?.appreciation || null,
    [profileData?.appreciation],
  );

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

  const activeSubmissionId = useMemo(
    () =>
      profileArtworks[0]?.id ||
      featuredCompetition[0]?.id ||
      profileData?.standaloneVideos?.[0]?.id ||
      null,
    [profileArtworks, featuredCompetition, profileData?.standaloneVideos],
  );

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
      <PhotographerProfileTabs activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === 'profile' ? (
        <>
          <WeeklyAppreciationBanner className="mt-5 sm:mt-6" />
          <MemberProfileStatsBar stats={profile.stats} />
          <PhotographerAboutSection profile={profile} />
          {introVideo ? <PhotographerFeaturedVideo video={introVideo} /> : null}
          <PhotographerTalentAppreciation
            appreciation={appreciation}
            photographerName={profile.name}
            userId={profile.id}
            username={profile.username}
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
              username={profile.username}
            />
          ) : null}
          <PhotographerStandaloneVideosSection
            videos={
              profileData?.standaloneVideos ||
              profileData?.data?.standaloneVideos ||
              []
            }
            artistName={profile.name}
            canManage
            onEdit={handleEditVideo}
            onDelete={handleDeleteVideo}
            isDeletingId={
              deleteVideoMutation.isPending ? deleteVideoMutation.variables : null
            }
          />
          <PhotographerSlideshowsSection canManage ownerName={profile.name} />
          {isArtworksLoading ? (
            <div className="mt-10 flex min-h-40 items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-[#4048cd]" />
            </div>
          ) : (
            <PhotographerArtworkGrid
              titleKey="photographerProfile.artwork.title"
              subtitleKey="photographerProfile.artwork.subtitle"
              photos={profileArtworks}
              showCompetitionTag
            />
          )}
          <UploadIntroVideoModal
            isOpen={isEditModalOpen}
            editingVideo={editingVideo}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingVideo(null);
            }}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setEditingVideo(null);
              refetch();
            }}
          />
        </>
      ) : null}

      {activeTab === 'store' ? (
        <PhotographerStoreSection
          userId={profile?.id}
          username={profile?.username}
          isOwner={true}
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
            <RefreshCw size={24} className="animate-spin text-[#4048cd]" />
          </div>
        ) : (
          <PhotographerMessagesSection messages={profilePosts} />
        )
      ) : null}

      <PhotographerShareBanner photographerName={profile.name} />
    </div>
  );
});

ProfileMainContent.displayName = 'ProfileMainContent';

export default ProfileMainContent;
