import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import LeaderboardMain from './sections/LeaderboardMain';

const Leaderboard = memo(() => {
  useSEO({
    title: 'Leaderboard',
    description:
      'Top photographers live standings on My12Photos — filter by album type and month.',
    keywords: ['leaderboard', 'top photographers', 'my12photos', 'votes'],
  });

  return <LeaderboardMain />;
});

Leaderboard.displayName = 'Leaderboard';

export default Leaderboard;
