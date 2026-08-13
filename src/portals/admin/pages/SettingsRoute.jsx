import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/store/slices/authSlice';
import AdminSettings from '@/portals/admin/pages/AdminSettings';
import MemberSettings from '@/portals/member/pages/Settings';

const SettingsRoute = memo(() => {
  const user = useSelector(selectUser);
  if (user?.role === 'admin') return <AdminSettings />;
  return <MemberSettings />;
});

SettingsRoute.displayName = 'SettingsRoute';

export default SettingsRoute;
