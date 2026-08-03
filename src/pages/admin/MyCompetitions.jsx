import React, { memo } from 'react';
import UserSectionPlaceholder from './UserSectionPlaceholder';

const MyCompetitions = memo(() => (
  <UserSectionPlaceholder titleKey="dashboard.nav.myCompetitions" />
));

MyCompetitions.displayName = 'MyCompetitions';

export default MyCompetitions;
