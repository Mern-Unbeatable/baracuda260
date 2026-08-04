import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import ProfileContent from '../../components/profile/ProfileContent';

const Profile = memo(() => {
  useSEO({
    title: 'Profile Details Editor',
    description:
      'Manage your My12Photos artistic identity and account security settings.',
    keywords: ['profile', 'account', 'password', 'My12Photos'],
  });

  return <ProfileContent />;
});

Profile.displayName = 'Profile';

export default Profile;
