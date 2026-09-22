import React, { memo } from 'react';
import AdminReportsContent from '@/portals/admin/views/AdminReportsContent';
import { useSEO } from '@/shared/hooks/useSEO';

const Reports = memo(() => {
  useSEO({
    title: 'Reports & Moderation',
    description:
      'Admin reports and moderation — review reported content and users on My12Photos.',
    keywords: ['reports', 'moderation', 'admin', 'My12Photos'],
  });

  return <AdminReportsContent />;
});

Reports.displayName = 'Reports';

export default Reports;
