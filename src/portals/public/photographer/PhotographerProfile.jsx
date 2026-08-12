import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import PhotographerProfileMain from './sections/PhotographerProfileMain';

const PhotographerProfile = memo(() => {
  useSEO({
    title: 'Elena Vance — Photographer Profile',
    description:
      'View Elena Vance’s nature and landscape photography, premium albums, competition entries, and announcements on My12Photos.',
    keywords: ['photographer', 'profile', 'my12photos', 'gallery', 'Elena Vance'],
  });

  return <PhotographerProfileMain />;
});

PhotographerProfile.displayName = 'PhotographerProfile';

export default PhotographerProfile;
