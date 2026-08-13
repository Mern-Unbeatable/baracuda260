import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminDemoProfilesCreateContent from '@/portals/admin/views/AdminDemoProfilesCreateContent';

const DemoProfilesCreate = memo(() => {
  useSEO({
    title: 'Add Demo Profile',
    description: 'Create a new demo photographer profile for the My12Photos admin platform.',
    keywords: ['demo profile', 'admin', 'My12Photos'],
  });

  return <AdminDemoProfilesCreateContent />;
});

DemoProfilesCreate.displayName = 'DemoProfilesCreate';

export default DemoProfilesCreate;
