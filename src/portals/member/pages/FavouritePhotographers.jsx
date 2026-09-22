import React, { memo } from 'react';
import FavouritePhotographersContent from '@/portals/member/views/FavouritePhotographersContent';
import { useSEO } from '@/shared/hooks/useSEO';

const FavouritePhotographers = memo(() => {
  useSEO({
    title: 'Favourite Photographers',
    description: 'View and manage photographers you follow on My12Photos.',
    keywords: [
      'favourite photographers',
      'following',
      'community',
      'My12Photos',
    ],
  });

  return <FavouritePhotographersContent />;
});

FavouritePhotographers.displayName = 'FavouritePhotographers';

export default FavouritePhotographers;
