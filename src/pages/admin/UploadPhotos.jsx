import React, { memo } from 'react';
import UserSectionPlaceholder from './UserSectionPlaceholder';

const UploadPhotos = memo(() => (
  <UserSectionPlaceholder titleKey="dashboard.nav.uploadPhotos" />
));

UploadPhotos.displayName = 'UploadPhotos';

export default UploadPhotos;
