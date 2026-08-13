import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminDemoProfilesContent from '@/portals/admin/views/AdminDemoProfilesContent';

const DemoProfiles = memo(() => {
  useSEO({
    title: 'Demo Profiles',
    description:
      'Admin demo profiles — create and manage demo photographer profiles on My12Photos.',
    keywords: ['demo profiles', 'admin', 'My12Photos'],
  });

  return <AdminDemoProfilesContent />;
});

DemoProfiles.displayName = 'AdminDemoProfiles';

export default DemoProfiles;
