import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import BuyPhotosMain from './sections/BuyPhotosMain';

const BuyPhotos = memo(() => {
  useSEO({
    title: 'Buy Photos',
    description:
      'Explore and buy premium photos from the My12Photos community — filter by album type and category.',
    keywords: ['buy photos', 'premium photos', 'my12photos', 'photography marketplace'],
  });

  return <BuyPhotosMain />;
});

BuyPhotos.displayName = 'BuyPhotos';

export default BuyPhotos;
