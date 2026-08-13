import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';

const Profile = memo(() => {
  useSEO({
    title: 'Profile',
    description: 'View and manage your My12Photos public profile, artwork, messages, and portfolio.',
    keywords: ['profile', 'following', 'followers', 'account', 'My12Photos'],
  });

  return <Outlet />;
});

Profile.displayName = 'Profile';

export default Profile;
