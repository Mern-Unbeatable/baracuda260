import React, { memo } from 'react';
import UserSectionPlaceholder from './UserSectionPlaceholder';

const Profile = memo(() => <UserSectionPlaceholder titleKey="dashboard.nav.profile" />);

Profile.displayName = 'Profile';

export default Profile;
