import React, { memo } from 'react';
import MyStoreDetailContent from '@/portals/member/views/MyStoreDetailContent';
import { useSEO } from '@/shared/hooks/useSEO';

const MyStoreDetail = memo(() => {
  useSEO({
    title: 'Store Product Details',
    description:
      'View your My Store product details, pricing, and listing info on My12Photos.',
    keywords: ['my store', 'product details', 'merchandise', 'My12Photos'],
  });

  return <MyStoreDetailContent />;
});

MyStoreDetail.displayName = 'MyStoreDetail';

export default MyStoreDetail;
