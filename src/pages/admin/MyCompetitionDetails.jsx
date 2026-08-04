import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useSEO } from '../../hooks/useSEO';
import { selectUser } from '../../store/slices/authSlice';
import AdminCompetitionDetailContent from '../../components/adminCompetitionDetail/AdminCompetitionDetailContent';
import CompetitionDetailsContent from '../../components/competitionDetails/CompetitionDetailsContent';

const MyCompetitionDetails = memo(() => {
  const user = useSelector(selectUser);
  const isAdmin = user?.role === 'admin';

  useSEO(
    isAdmin
      ? {
          title: 'Competition Photo Details',
          description:
            'Admin competition management — review photo details, votes, views, and photographer info.',
          keywords: ['competition details', 'photo details', 'admin', 'My12Photos'],
        }
      : {
          title: 'Competition Details',
          description:
            'View your My12Photos competition submission details, votes, position, and global rankings.',
          keywords: ['competition details', 'rankings', 'votes', 'My12Photos'],
        },
  );

  return isAdmin ? <AdminCompetitionDetailContent /> : <CompetitionDetailsContent />;
});

MyCompetitionDetails.displayName = 'MyCompetitionDetails';

export default MyCompetitionDetails;
