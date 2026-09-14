import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import SellerOrderDetailsContent from '@/portals/member/views/SellerOrderDetailsContent';

const SellerOrderDetails = memo(() => {
  useSEO({
    title: 'Order Details',
    description: 'Manage fulfillment, earnings, and status for a store order on My12Photos.',
    keywords: ['order details', 'seller', 'fulfillment', 'My12Photos'],
  });

  return <SellerOrderDetailsContent />;
});

SellerOrderDetails.displayName = 'SellerOrderDetails';

export default SellerOrderDetails;
