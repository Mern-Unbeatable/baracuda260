import React, { memo } from 'react';
import PurchasePhotosContent from '@/portals/member/views/PurchasePhotosContent';
import { useSEO } from '@/shared/hooks/useSEO';

const PurchasePhotos = memo(() => {
  useSEO({
    title: 'My Purchase',
    description:
      'View and manage all the photos you have purchased on My12Photos.',
    keywords: ['purchase', 'downloads', 'My12Photos'],
  });

  return <PurchasePhotosContent />;
});

PurchasePhotos.displayName = 'PurchasePhotos';

export default PurchasePhotos;
