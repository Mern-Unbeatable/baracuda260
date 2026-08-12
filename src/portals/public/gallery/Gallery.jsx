import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import GalleryMain from './sections/GalleryMain';

const Gallery = memo(() => {
  useSEO({
    title: 'Gallery',
    description:
      'Browse the My12Photos community photo showcase — filter by album type and category.',
    keywords: ['gallery', 'photo showcase', 'my12photos', 'photography'],
  });

  return <GalleryMain />;
});

Gallery.displayName = 'Gallery';

export default Gallery;
