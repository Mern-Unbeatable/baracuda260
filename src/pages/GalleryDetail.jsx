import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import GalleryDetailContent from '../components/gallery/GalleryDetailContent';
import { getGalleryPhotoById } from '../data/galleryPhotos';

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
