import React, { memo } from 'react';
import OrdersContent from '@/portals/member/views/OrdersContent';
import { useSEO } from '@/shared/hooks/useSEO';

const Orders = memo(() => {
  useSEO({
    title: 'Orders',
    description:
      'View and manage orders placed for your store products on My12Photos.',
    keywords: ['orders', 'store orders', 'seller', 'My12Photos'],
  });

  return <OrdersContent />;
});

Orders.displayName = 'Orders';

export default Orders;
