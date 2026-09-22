import React, { memo } from 'react';
import PhotoShowcasePageContent from '@/components/marketing/PhotoShowcasePageContent/PhotoShowcasePageContent';
import { ROUTES } from '@/shared/config';
import { BUY_PHOTOS, buyPhotoDetailPath } from '@/shared/data/buyPhotos';

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
