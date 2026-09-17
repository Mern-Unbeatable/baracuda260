import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import StoreCheckoutMain from './sections/StoreCheckoutMain';

const StoreCheckout = memo(() => {
  const { t } = useTranslation();

  return (
    <>
      <StoreCheckoutMain />
    </>
  );
});

StoreCheckout.displayName = 'StoreCheckout';

export default StoreCheckout;
