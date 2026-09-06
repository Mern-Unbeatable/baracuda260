import React, { memo } from 'react';
import PhotoAiBadgeOverlay from '@/components/data-display/PhotoAiBadgeOverlay/PhotoAiBadgeOverlay';

const UploadedPhotoPreview = memo(({
  src,
  alt = '',
  imageClassName = 'h-24 w-full object-cover',
  frameClassName = 'relative w-full overflow-hidden rounded-lg border border-black/10',
  showAiBadge = false,
  badgeSize = 'sm',
  children,
}) => (
  <div className={frameClassName}>
    <img src={src} alt={alt} className={imageClassName} />
    <PhotoAiBadgeOverlay show={showAiBadge} placement="preview-start" size={badgeSize} />
    {children}
  </div>
));

UploadedPhotoPreview.displayName = 'UploadedPhotoPreview';

export default UploadedPhotoPreview;
