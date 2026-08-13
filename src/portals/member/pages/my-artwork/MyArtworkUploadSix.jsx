import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import SixPhotoContent from '@/portals/member/views/SixPhotoContent';

const uploadHub = ROUTES.ADMIN_MY_ARTWORK_UPLOAD;

const MyArtworkUploadSix = memo(() => {
  useSEO({
    title: '6-Photos Story',
    description: 'Upload a six-photo visual story for competition on My12Photos.',
    keywords: ['6 photos', 'story', 'upload', 'My12Photos'],
  });

  return <SixPhotoContent backHref={uploadHub} uploadAnotherHref={uploadHub} />;
});

MyArtworkUploadSix.displayName = 'MyArtworkUploadSix';

export default MyArtworkUploadSix;
