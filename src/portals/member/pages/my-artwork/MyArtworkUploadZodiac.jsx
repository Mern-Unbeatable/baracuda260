import React, { memo } from 'react';
import Zodiac12Content from '@/portals/member/views/Zodiac12Content';
import { ROUTES } from '@/shared/config';
import { useSEO } from '@/shared/hooks/useSEO';

const uploadHub = ROUTES.USER_MY_ARTWORK_UPLOAD;

const MyArtworkUploadZodiac = memo(() => {
  useSEO({
    title: '12 Photos - Full Zodiac Story',
    description:
      'Upload a complete twelve-sign zodiac photo story on My12Photos.',
    keywords: ['zodiac', '12 photos', 'upload', 'My12Photos'],
  });

  return <Zodiac12Content backHref={uploadHub} uploadAnotherHref={uploadHub} />;
});

MyArtworkUploadZodiac.displayName = 'MyArtworkUploadZodiac';

export default MyArtworkUploadZodiac;
