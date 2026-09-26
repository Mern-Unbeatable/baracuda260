import React, { memo } from 'react';
import ProfileContent from '@/portals/member/views/ProfileContent';
import { useSEO } from '@/shared/hooks/useSEO';

const AdminProfile = memo(() => {
  useSEO({
    title: 'My Profile',
    description:
      'Manage your My12Photos admin account information and password.',
    keywords: ['profile', 'account', 'password', 'admin', 'My12Photos'],
  });

  return <ProfileContent />;
});

AdminProfile.displayName = 'AdminProfile';

export default AdminProfile;
