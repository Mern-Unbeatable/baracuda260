import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import PhotographerProfileMain from './sections/PhotographerProfileMain';

const PhotographerProfile = memo(() => {
  useSEO({
    title: 'Photographer Profile',
    description:
      'View photographer profile, contact details, and photo submissions on My12Photos.',
    keywords: ['photographer', 'profile', 'my12photos', 'gallery'],
  });

  return <PhotographerProfileMain />;
});

PhotographerProfile.displayName = 'PhotographerProfile';

export default PhotographerProfile;
