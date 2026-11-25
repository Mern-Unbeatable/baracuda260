import { useQuery } from '@tanstack/react-query';
import React, { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import GalleryDetailView from '@/components/data-display/GalleryDetailView/GalleryDetailView';
import { COMPETITION_DETAILS } from '@/portals/public/competition-details/data/competitionDetailsAssets';
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
import CompetitionDetailBreadcrumb from './CompetitionDetailBreadcrumb';

const CompetitionDetail = memo(({ variant: variantProp }) => {
  const { id } = useParams();

  const fallbackData = useMemo(() => {
    if (!id) return null;
    return (
      COMPETITION_DETAILS[id] ||
      getGallerySixStoryById(id) ||
      getGalleryTwelveStoryById(id) ||
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
        title: base.title || 'Competition Photo',
        description: base.description || '',
        votes: String(base.votes ?? '0'),
        views: String(base.views ?? '0'),
        likes: String(base.likes ?? '0'),
        isVoted: Boolean(base.isVoted),
        isLiked: Boolean(base.isLiked),
        isSaved: Boolean(base.isSaved),
        competitionState: 'IN_COMPETITION',
        isCompetition: true,
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

    return {
      ...base,
      ...liveData,
      id: liveData.id || id,
      title: liveData.title || base.title || 'Competition Photo',
      description:
        liveData.story || liveData.description || base.description || '',
      image: primaryImg,
      slides: slides.length > 0 ? slides : undefined,
      votes: String(liveData.votesCount ?? liveData.votes ?? base.votes ?? 0),
      likes: String(liveData.likesCount ?? liveData.likes ?? base.likes ?? 0),
      isVoted: Boolean(liveData.isVoted ?? liveData.voted),
      isLiked: Boolean(liveData.isLiked ?? liveData.liked),
      isSaved: Boolean(liveData.isSaved ?? liveData.saved),
      views: String(liveData.viewsCount ?? liveData.views ?? base.views ?? 0),
      photographer:
        liveData.user?.name ||
        liveData.user?.username ||
        base.photographer ||
        'Photographer',
      photographerUsername:
        liveData.user?.username ||
        base.photographerUsername ||
        base.username ||
        null,
      user: liveData.user || base.user || null,
      userId: liveData.user?.id || liveData.userId || base.userId || null,
      awards: liveData.appreciation || liveData.awards || base.awards,
      appreciation:
        liveData.appreciation ||
        liveData.user?.appreciation ||
        base.appreciation,
      competitionState: 'IN_COMPETITION',
      isCompetition: true,
    };
  }, [id, fallbackData, liveData]);

  // Determine variant (six, twelve, or single)
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
    title: `${entry.title} — Competition Entry`,
    description: entry.description,
    keywords: [
      'competition',
      'photo contest',
      entry.title,
      'my12photos',
      'vote',
    ],
  });

  return (
    <GalleryDetailView
      entry={entry}
      variant={resolvedVariant}
      activeHref={ROUTES.COMPETITIONS}
      Breadcrumb={CompetitionDetailBreadcrumb}
      isCompetition={true}
    />
  );
});

CompetitionDetail.displayName = 'CompetitionDetail';

export default CompetitionDetail;
