import React, { memo } from 'react';
import MyOrdersContent from '@/portals/member/views/MyOrdersContent';
import { useSEO } from '@/shared/hooks/useSEO';

const MyOrders = memo(() => {
  useSEO({
    title: 'My Orders',
    description:
      'View your purchases and track orders across creator mini-stores on My12Photos.',
    keywords: ['my orders', 'purchases', 'tracking', 'My12Photos'],
  });

  return <MyOrdersContent />;
});

MyOrders.displayName = 'MyOrders';

export default MyOrders;
