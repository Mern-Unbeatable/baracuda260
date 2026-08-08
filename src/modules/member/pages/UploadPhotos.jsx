import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import UploadPhotosContent from '@/modules/member/views/UploadPhotosContent';

const UploadPhotos = memo(() => {
  useSEO({
    title: 'Upload Photos',
    description:
      'Choose a competition tier and upload your photos to My12Photos — Single Photo, 6-Photo Story, or Full Zodiac Story.',
    keywords: ['upload photos', 'competition', 'My12Photos'],
  });

  return <UploadPhotosContent />;
});

UploadPhotos.displayName = 'UploadPhotos';

export default UploadPhotos;
