import React, { memo } from 'react';
import { useSEO } from '../hooks/useSEO';
import LeaderboardContent from '../components/leaderboard/LeaderboardContent';

const Leaderboard = memo(() => {
  useSEO({
    title: 'Leaderboard',
    description:
      'Top photographers live standings on My12Photos — filter by album type and month.',
    keywords: ['leaderboard', 'top photographers', 'my12photos', 'votes'],
  });

  return <LeaderboardContent />;
});

Leaderboard.displayName = 'Leaderboard';

export default Leaderboard;
