import React, { memo } from 'react';
import { ROUTES } from '@/shared/config';
import { GALLERY_PHOTOS, galleryDetailPath } from '@/shared/data/galleryPhotos';
import PhotoShowcasePageContent from '@/components/marketing/PhotoShowcasePageContent/PhotoShowcasePageContent';

const GalleryMain = memo(({ activeHref = ROUTES.GALLERY }) => (
  <PhotoShowcasePageContent
    photos={GALLERY_PHOTOS}
    i18nPrefix="gallery"
    activeHref={activeHref}
    rootClassName="gallery-page-root"
    getDetailPath={(photo) => galleryDetailPath(photo.id)}
  />
));

GalleryMain.displayName = 'GalleryMain';

export default GalleryMain;
