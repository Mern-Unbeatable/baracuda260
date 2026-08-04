import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import AdminComingSoonContent from '../../components/adminOverview/AdminComingSoonContent';

const AdminComingSoon = memo(() => {
  useSEO({
    title: 'Coming soon',
    description: 'This admin section is coming soon on My12Photos.',
    keywords: ['admin', 'coming soon', 'My12Photos'],
  });

  return <AdminComingSoonContent />;
});

AdminComingSoon.displayName = 'AdminComingSoon';

export default AdminComingSoon;
