import React, { memo } from 'react';
import MyStoreUploadContent from '@/portals/member/views/MyStoreUploadContent';
import { useSEO } from '@/shared/hooks/useSEO';

const MyStoreUpload = memo(() => {
  useSEO({
    title: 'Upload Store',
    description: 'Upload a new store product to your My12Photos shop.',
    keywords: ['upload store', 'product', 'merchandise', 'My12Photos'],
  });

  return <MyStoreUploadContent />;
});

MyStoreUpload.displayName = 'MyStoreUpload';

export default MyStoreUpload;
