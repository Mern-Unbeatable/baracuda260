import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import SinglePhotoContent from '@/portals/member/views/SinglePhotoContent';

const uploadHub = ROUTES.ADMIN_SELL_PHOTOS_UPLOAD;

const SellPhotosUploadSingle = memo(() => {
  useSEO({
    title: 'Single Photo — Sell',
    description: 'Upload a single photo for sale with zodiac sign and pricing details on My12Photos.',
    keywords: ['single photo', 'sell', 'upload', 'My12Photos'],
  });

  return (
    <SinglePhotoContent
      backHref={uploadHub}
      uploadAnotherHref={uploadHub}
      purpose="sell"
      defaultPrice="$2.00"
    />
  );
});

SellPhotosUploadSingle.displayName = 'SellPhotosUploadSingle';

export default SellPhotosUploadSingle;
