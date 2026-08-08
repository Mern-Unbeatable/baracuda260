import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';
import GalleryDetailContent from '@/modules/public/views/GalleryDetailContent';
import { getGalleryPhotoById } from '@/shared/data/galleryPhotos';

const GalleryDetail = memo(() => {
  const { id } = useParams();
  const photo = getGalleryPhotoById(id);

  useSEO({
    title: photo.title,
    description: photo.description,
    keywords: ['gallery', photo.title, 'my12photos', 'photo details'],
  });

  return <GalleryDetailContent />;
});

GalleryDetail.displayName = 'GalleryDetail';

export default GalleryDetail;
