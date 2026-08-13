import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminPremiumPhotosContent from '@/portals/admin/views/AdminPremiumPhotosContent';

const PremiumPhotos = memo(() => {
  useSEO({
    title: 'Premium Photos',
    description:
      'Admin premium photos — browse Single Photo, 6 Photo Story, and Zodiac Story listings for sale.',
    keywords: ['premium photos', 'marketplace', 'admin', 'My12Photos'],
  });

  return <AdminPremiumPhotosContent />;
});

PremiumPhotos.displayName = 'PremiumPhotos';

export default PremiumPhotos;
