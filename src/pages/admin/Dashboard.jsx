import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import DashboardContent from '../../components/dashboard/DashboardContent';

const Dashboard = memo(() => {
  useSEO({
    title: 'Dashboard',
    description: 'Your My12Photos dashboard — rank, photos, votes, prizes, and competitions.',
    keywords: ['dashboard', 'My12Photos', 'competitions'],
  });

  return <DashboardContent />;
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
