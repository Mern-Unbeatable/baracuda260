import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminBusinessLinkContent from '@/portals/admin/views/AdminBusinessLinkContent';

const BusinessPhotos = memo(() => {
  useSEO({
    title: 'Business Link Photos',
    description:
      'Admin business link photos — review uploaded 12-photo albums and manage submissions on My12Photos.',
    keywords: ['business link', 'photos', 'admin', 'My12Photos'],
  });

  return <AdminBusinessLinkContent />;
});

BusinessPhotos.displayName = 'BusinessPhotos';

export default BusinessPhotos;
