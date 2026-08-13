import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import MyMessageUploadContent from '@/portals/member/views/MyMessageUploadContent';

const MyMessageUpload = memo(() => {
  useSEO({
    title: 'Upload Message',
    description: 'Share a photographer message with photos or videos on My12Photos.',
    keywords: ['upload message', 'photographer note', 'My12Photos'],
  });

  return <MyMessageUploadContent />;
});

MyMessageUpload.displayName = 'MyMessageUpload';

export default MyMessageUpload;
