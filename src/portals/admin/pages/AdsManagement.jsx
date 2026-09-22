import React, { memo } from 'react';
import AdminAdsContent from '@/portals/admin/views/AdminAdsContent';
import { useSEO } from '@/shared/hooks/useSEO';

const AdsManagement = memo(() => {
  useSEO({
    title: 'Ads Management',
    description:
      'Admin ads management — review donor advertisement submissions on My12Photos.',
    keywords: ['ads', 'advertising', 'admin', 'My12Photos'],
  });

  return <AdminAdsContent />;
});

AdsManagement.displayName = 'AdsManagement';

export default AdsManagement;
