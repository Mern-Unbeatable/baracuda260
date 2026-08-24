import React, { memo } from 'react';
import { ROUTES } from '@/shared/config';
import { BUY_PHOTOS, buyPhotoDetailPath } from '@/shared/data/buyPhotos';
import PhotoShowcasePageContent from '@/components/marketing/PhotoShowcasePageContent/PhotoShowcasePageContent';

const BuyPhotosMain = memo(() => (
  <PhotoShowcasePageContent
    photos={BUY_PHOTOS}
    i18nPrefix="buyPhotos"
    activeHref={ROUTES.BUY_PHOTOS}
    rootClassName="buy-photos-page-root"
    getDetailPath={(photo) => buyPhotoDetailPath(photo.id)}
  />
));

BuyPhotosMain.displayName = 'BuyPhotosMain';

export default BuyPhotosMain;
