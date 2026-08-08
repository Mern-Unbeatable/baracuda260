import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import CompetitionsContent from '@/modules/public/views/CompetitionsContent';

const Competitions = memo(() => {
  useSEO({
    title: 'Competitions',
    description:
      'Choose your album type and enter My12Photos competitions — Single Photo, 6-Photos Story, and Zodiac Story.',
    keywords: ['competitions', 'photography', 'my12photos', 'prizes'],
  });

  return <CompetitionsContent />;
});

Competitions.displayName = 'Competitions';

export default Competitions;
