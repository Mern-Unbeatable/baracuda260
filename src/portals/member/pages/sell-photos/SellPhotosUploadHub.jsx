import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import UploadPhotosContent from '@/portals/member/views/UploadPhotosContent';
import { UPLOAD_ROUTE_SETS } from '@/portals/member/data/uploadPhotosAssets';

const SellPhotosUploadHub = memo(() => {
  useSEO({
    title: 'Upload Selling Photos',
    description: 'Choose a format to upload photos for sale on My12Photos.',
    keywords: ['sell photos', 'upload', 'My12Photos'],
  });

  return <UploadPhotosContent routeSet={UPLOAD_ROUTE_SETS.sell} />;
});

SellPhotosUploadHub.displayName = 'SellPhotosUploadHub';

export default SellPhotosUploadHub;
