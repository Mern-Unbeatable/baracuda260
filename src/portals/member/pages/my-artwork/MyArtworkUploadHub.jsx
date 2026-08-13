import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import UploadPhotosContent from '@/portals/member/views/UploadPhotosContent';
import { UPLOAD_ROUTE_SETS } from '@/portals/member/data/uploadPhotosAssets';

const MyArtworkUploadHub = memo(() => {
  useSEO({
    title: 'Creative Upload Hub',
    description: 'Select a competition tier and upload your photography on My12Photos.',
    keywords: ['upload', 'creative hub', 'competition', 'My12Photos'],
  });

  return <UploadPhotosContent routeSet={UPLOAD_ROUTE_SETS.artwork} />;
});

MyArtworkUploadHub.displayName = 'MyArtworkUploadHub';

export default MyArtworkUploadHub;
