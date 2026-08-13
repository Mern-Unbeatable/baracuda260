import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import SinglePhotoContent from '@/portals/member/views/SinglePhotoContent';

const uploadHub = ROUTES.ADMIN_MY_ARTWORK_UPLOAD;

const MyArtworkUploadSingle = memo(() => {
  useSEO({
    title: 'Single Photo',
    description: 'Upload a single competition photo with zodiac sign and creative details on My12Photos.',
    keywords: ['single photo', 'upload', 'zodiac', 'My12Photos'],
  });

  return <SinglePhotoContent backHref={uploadHub} uploadAnotherHref={uploadHub} />;
});

MyArtworkUploadSingle.displayName = 'MyArtworkUploadSingle';

export default MyArtworkUploadSingle;
