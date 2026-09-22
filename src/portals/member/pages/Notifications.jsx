import React, { memo } from 'react';
import NotificationsContent from '@/portals/member/views/NotificationsContent';
import { useSEO } from '@/shared/hooks/useSEO';

const Notifications = memo(() => {
  useSEO({
    title: 'Notifications',
    description:
      'View your My12Photos alerts, reviews, competition updates, and account notifications.',
    keywords: ['notifications', 'alerts', 'updates', 'My12Photos'],
  });

  return <NotificationsContent />;
});

Notifications.displayName = 'Notifications';

export default Notifications;
