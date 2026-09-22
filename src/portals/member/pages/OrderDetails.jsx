import React, { memo } from 'react';
import OrderDetailsContent from '@/portals/member/views/OrderDetailsContent';
import { useSEO } from '@/shared/hooks/useSEO';

const OrderDetails = memo(() => {
  useSEO({
    title: 'Order Details',
    description:
      'Track order progress, payment, and shipping details on My12Photos.',
    keywords: ['order details', 'tracking', 'shipping', 'My12Photos'],
  });

  return <OrderDetailsContent />;
});

OrderDetails.displayName = 'OrderDetails';

export default OrderDetails;
