import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  toggleLikeArtworkApi,
  voteArtworkApi,
} from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  getSavedArtworksApi,
  SAVED_ARTWORKS_QUERY_KEY,
  toggleSaveArtworkApi,
} from '@/shared/api/userProfile.api';
import { ROUTES } from '@/shared/config';
import { optimizeImageUrl, resolveMediaUrl } from '@/shared/utils/media';

/**
 * Extract items array from varying response structures.
 */
const extractItems = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data?.data)) return data.data.data;
  return [];
};

/**
 * Extract pagination meta from response or fallback to computed defaults.
 */
const extractMeta = (data, fallbackPage, fallbackLimit, itemsLength) => {
  const metaObj = data?.meta || data?.data?.meta || data?.pagination;
  if (metaObj) {
    const totalRecords =
      metaObj.totalRecords ??
      metaObj.total ??
      metaObj.totalCount ??
      itemsLength;
    const totalPages =
      metaObj.totalPages ??
      metaObj.pageCount ??
      Math.max(1, Math.ceil(totalRecords / fallbackLimit));
    return {
      currentPage: Number(metaObj.currentPage ?? fallbackPage),
      totalPages: Math.max(1, Number(totalPages)),
      totalRecords: Number(totalRecords),
      hasNext: Boolean(metaObj.hasNext),
      hasPrevious: Boolean(metaObj.hasPrevious),
    };
  }
  return {
    currentPage: fallbackPage,
    totalPages: Math.max(1, Math.ceil(itemsLength / fallbackLimit)),
    totalRecords: itemsLength,
    hasNext: false,
    hasPrevious: false,
  };
};

/**
 * Normalize saved artwork from API for PhotoShowcaseCard.
 */
export const normalizeSavedArtwork = (item) => {
  if (!item) return null;
  const rawArtwork = item.artwork || item.artworkDetails || item.photo || item;
  const artworkId =
    item.artworkId || item.artwork_id || rawArtwork?.id || item.id;
  const kind = String(rawArtwork.kind || item.kind || 'SINGLE').toUpperCase();
  let badge = 'Single Photo';
  let extraPhotosLabel = null;
  if (kind === 'TWELVE') {
    badge = '12 Photo Story';
    extraPhotosLabel = '+11 photos';
  } else if (kind === 'SIX') {
    badge = '6 Photo Story';
    extraPhotosLabel = '+5 photos';
  }

  const createdDate =
    rawArtwork.createdAt || item.createdAt
      ? new Date(rawArtwork.createdAt || item.createdAt)
      : null;
  const dateFormatted =
    createdDate && !isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

  const rawImage =
    rawArtwork.coverImage ||
    rawArtwork.featuredImage ||
    rawArtwork.media?.[0]?.thumbnailUrl ||
    rawArtwork.media?.[0]?.url ||
    rawArtwork.image ||
    item.coverImage ||
    item.featuredImage ||
    item.media?.[0]?.thumbnailUrl ||
    item.media?.[0]?.url ||
    item.image ||
    '';
  // Card grids must never decode full-resolution originals — that stalls scroll.
  const imageUrl = optimizeImageUrl(resolveMediaUrl(rawImage), 480);

  const competitionState = String(
    rawArtwork.competitionState || item.competitionState || '',
  ).toUpperCase();
  const competitionStatus = String(
    rawArtwork.competition?.status ||
      item.competition?.status ||
      '',
  ).toUpperCase();
  const usesVotes =
    competitionState === 'IN_COMPETITION' || competitionState === 'ENDED';
  const votingClosed = Boolean(
    rawArtwork.votingClosed ??
      item.votingClosed ??
      (competitionState === 'ENDED' ||
        (Boolean(competitionStatus) && competitionStatus !== 'OPEN')),
  );
  const engagementType = usesVotes ? 'vote' : 'like';

  const likesCount = Number(rawArtwork.likesCount ?? item.likesCount ?? 0);
  const votesCount = Number(rawArtwork.votesCount ?? item.votesCount ?? 0);
  // Heart metric: votes for competition entries, likes otherwise — never mix them
  const engagementCount = usesVotes ? votesCount : likesCount;

  const isLiked = Boolean(
    rawArtwork.isLiked ??
      rawArtwork.liked ??
      rawArtwork.isLikedByUser ??
      item.isLiked ??
      item.liked ??
      false,
  );
  const isVoted = Boolean(
    rawArtwork.isVoted ??
      rawArtwork.voted ??
      rawArtwork.isVotedByUser ??
      item.isVoted ??
      item.voted ??
      false,
  );
  const engaged = usesVotes ? isVoted : isLiked;

  return {
    id: artworkId,
    savedRecordId: item.id,
    kind,
    badge,
    title: rawArtwork.title || item.title || 'Untitled Artwork',
    description:
      rawArtwork.story ||
      rawArtwork.description ||
      item.story ||
      item.description ||
      '',
    image: imageUrl || '/assets/home/photo-city.webp',
    likes: engagementCount,
    liked: engaged,
    isLiked: engaged,
    isVoted,
    engagementType,
    engagementDisabled: usesVotes && votingClosed,
    votingClosed,
    views:
      (rawArtwork.viewsCount ?? item.viewsCount) != null
        ? Number(rawArtwork.viewsCount ?? item.viewsCount).toLocaleString(
            'en-US',
          )
        : null,
    votes: votesCount,
    likesCount,
    date: dateFormatted,
    competitionLabel:
      competitionState === 'IN_COMPETITION' && !votingClosed
        ? 'In Competition'
        : votingClosed && usesVotes
          ? 'Competition Ended'
          : null,
    competitionState,
    status: rawArtwork.status || item.status,
    user: rawArtwork.user || item.user || null,
    saved: item.isSaved ?? rawArtwork.isSaved ?? true,
    extraPhotosLabel,
    href: `${ROUTES.USER_FAVOURITE_PHOTOS}/${artworkId}`,
    raw: item,
  };
};

