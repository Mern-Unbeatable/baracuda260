import React, { memo, useState } from 'react';
import Image from '@/components/ui/Image';
import {
  getUserInitials,
  isUsableImageUrl,
} from '@/portals/admin/data/adminUsersData';

/**
 * Avatar with an initials fallback for missing or broken image URLs.
 * @param {{ src?: string | null, name?: string | null, className?: string }} props
 */
const UserAvatar = memo(({ src, name, className = '' }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = isUsableImageUrl(src) && failedSrc !== src;

  if (showImage) {
    return (
      <Image
        src={src}
        alt=""
        onError={() => setFailedSrc(src)}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#eef2ff] font-bold text-[#4048cd] ${className}`}
      aria-hidden="true"
    >
      {getUserInitials(name)}
    </span>
  );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
