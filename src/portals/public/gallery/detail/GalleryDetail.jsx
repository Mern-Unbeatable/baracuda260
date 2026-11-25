import { useQuery } from '@tanstack/react-query';
import React, { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import GalleryDetailView from '@/components/data-display/GalleryDetailView/GalleryDetailView';
import { getArtworkDetailsApi } from '@/shared/api/artworks.api';
import { ROUTES } from '@/shared/config';
import { mergeGalleryPhotoMeta } from '@/shared/data/galleryDetail';
import { getGalleryPhotoById } from '@/shared/data/galleryPhotos';
import { getGallerySixStoryById } from '@/shared/data/gallerySixStory';
import { getGalleryTwelveStoryById } from '@/shared/data/galleryTwelveStory';
import { useSEO } from '@/shared/hooks/useSEO';
import {
  buildZodiacStorySlides,
  collectStoryImageMedia,
} from '@/shared/utils/buildZodiacStorySlides';

const GalleryDetail = memo(({ variant: variantProp }) => {
  const { id } = useParams();

  const fallbackData = useMemo(() => {
    if (!id) return null;
    return (
      getGalleryTwelveStoryById(id) ||
      getGallerySixStoryById(id) ||
      getGalleryPhotoById(id) ||
      null
    );
  }, [id]);

  const { data: liveData } = useQuery({
    queryKey: ['artwork-detail', id],
    queryFn: () => getArtworkDetailsApi(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });

  const entry = useMemo(() => {
    const base = mergeGalleryPhotoMeta(id, fallbackData) || {};
    if (!liveData) {
      return {
        ...base,
        id: base.id || id,
        title: base.title || 'Gallery Artwork',
        description: base.description || '',
        likes: String(base.likes ?? '0'),
        views: String(base.views ?? '0'),
        votes: String(base.votes ?? '0'),
        isLiked: Boolean(base.isLiked),
        isSaved: Boolean(base.isSaved),
        competitionState: 'PROFILE_ONLY',
        isCompetition: false,
      };
    }

    const primaryImg =
      liveData.featuredImage || liveData.coverImage || base.image || '';

    const rawKind = String(
      liveData.kind || base.kind || 'SINGLE',
    ).toUpperCase();

    const imageMedia = collectStoryImageMedia(liveData.media, liveData.images);
    let slides = buildZodiacStorySlides(
      imageMedia,
      rawKind,
      liveData.theme || base.theme,
    );

    if (
      slides.length === 0 &&
      Array.isArray(base.slides) &&
      base.slides.length > 0
    ) {
      slides = base.slides;
    }

    let badge = 'Single Photo';
    if (rawKind === 'TWELVE') {
      badge = '12 photos - full Zodiac Story';
    } else if (rawKind === 'SIX') {
      badge = '6 Photos Story';
    } else if (rawKind === 'VIDEO') {
      badge = 'Video';
    }

    const resolvedCategory =
      liveData.categoryName ||
      liveData.category?.name ||
      liveData.category ||
      base.category ||
      '';

    return {
      ...base,
      ...liveData,
      id: liveData.id || id,
      title: liveData.title || base.title || 'Gallery Artwork',
      description:
        liveData.story || liveData.description || base.description || '',
      badge: liveData.badge || badge,
      category: resolvedCategory,
      categoryName: resolvedCategory,
      image: primaryImg,
      slides: slides.length > 0 ? slides : undefined,
      likes: String(liveData.likesCount ?? liveData.likes ?? base.likes ?? 0),
      views: String(liveData.viewsCount ?? liveData.views ?? base.views ?? 0),
      votes: String(liveData.votesCount ?? liveData.votes ?? base.votes ?? 0),
      isLiked: Boolean(liveData.isLiked ?? liveData.liked),
      isSaved: Boolean(liveData.isSaved ?? liveData.saved),
      photographer:
        liveData.user?.name ||
        liveData.user?.username ||
        base.photographer ||
        'Photographer',
      photographerUsername:
        liveData.user?.username || base.photographerUsername || null,
      user: liveData.user || base.user || null,
      userId: liveData.user?.id || liveData.userId || base.userId || null,
      donationAvatar:
        liveData.user?.avatar ||
        liveData.photographerAvatar ||
        liveData.avatar ||
        base.donationAvatar ||
        base.photographerAvatar ||
        null,
      awards: liveData.appreciation || liveData.awards || base.awards,
      appreciation:
        liveData.appreciation ||
        liveData.user?.appreciation ||
        base.appreciation,
      competitionState: 'PROFILE_ONLY',
      isCompetition: false,
    };
  }, [id, fallbackData, liveData]);

  // Determine variant (twelve, six, or single)
  const resolvedVariant = useMemo(() => {
    if (variantProp) return variantProp;
    const kind = String(entry?.kind || '').toUpperCase();
    if (kind === 'TWELVE') return 'twelve';
    if (kind === 'SIX') return 'six';
    if (entry?.slides?.length === 12) return 'twelve';
    if (entry?.slides?.length === 6) return 'six';
    return 'single';
  }, [variantProp, entry?.kind, entry?.slides?.length]);

  useSEO({
    title: entry.title,
    description: entry.description,
    keywords: ['gallery', entry.title, 'my12photos', 'photo details'],
  });

  return (
    <GalleryDetailView
      entry={entry}
      variant={resolvedVariant}
      activeHref={ROUTES.GALLERY}
      isCompetition={false}
    />
  );
});

GalleryDetail.displayName = 'GalleryDetail';

export default GalleryDetail;