export default function useSavedArtworks({ page = 1, limit = 10 } = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SAVED_ARTWORKS_QUERY_KEY({ page, limit }),
    queryFn: () => getSavedArtworksApi({ page, limit }),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const rawData = query.data;

  const items = useMemo(() => {
    return extractItems(rawData).map(normalizeSavedArtwork).filter(Boolean);
  }, [rawData]);

  const meta = useMemo(
    () => extractMeta(rawData, page, limit, items.length),
    [rawData, page, limit, items.length],
  );

  const toggleSaveMutation = useMutation({
    mutationFn: (artworkId) => toggleSaveArtworkApi(artworkId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['saved-artworks'] });
      if (response?.message) {
        toast.success(response.message);
      }
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('common.errors.general', 'Failed to update saved status.'),
        ),
      );
    },
  });

  const toggleEngagementMutation = useMutation({
    mutationFn: async ({ artworkId, engagementType }) => {
      if (engagementType === 'vote') {
        return voteArtworkApi(artworkId);
      }
      return toggleLikeArtworkApi(artworkId);
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['saved-artworks'] });
      queryClient.invalidateQueries({ queryKey: ['user-artworks'] });
      queryClient.invalidateQueries({
        queryKey: ['artwork-detail', variables.artworkId],
      });
      if (response?.message) {
        toast.success(response.message);
      }
    },
    onError: (err, variables) => {
      toast.error(
        getApiErrorMessage(
          err,
          variables?.engagementType === 'vote'
            ? t('competitionsPage.voteError', 'Failed to record vote.')
            : t('common.errors.general', 'Failed to update like status.'),
        ),
      );
    },
  });

  const toggleEngagement = (artworkId, engagementType = 'like') =>
    toggleEngagementMutation.mutateAsync({ artworkId, engagementType });

  return {
    ...query,
    items,
    meta,
    toggleSave: toggleSaveMutation.mutate,
    toggleSaveAsync: toggleSaveMutation.mutateAsync,
    isTogglingSave: toggleSaveMutation.isPending,
    toggleLike: (artworkId) => toggleEngagement(artworkId, 'like'),
    toggleLikeAsync: (artworkId) => toggleEngagement(artworkId, 'like'),
    toggleEngagement,
    isTogglingLike: toggleEngagementMutation.isPending,
  };
}
