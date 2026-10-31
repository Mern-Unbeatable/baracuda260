import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
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

  return <Outlet />;
});

FavouritePhotos.displayName = 'FavouritePhotos';

export default FavouritePhotos;
