import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminGalleryContent from '@/portals/admin/views/AdminGalleryContent';

const Gallery = memo(() => {
  useSEO({
    title: 'Gallery',
    description:
      'Admin gallery — browse Single Photo, 6 Photo Story, and Zodiac Story entries in the public gallery.',
    keywords: ['gallery', 'photo showcase', 'admin', 'My12Photos'],
  });

  return <AdminGalleryContent />;
});

Gallery.displayName = 'Gallery';

export default Gallery;
