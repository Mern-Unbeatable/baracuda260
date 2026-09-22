import React, { memo } from 'react';
import AdminNewsletterContent from '@/portals/admin/views/AdminNewsletterContent';
import { useSEO } from '@/shared/hooks/useSEO';

const Newsletter = memo(() => {
  useSEO({
    title: 'Newsletter',
    description:
      'Admin newsletter — manage subscribers and email campaigns on My12Photos.',
    keywords: ['newsletter', 'subscribers', 'campaigns', 'admin', 'My12Photos'],
  });

  return <AdminNewsletterContent />;
});

Newsletter.displayName = 'AdminNewsletter';

export default Newsletter;
