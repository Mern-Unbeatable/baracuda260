import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import SixPhotoContent from '@/portals/member/views/SixPhotoContent';

const uploadHub = ROUTES.ADMIN_SELL_PHOTOS_UPLOAD;

const SellPhotosUploadSix = memo(() => {
  useSEO({
    title: '6 Photo Story — Sell',
    description: 'Upload a 6-photo zodiac story for sale on My12Photos.',
    keywords: ['6 photo story', 'sell', 'upload', 'My12Photos'],
  });

  return (
    <SixPhotoContent
      backHref={uploadHub}
      uploadAnotherHref={uploadHub}
      purpose="sell"
      defaultPrice="$5.00"
    />
  );
});

SellPhotosUploadSix.displayName = 'SellPhotosUploadSix';

export default SellPhotosUploadSix;
