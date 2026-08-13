import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminAnnouncementsContent from '@/portals/admin/views/AdminAnnouncementsContent';

const AdminSettings = memo(() => {
  useSEO({
    title: 'Ads & Announcements',
    description: 'Create and manage announcements displayed above the My12Photos website navigation.',
    keywords: ['announcements', 'ads', 'admin', 'My12Photos'],
  });

  return <AdminAnnouncementsContent />;
});

AdminSettings.displayName = 'AdminSettings';

export default AdminSettings;
