import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useSEO } from '@/shared/hooks/useSEO';
import { selectUser } from '@/app/store/slices/authSlice';
import AdminCompetitionDetailContent from '@/modules/admin/views/AdminCompetitionDetailContent';
import CompetitionDetailsContent from '@/modules/public/views/CompetitionDetailsContent';

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
