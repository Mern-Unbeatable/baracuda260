import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminSupportContent from '@/portals/admin/views/AdminSupportContent';

const Support = memo(() => {
  useSEO({
    title: 'Support',
    description:
      'Admin support inbox — review pending and answered community questions on My12Photos.',
    keywords: ['support', 'inbox', 'questions', 'admin', 'My12Photos'],
  });

  return <AdminSupportContent />;
});

Support.displayName = 'AdminSupport';

export default Support;
