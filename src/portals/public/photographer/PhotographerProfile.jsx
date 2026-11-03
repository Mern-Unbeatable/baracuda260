import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';
import PhotographerProfileMain from './sections/PhotographerProfileMain';

const PhotographerProfile = memo(() => {
  const { username } = useParams();
  const title = username
    ? `@${username.replace(/^@/, '')} — Photographer Profile`
    : 'Photographer Profile — My12Photos';

  useSEO({
    title,
    description:
      'View photography, premium albums, competition entries, and updates on My12Photos.',
    keywords: [
      'photographer',
      'profile',
      'my12photos',
      'gallery',
      username,
    ].filter(Boolean),
  });

  return <PhotographerProfileMain />;
});

PhotographerProfile.displayName = 'PhotographerProfile';

export default PhotographerProfile;
