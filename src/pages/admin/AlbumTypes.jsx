import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import AdminAlbumTypesContent from '../../components/adminAlbumTypes/AdminAlbumTypesContent';

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
