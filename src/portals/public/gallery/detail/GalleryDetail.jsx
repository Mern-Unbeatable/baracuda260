import React, { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import GalleryDetailView from '@/components/data-display/GalleryDetailView/GalleryDetailView';
import { mergeGalleryPhotoMeta } from '@/shared/data/galleryDetail';
import { getGalleryPhotoById } from '@/shared/data/galleryPhotos';
import { getArtworkDetailsApi } from '@/shared/api/artworks.api';
import { useSEO } from '@/shared/hooks/useSEO';

const GalleryDetail = memo(() => {
  const { id } = useParams();
  const fallbackPhoto = getGalleryPhotoById(id);

  const { data: liveData } = useQuery({
    queryKey: ['artwork-detail', id],
    queryFn: () => getArtworkDetailsApi(id),
    enabled: Boolean(id),
  });

  const entry = useMemo(() => {
    const base = mergeGalleryPhotoMeta(id, fallbackPhoto);
    if (!liveData) return base;

    const primaryImg =
      liveData.featuredImage ||
      liveData.coverImage ||
      base.image;

    return {
      ...base,
      ...liveData,
      id: liveData.id || id,
      title: liveData.title || base.title,
      description:
        liveData.story || liveData.description || base.description,
      image: primaryImg,
      likes: String(
        liveData.likesCount ?? liveData.likes ?? base.likes ?? 0,
      ),
      isLiked: Boolean(liveData.isLiked ?? liveData.liked),
      isSaved: Boolean(liveData.isSaved ?? liveData.saved),
      views: String(
        liveData.viewsCount ?? liveData.views ?? base.views ?? 0,
      ),
      votes: String(
        liveData.votesCount ?? liveData.votes ?? base.votes ?? 0,
      ),
    };
  }, [id, fallbackPhoto, liveData]);

  useSEO({
    title: entry.title,
    description: entry.description,
    keywords: ['gallery', entry.title, 'my12photos', 'photo details'],
  });

  return <GalleryDetailView entry={entry} variant="single" />;
});

GalleryDetail.displayName = 'GalleryDetail';

export default GalleryDetail;
