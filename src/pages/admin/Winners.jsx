import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import AdminWinnersContent from '../../components/adminWinners/AdminWinnersContent';

const Winners = memo(() => {
  useSEO({
    title: 'Winners',
    description:
      'Admin winners standings — top photographers and live rankings across My12Photos album formats.',
    keywords: ['winners', 'standings', 'admin', 'My12Photos'],
  });

  return <AdminWinnersContent />;
});

Winners.displayName = 'AdminWinners';

export default Winners;
