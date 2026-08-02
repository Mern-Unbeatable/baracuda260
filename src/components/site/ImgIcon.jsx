import React, { memo } from 'react';

const ImgIcon = memo(({ src, size = 16, className = '' }) => (
  <span
    className={`inline-flex shrink-0 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <img src={src} alt="" width={size} height={size} className="h-full w-full object-contain" />
  </span>
));

ImgIcon.displayName = 'ImgIcon';

export default ImgIcon;
