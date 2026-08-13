import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import Zodiac12Content from '@/portals/member/views/Zodiac12Content';

const uploadHub = ROUTES.ADMIN_SELL_PHOTOS_UPLOAD;

const SellPhotosUploadZodiac = memo(() => {
  useSEO({
    title: '12 Zodiac Story — Sell',
    description: 'Upload a full 12-photo zodiac story for sale on My12Photos.',
    keywords: ['12 zodiac', 'sell', 'upload', 'My12Photos'],
  });

  return (
    <Zodiac12Content
      backHref={uploadHub}
      uploadAnotherHref={uploadHub}
      purpose="sell"
      defaultPrice="$5.00"
    />
  );
});

SellPhotosUploadZodiac.displayName = 'SellPhotosUploadZodiac';

export default SellPhotosUploadZodiac;
