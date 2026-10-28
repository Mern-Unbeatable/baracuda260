import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  getSavedArtworksApi,
  SAVED_ARTWORKS_QUERY_KEY,
  toggleSaveArtworkApi,
} from '@/shared/api/userProfile.api';
import { toggleLikeArtworkApi } from '@/shared/api/artworks.api';
import { galleryDetailPath } from '@/shared/data/galleryPhotos';
import { resolveMediaUrl } from '@/shared/utils/media';

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
      metaObj.totalRecords ?? metaObj.total ?? metaObj.totalCount ?? itemsLength;
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

  const imageUrl = resolveMediaUrl(
    rawArtwork.coverImage ||
      rawArtwork.image ||
      rawArtwork.featuredImage ||
      item.coverImage ||
      item.image ||
      item.featuredImage ||
      '',
  );

  const likesCount = Number(
    rawArtwork.likesCount ??
      rawArtwork.likes ??
      rawArtwork.votesCount ??
      item.likesCount ??
      item.likes ??
      0,
  );

  const isLiked = Boolean(
    rawArtwork.isLiked ??
      rawArtwork.liked ??
      rawArtwork.isLikedByUser ??
      item.isLiked ??
      item.liked ??
      false,
  );

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
    likes: likesCount,
    liked: isLiked,
    isLiked,
    views:
      (rawArtwork.viewsCount ?? item.viewsCount) != null
        ? Number(
            rawArtwork.viewsCount ?? item.viewsCount,
          ).toLocaleString('en-US')
        : null,
    votes: rawArtwork.votesCount ?? item.votesCount ?? 0,
    date: dateFormatted,
    competitionLabel:
      (rawArtwork.competitionState || item.competitionState) ===
      'IN_COMPETITION'
        ? 'In Competition'
        : null,
    competitionState: rawArtwork.competitionState || item.competitionState,
    status: rawArtwork.status || item.status,
    user: rawArtwork.user || item.user || null,
    saved: item.isSaved ?? rawArtwork.isSaved ?? true,
    extraPhotosLabel,
    href: galleryDetailPath(artworkId),
    raw: item,
  };
};

export default function useSavedArtworks({ page = 1, limit = 10 } = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SAVED_ARTWORKS_QUERY_KEY({ page, limit }),
    queryFn: () => getSavedArtworksApi({ page, limit }),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const rawData = query.data;
  const rawItems = extractItems(rawData);
  const meta = extractMeta(rawData, page, limit, rawItems.length);

  const items = useMemo(() => {
    return rawItems.map(normalizeSavedArtwork).filter(Boolean);
  }, [rawItems]);

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

  const toggleLikeMutation = useMutation({
    mutationFn: (artworkId) => toggleLikeArtworkApi(artworkId),
    onSuccess: (response, artworkId) => {
      queryClient.invalidateQueries({ queryKey: ['saved-artworks'] });
      queryClient.invalidateQueries({ queryKey: ['user-artworks'] });
      queryClient.invalidateQueries({
        queryKey: ['artwork-detail', artworkId],
      });
      if (response?.message) {
        toast.success(response.message);
      }
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('common.errors.general', 'Failed to update like status.'),
        ),
      );
    },
  });

  return {
    ...query,
    items,
    meta,
    toggleSave: toggleSaveMutation.mutate,
    toggleSaveAsync: toggleSaveMutation.mutateAsync,
    isTogglingSave: toggleSaveMutation.isPending,
    toggleLike: toggleLikeMutation.mutate,
    toggleLikeAsync: toggleLikeMutation.mutateAsync,
    isTogglingLike: toggleLikeMutation.isPending,
  };
}
