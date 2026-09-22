import React, { memo } from 'react';
import AdminBusinessLinkDetailContent from '@/portals/admin/views/AdminBusinessLinkDetailContent';
import { useSEO } from '@/shared/hooks/useSEO';

const BusinessLinkDetails = memo(() => {
  useSEO({
    title: 'Business Link Details',
    description:
      'Admin business link album details — review the 12-photo zodiac submission and generated business link.',
    keywords: [
      'business link',
      'album details',
      'zodiac',
      'admin',
      'My12Photos',
    ],
  });

  return <AdminBusinessLinkDetailContent />;
});

BusinessLinkDetails.displayName = 'BusinessLinkDetails';

export default BusinessLinkDetails;
