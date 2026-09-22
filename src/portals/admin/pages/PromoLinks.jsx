import React, { memo } from 'react';
import AdminPromoLinksContent from '@/portals/admin/views/AdminPromoLinksContent';
import { useSEO } from '@/shared/hooks/useSEO';

const PromoLinks = memo(() => {
  useSEO({
    title: 'Promo Link Management',
    description:
      'Admin promo links — generate and track one-time promotional links for new participants on My12Photos.',
    keywords: ['promo links', 'promotional links', 'admin', 'My12Photos'],
  });

  return <AdminPromoLinksContent />;
});

PromoLinks.displayName = 'AdminPromoLinks';

export default PromoLinks;
