import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import AdminBusinessLinkContent from '../../components/adminBusinessLink/AdminBusinessLinkContent';

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
