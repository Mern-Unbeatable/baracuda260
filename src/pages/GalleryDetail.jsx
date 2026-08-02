import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import GalleryDetailContent from '../components/gallery/GalleryDetailContent';

const GalleryDetail = memo(() => {
  useSEO({
    title: 'Chasing the Neon Stream',
    description:
      'View gallery photo details, votes, photographer info, and community comments on My12Photos.',
    keywords: ['gallery', 'photo details', 'my12photos', 'vote', 'comments'],
  });

  return <GalleryDetailContent />;
});

GalleryDetail.displayName = 'GalleryDetail';

export default GalleryDetail;
