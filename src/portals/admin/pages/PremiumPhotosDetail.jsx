import React, { memo } from 'react';
import AdminPremiumPhotosDetailContent from '@/portals/admin/views/AdminPremiumPhotosDetailContent';
import { useSEO } from '@/shared/hooks/useSEO';

const PremiumPhotosDetail = memo(() => {
  useSEO({
    title: 'Premium Photo Details',
    description:
      'Admin premium photo management — review pricing, specs, sales stats, and photographer info.',
    keywords: ['premium photo details', 'admin', 'My12Photos'],
  });

  return <AdminPremiumPhotosDetailContent />;
});

PremiumPhotosDetail.displayName = 'PremiumPhotosDetail';

export default PremiumPhotosDetail;
