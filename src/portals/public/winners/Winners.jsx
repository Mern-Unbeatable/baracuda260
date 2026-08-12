import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import WinnersMain from './sections/WinnersMain';

const Winners = memo(() => {
  useSEO({
    title: 'Winners',
    description:
      'Complete My12Photos winners archive — past themes, places, and winning statistics.',
    keywords: ['winners', 'archive', 'my12photos', 'photography competition'],
  });

  return <WinnersMain />;
});

Winners.displayName = 'Winners';

export default Winners;
