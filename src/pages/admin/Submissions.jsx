import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import AdminSubmissionsContent from '../../components/adminSubmissions/AdminSubmissionsContent';

const Submissions = memo(() => {
  useSEO({
    title: 'Submission review',
    description:
      'Admin moderation — review, request changes, or publish photographs before they reach the public gallery.',
    keywords: ['submissions', 'moderation', 'review', 'admin', 'My12Photos'],
  });

  return <AdminSubmissionsContent />;
});

Submissions.displayName = 'Submissions';

export default Submissions;
