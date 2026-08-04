import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useSEO } from '../../hooks/useSEO';
import { selectUser } from '../../store/slices/authSlice';
import DashboardContent from '../../components/dashboard/DashboardContent';

const Dashboard = memo(() => {
  const user = useSelector(selectUser);
  const isAdmin = user?.role === 'admin';

  useSEO(
    isAdmin
      ? {
          title: 'Overview',
          description:
            'Admin Overview — platform stats, visitor analytics, pending reviews, and community reach.',
          keywords: ['overview', 'admin', 'My12Photos', 'dashboard'],
        }
      : {
          title: 'Dashboard',
          description: 'Your My12Photos dashboard — rank, photos, votes, prizes, and competitions.',
          keywords: ['dashboard', 'My12Photos', 'competitions'],
        },
  );

  return <DashboardContent />;
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
