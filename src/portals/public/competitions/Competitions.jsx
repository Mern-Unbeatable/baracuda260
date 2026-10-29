import React, { memo } from 'react';
import CompetitionsMain from '@/portals/public/competitions/sections/CompetitionsMain';
import { ROUTES } from '@/shared/config';
import { useSEO } from '@/shared/hooks/useSEO';

const Competitions = memo(() => {
  useSEO({
    title: 'Competitions',
    description:
      'Browse live community photo competition entries — vote for your favorites and see real-time standings.',
    keywords: [
      'competitions',
      'in competition',
      'photo contest',
      'my12photos',
      'photography',
    ],
  });

  return <CompetitionsMain activeHref={ROUTES.COMPETITIONS} />;
});

Competitions.displayName = 'Competitions';

export default Competitions;
