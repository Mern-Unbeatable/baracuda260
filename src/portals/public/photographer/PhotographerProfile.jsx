import React, { memo } from 'react';
import PhotographerProfileMain from './sections/PhotographerProfileMain';

const PhotographerProfile = memo(() => {
  // SEO title is set in PhotographerProfileMain once the display name loads.
  return <PhotographerProfileMain />;
});

PhotographerProfile.displayName = 'PhotographerProfile';

export default PhotographerProfile;
