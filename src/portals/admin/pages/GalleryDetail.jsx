import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminGalleryDetailContent from '@/portals/admin/views/AdminGalleryDetailContent';

const GalleryDetail = memo(() => {
  useSEO({
    title: 'Gallery Photo Details',
    description:
      'Admin gallery management — review photo details, reactions, views, and photographer info.',
    keywords: ['gallery details', 'photo details', 'admin', 'My12Photos'],
  });

  return <AdminGalleryDetailContent />;
});

GalleryDetail.displayName = 'GalleryDetail';

export default GalleryDetail;
