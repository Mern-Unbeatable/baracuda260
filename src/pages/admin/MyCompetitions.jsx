import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import MyCompetitionsContent from '../../components/myCompetitions/MyCompetitionsContent';

const MyCompetitions = memo(() => {
  useSEO({
    title: 'My Competitions',
    description:
      'Track your My12Photos competition submissions, live voting results, and photography entries.',
    keywords: ['my competitions', 'submissions', 'voting', 'My12Photos'],
  });

  return <MyCompetitionsContent />;
});

MyCompetitions.displayName = 'MyCompetitions';

export default MyCompetitions;
