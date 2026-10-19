import React, { memo } from 'react';
import FavouritePhotosContent from '@/portals/member/views/FavouritePhotosContent';
import { useSEO } from '@/shared/hooks/useSEO';

const FavouritePhotos = memo(() => {
  useSEO({
    title: 'Favourite Photos',
    description: 'Browse your saved and favourite photography collection.',
    keywords: [
      'favourite photos',
      'saved photos',
      'member collection',
      'My12Photos',
    ],
  });

  return <FavouritePhotosContent />;
});

FavouritePhotos.displayName = 'FavouritePhotos';

export default FavouritePhotos;
