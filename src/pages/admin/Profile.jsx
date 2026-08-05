import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import ProfileContent from '../../components/profile/ProfileContent';

const Profile = memo(() => {
  useSEO({
    title: 'My Profile',
    description: 'Admin My Profile — manage account information and password on My12Photos.',
    keywords: ['profile', 'account', 'password', 'admin', 'My12Photos'],
  });

  return <ProfileContent />;
});

Profile.displayName = 'Profile';

export default Profile;
