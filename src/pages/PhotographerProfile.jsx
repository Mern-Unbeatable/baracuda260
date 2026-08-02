import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import PhotographerProfileContent from '../components/photographer/PhotographerProfileContent';

const PhotographerProfile = memo(() => {
  useSEO({
    title: 'Photographer Profile',
    description:
      'View photographer profile, contact details, and photo submissions on My12Photos.',
    keywords: ['photographer', 'profile', 'my12photos', 'gallery'],
  });

  return <PhotographerProfileContent />;
});

PhotographerProfile.displayName = 'PhotographerProfile';

export default PhotographerProfile;
