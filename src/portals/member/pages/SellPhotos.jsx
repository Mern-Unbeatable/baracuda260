import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';

const SellPhotos = memo(() => {
  useSEO({
    title: 'Sell Photos',
    description:
      'Manage your selling photos — list single photos, 6-photo stories, and 12-photo zodiac albums on My12Photos.',
    keywords: ['sell photos', 'marketplace', 'photography sales', 'My12Photos'],
  });

  return <Outlet />;
});

SellPhotos.displayName = 'SellPhotos';

export default SellPhotos;
