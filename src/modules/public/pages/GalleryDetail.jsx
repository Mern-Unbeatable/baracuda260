import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';
import GalleryDetailView from '@/modules/public/views/GalleryDetailView';
import { getGalleryPhotoById } from '@/shared/data/galleryPhotos';

const GalleryDetail = memo(() => {
  const { id } = useParams();
  const photo = getGalleryPhotoById(id);

  useSEO({
    title: photo.title,
    description: photo.description,
    keywords: ['gallery', photo.title, 'my12photos', 'photo details'],
  });

  return <GalleryDetailView entry={photo} variant="single" />;
});

GalleryDetail.displayName = 'GalleryDetail';

export default GalleryDetail;
