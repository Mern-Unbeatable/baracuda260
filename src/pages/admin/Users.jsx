import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import AdminUsersContent from '../../components/adminUsers/AdminUsersContent';

const Users = memo(() => {
  useSEO({
    title: 'Users Management',
    description: 'Admin community tools — manage registered My12Photos users and account status.',
    keywords: ['users', 'community', 'admin', 'My12Photos'],
  });

  return <AdminUsersContent />;
});

Users.displayName = 'Users';

export default Users;
