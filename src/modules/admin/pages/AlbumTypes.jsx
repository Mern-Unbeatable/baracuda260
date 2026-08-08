import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminAlbumTypesContent from '@/modules/admin/views/AdminAlbumTypesContent';

const AlbumTypes = memo(() => {
  useSEO({
    title: 'Album types',
    description:
      'Admin album formats — define how stories are assembled and judged across My12Photos competitions.',
    keywords: ['album types', 'formats', 'admin', 'My12Photos'],
  });

  return <AdminAlbumTypesContent />;
});

AlbumTypes.displayName = 'AlbumTypes';

export default AlbumTypes;
