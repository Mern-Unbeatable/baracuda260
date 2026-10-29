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

const ZODIAC_ICONS = {
  ARIES: '/assets/home/icon-aries.svg',
  TAURUS: '/assets/home/icon-taurus.svg',
  GEMINI: '/assets/home/icon-gemini.svg',
  CANCER: '/assets/home/icon-cancer.svg',
  LEO: '/assets/home/icon-leo.svg',
  VIRGO: '/assets/home/icon-virgo.svg',
  LIBRA: '/assets/home/icon-libra.svg',
  SCORPIO: '/assets/home/icon-scorpio.svg',
  SAGITTARIUS: '/assets/home/icon-sagittarius.svg',
  CAPRICORN: '/assets/home/icon-capricorn.svg',
  AQUARIUS: '/assets/home/icon-aquarius.svg',
  PISCES: '/assets/home/icon-pisces.svg',
};

const formatSignName = (sign) => {
  if (!sign) return '';
  const s = String(sign);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

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

    // Normalize multi-photo story slides if 6 or 12 photo story
    let slides = [];
    if (Array.isArray(liveData.media) && liveData.media.length > 0) {
      const imageMedia = liveData.media
        .filter((m) => m.kind !== 'VIDEO')
        .sort((a, b) => (a.slotIndex ?? 0) - (b.slotIndex ?? 0));

      slides = imageMedia.map((med, idx) => {
        const sign = med.zodiacSign || liveData.zodiacSign;
        const num = (med.slotIndex != null ? med.slotIndex : idx) + 1;
        return {
          id: med.id || `media-${idx}`,
          number: num,
          sign: sign ? formatSignName(sign) : `Photo ${num}`,
          thumb: med.thumbnailUrl || med.url,
          hero: med.url,
          theme: idx % 2 === 0 ? 'red' : 'blue',
          icon: ZODIAC_ICONS[String(sign).toUpperCase()] || null,
        };
      });
    } else if (liveData.images && typeof liveData.images === 'object') {
      const entries = Object.entries(liveData.images);
      entries.sort(([, a], [, b]) => (a?.slotIndex ?? 0) - (b?.slotIndex ?? 0));
      slides = entries.map(([key, img], idx) => {
        const sign = img.zodiacSign || liveData.zodiacSign;
        const num = (img.slotIndex != null ? img.slotIndex : idx) + 1;
        return {
          id: img.id || `${key}-${idx}`,
          number: num,
          sign: sign ? formatSignName(sign) : key || `Photo ${num}`,
          thumb: img.thumbnailUrl || img.url,
          hero: img.url,
          theme: idx % 2 === 0 ? 'red' : 'blue',
          icon: ZODIAC_ICONS[String(sign).toUpperCase()] || null,
        };
      });
    }

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
