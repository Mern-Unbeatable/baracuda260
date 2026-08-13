import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';

const MyArtwork = memo(() => {
  useSEO({
    title: 'My Artwork',
    description:
      'Manage your uploaded photography — single photos, 6-photo stories, and 12-photo zodiac albums on My12Photos.',
    keywords: ['my artwork', 'portfolio', 'competition entries', 'My12Photos'],
  });

  return <Outlet />;
});

MyArtwork.displayName = 'MyArtwork';

export default MyArtwork;
