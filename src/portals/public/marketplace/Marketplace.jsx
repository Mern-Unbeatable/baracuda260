import React, { memo } from 'react';
import { ROUTES } from '@/shared/config';
import { useSEO } from '@/shared/hooks/useSEO';
import { SitePageLayout } from '@/shared/site-chrome';
import MarketplaceMain from './sections/MarketplaceMain';

const Marketplace = memo(() => {
  useSEO({
    title: 'Marketplace',
    description:
      'Search creator store products on My12Photos — prints, handmade goods, apparel, and paid store promotions.',
    keywords: [
      'marketplace',
      'store',
      'merchandise',
      'my12photos',
      'creator products',
    ],
  });

  return (
    <SitePageLayout
      activeHref={ROUTES.MARKETPLACE}
      rootClassName="marketplace-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      <MarketplaceMain />
    </SitePageLayout>
  );
});

Marketplace.displayName = 'Marketplace';

export default Marketplace;
