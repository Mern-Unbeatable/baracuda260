import React, { memo } from 'react';
import MyStoreContent from '@/portals/member/views/MyStoreContent';
import { useSEO } from '@/shared/hooks/useSEO';

const MyStore = memo(() => {
  useSEO({
    title: 'My Store',
    description:
      'Explore art, handmade products and creative merchandise on My12Photos.',
    keywords: ['my store', 'merchandise', 'products', 'My12Photos'],
  });

  return <MyStoreContent />;
});

MyStore.displayName = 'MyStore';

export default MyStore;
