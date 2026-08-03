import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import BusinessLinkContent from '../../components/businessLink/BusinessLinkContent';

const BusinessPhotos = memo(() => {
  useSEO({
    title: 'Business Link Photos',
    description:
      'Submit exclusive commercial-grade full zodiac portfolios for administrator brand licensing.',
    keywords: ['business link', 'zodiac portfolio', 'commercial photos', 'My12Photos'],
  });

  return <BusinessLinkContent />;
});

BusinessPhotos.displayName = 'BusinessPhotos';

export default BusinessPhotos;
