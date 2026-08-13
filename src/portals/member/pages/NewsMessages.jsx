import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';

const NewsMessages = memo(() => {
  useSEO({
    title: 'My Message',
    description: 'Manage your photographer messages and showcase updates on My12Photos.',
    keywords: ['messages', 'news', 'photographer notes', 'My12Photos'],
  });

  return <Outlet />;
});

NewsMessages.displayName = 'NewsMessages';

export default NewsMessages;
