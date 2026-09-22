import React, { memo } from 'react';
import StoreCheckoutMain from './sections/StoreCheckoutMain';

const StoreCheckout = memo(() => {
  return (
    <>
      <StoreCheckoutMain />
    </>
  );
});

StoreCheckout.displayName = 'StoreCheckout';

export default StoreCheckout;
