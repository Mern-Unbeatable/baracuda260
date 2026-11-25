import React, { memo } from 'react';
import AdminSubmissionsContent from '@/portals/admin/views/AdminSubmissionsContent';
import { useSEO } from '@/shared/hooks/useSEO';

const Submissions = memo(() => {
  useSEO({
    title: 'Submission review',
    description:
      'Admin submission review — approve or reject pending competition entries on My12Photos.',
    keywords: ['submissions', 'moderation', 'pending', 'admin', 'My12Photos'],
  });

  return <AdminSubmissionsContent />;
});

Submissions.displayName = 'Submissions';

export default Submissions;
