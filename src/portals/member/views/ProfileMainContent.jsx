import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import PhotographerStandaloneVideosSection from '@/portals/public/photographer/components/PhotographerStandaloneVideosSection';
import PhotographerStoreSection from '@/portals/public/photographer/components/PhotographerStoreSection';
import PhotographerTalentAppreciation from '@/portals/public/photographer/components/PhotographerTalentAppreciation';
import {
  PHOTOGRAPHER_ASSETS,
  PHOTOGRAPHER_STORE_PRODUCTS,
} from '@/portals/public/photographer/data/photographerProfileData';
import {
  deleteArtworkApi,
  USER_ARTWORKS_QUERY_KEY,
  VIDEO_COMMENTS_QUERY_KEY,
} from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { USER_PROFILE_ME_QUERY_KEY } from '@/shared/api/userProfile.api';
import { SLIDESHOW_SEARCH_PARAM } from '@/shared/data/slideshows';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';
import { resolveMediaUrl } from '@/shared/utils/media';

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

  const introVideo = useMemo(() => {
    if (profileData?.introVideo) {
      return {
        image:
          resolveMediaUrl(
            profileData.introVideoThumbnail || profileData.coverPhoto,
          ) || PHOTOGRAPHER_ASSETS.featuredVideo,
        url: resolveMediaUrl(profileData.introVideo),
        title: `${profileData.name || 'Artist'} · Introduction Video`,
        isDummy: false,
      };
    }
    // High-quality introduction video demo fallback
    return {
      image:
        resolveMediaUrl(profileData?.coverPhoto) ||
        PHOTOGRAPHER_ASSETS.featuredVideo,
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: `${profileData?.name || 'Artist'} · Introduction Video`,
      isDummy: true,
      duration: '1:00',
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
      <PhotographerProfileTabs activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === 'profile' ? (
        <>
          <WeeklyAppreciationBanner className="mt-5 sm:mt-6" />
          <MemberProfileStatsBar stats={profile.stats} />
          <PhotographerAboutSection profile={profile} />
          <PhotographerFeaturedVideo video={introVideo} />
          <PhotographerTalentAppreciation
            appreciation={appreciation}
            photographerName={profile.name}
            userId={profile.id}
            username={profile.username}
          />
        </>
      ) : null}

      {activeTab === 'artwork' ? (
        <>
          <PhotographerCompetitionBanner featured={MEMBER_FEATURED} />
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
            isDeletingId={deleteVideoMutation.isPending ? deleteVideoMutation.variables : null}
          />
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
          products={PHOTOGRAPHER_STORE_PRODUCTS}
          isOwner={true}
        />
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
