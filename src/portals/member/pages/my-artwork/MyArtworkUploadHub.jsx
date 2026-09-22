import React, { memo } from 'react';
import { UPLOAD_ROUTE_SETS } from '@/portals/member/data/uploadPhotosAssets';
import UploadPhotosContent from '@/portals/member/views/UploadPhotosContent';
import { useSEO } from '@/shared/hooks/useSEO';

const MyArtworkUploadHub = memo(() => {
  useSEO({
    title: 'Creative Upload Hub',
    description:
      'Select a competition tier and upload your photography on My12Photos.',
    keywords: ['upload', 'creative hub', 'competition', 'My12Photos'],
  });

  return <UploadPhotosContent routeSet={UPLOAD_ROUTE_SETS.artwork} />;
});

MyArtworkUploadHub.displayName = 'MyArtworkUploadHub';

export default MyArtworkUploadHub;
