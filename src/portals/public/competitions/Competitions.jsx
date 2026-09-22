import React, { memo } from 'react';
import GalleryMain from '@/portals/public/gallery/sections/GalleryMain';
import { ROUTES } from '@/shared/config';
import { useSEO } from '@/shared/hooks/useSEO';

const Competitions = memo(() => {
  useSEO({
    title: 'Competitions',
    description:
      'Browse the My12Photos community photo showcase — filter by album type and category.',
    keywords: [
      'competitions',
      'gallery',
      'photo showcase',
      'my12photos',
      'photography',
    ],
  });

  return <GalleryMain activeHref={ROUTES.COMPETITIONS} />;
});

Competitions.displayName = 'Competitions';

export default Competitions;
