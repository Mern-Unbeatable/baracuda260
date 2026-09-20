import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminMarketingStatisticsContent from '@/portals/admin/views/AdminMarketingStatisticsContent';

const MarketingStatistics = memo(() => {
  useSEO({
    title: 'Marketing Statistics',
    description: 'Admin marketing statistics and conversion metrics.',
    keywords: ['marketing', 'statistics', 'admin', 'My12Photos'],
  });

  return <AdminMarketingStatisticsContent />;
});

MarketingStatistics.displayName = 'MarketingStatistics';

export default MarketingStatistics;
