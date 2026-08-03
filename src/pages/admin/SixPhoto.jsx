import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import SixPhotoContent from '../../components/sixPhoto/SixPhotoContent';

const SixPhoto = memo(() => {
  useSEO({
    title: '6 Photo Story',
    description:
      'Upload a 6-photo spring/summer or autumn/winter zodiac story for My12Photos competitions.',
    keywords: ['6 photo', 'photo story', 'upload', 'zodiac', 'My12Photos'],
  });

  return <SixPhotoContent />;
});

SixPhoto.displayName = 'SixPhoto';

export default SixPhoto;
