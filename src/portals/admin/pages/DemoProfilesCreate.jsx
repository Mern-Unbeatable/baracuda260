import React, { memo } from 'react';
import AdminDemoProfilesCreateContent from '@/portals/admin/views/AdminDemoProfilesCreateContent';
import { useSEO } from '@/shared/hooks/useSEO';

const DemoProfilesCreate = memo(() => {
  useSEO({
    title: 'Add Demo Profile',
    description:
      'Create a new demo photographer profile for the My12Photos admin platform.',
    keywords: ['demo profile', 'admin', 'My12Photos'],
  });

  return <AdminDemoProfilesCreateContent />;
});

DemoProfilesCreate.displayName = 'DemoProfilesCreate';

export default DemoProfilesCreate;
