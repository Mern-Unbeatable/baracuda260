import React, { memo } from 'react';
import AdminAnnouncementsContent from '@/portals/admin/views/AdminAnnouncementsContent';
import { useSEO } from '@/shared/hooks/useSEO';

const Announcements = memo(() => {
  useSEO({
    title: 'Announcements',
    description:
      'Create and manage announcements displayed above the My12Photos website navigation.',
    keywords: ['announcements', 'admin', 'My12Photos'],
  });

  return <AdminAnnouncementsContent />;
});

Announcements.displayName = 'AdminAnnouncements';

export default Announcements;
