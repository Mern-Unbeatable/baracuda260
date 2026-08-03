import React, { memo } from 'react';
import UserSectionPlaceholder from './UserSectionPlaceholder';

const BusinessPhotos = memo(() => (
  <UserSectionPlaceholder titleKey="dashboard.nav.businessPhotos" />
));

BusinessPhotos.displayName = 'BusinessPhotos';

export default BusinessPhotos;
