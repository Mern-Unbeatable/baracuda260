import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import SinglePhotoContent from '../../components/singlePhoto/SinglePhotoContent';

const SinglePhoto = memo(() => {
  useSEO({
    title: 'Single Photo',
    description: 'Upload a single competition photo with zodiac sign and creative details on My12Photos.',
    keywords: ['single photo', 'upload', 'zodiac', 'My12Photos'],
  });

  return <SinglePhotoContent />;
});

SinglePhoto.displayName = 'SinglePhoto';

export default SinglePhoto;
