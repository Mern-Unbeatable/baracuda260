import React, { memo } from 'react';
import Image from '@/components/ui/Image';

const ImgIcon = memo(({ src, size = 16, className = '', ...props }) => (
  <span
    className={`inline-flex shrink-0 overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className="h-full w-full object-contain"
      {...props}
    />
  </span>
));

ImgIcon.displayName = 'ImgIcon';

export default ImgIcon;
