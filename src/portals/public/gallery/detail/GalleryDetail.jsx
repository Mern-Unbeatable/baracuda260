import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import GalleryDetailView from '@/components/data-display/GalleryDetailView/GalleryDetailView';
import { mergeGalleryPhotoMeta } from '@/shared/data/galleryDetail';
import { getGalleryPhotoById } from '@/shared/data/galleryPhotos';
import { useSEO } from '@/shared/hooks/useSEO';

const GalleryDetail = memo(() => {
  const { id } = useParams();
  const photo = getGalleryPhotoById(id);

  useSEO({
    title: photo.title,
    description: photo.description,
    keywords: ['gallery', photo.title, 'my12photos', 'photo details'],
  });

  return (
    <GalleryDetailView
      entry={mergeGalleryPhotoMeta(id, photo)}
      variant="single"
    />
  );
});

GalleryDetail.displayName = 'GalleryDetail';

export default GalleryDetail;
