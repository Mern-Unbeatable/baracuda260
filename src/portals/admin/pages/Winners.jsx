import React, { memo } from 'react';
import AdminWinnersContent from '@/portals/admin/views/AdminWinnersContent';
import { useSEO } from '@/shared/hooks/useSEO';

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
