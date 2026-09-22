import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
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

  return <MarketplaceMain />;
});

Marketplace.displayName = 'Marketplace';

export default Marketplace;
