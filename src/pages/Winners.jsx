import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import WinnersContent from '../components/winners/WinnersContent';

const Winners = memo(() => {
  useSEO({
    title: 'Winners',
    description:
      'Complete My12Photos winners archive — past themes, places, and winning statistics.',
    keywords: ['winners', 'archive', 'my12photos', 'photography competition'],
  });

  return <WinnersContent />;
});

Winners.displayName = 'Winners';

export default Winners;
