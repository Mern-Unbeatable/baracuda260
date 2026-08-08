import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import GalleryContent from '@/modules/public/views/GalleryContent';

const Gallery = memo(() => {
  useSEO({
    title: 'Gallery',
    description:
      'Browse the My12Photos community photo showcase — filter by album type and category.',
    keywords: ['gallery', 'photo showcase', 'my12photos', 'photography'],
  });

  return <GalleryContent />;
});

Gallery.displayName = 'Gallery';

export default Gallery;
