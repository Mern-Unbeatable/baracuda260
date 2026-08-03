import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import CompetitionDetailsContent from '../../components/competitionDetails/CompetitionDetailsContent';

const MyCompetitionDetails = memo(() => {
  useSEO({
    title: 'Competition Details',
    description:
      'View your My12Photos competition submission details, votes, position, and global rankings.',
    keywords: ['competition details', 'rankings', 'votes', 'My12Photos'],
  });

  return <CompetitionDetailsContent />;
});

MyCompetitionDetails.displayName = 'MyCompetitionDetails';

export default MyCompetitionDetails;
