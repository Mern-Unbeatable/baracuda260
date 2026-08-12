import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import BuyPhotosCheckoutMain from './sections/BuyPhotosCheckoutMain';

const BuyPhotosCheckout = memo(() => {
  useSEO({
    title: 'Checkout',
    description: 'Complete your premium photo purchase on My12Photos.',
    keywords: ['checkout', 'buy photos', 'my12photos', 'paypal'],
  });

  return <BuyPhotosCheckoutMain />;
});

BuyPhotosCheckout.displayName = 'BuyPhotosCheckout';

export default BuyPhotosCheckout;
