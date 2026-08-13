import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import { selectUser } from '@/app/store/slices/authSlice';
import AdminCompetitionDetailContent from '@/portals/admin/views/AdminCompetitionDetailContent';
// import CompetitionDetailsContent from '@/portals/public/competition-details/CompetitionDetailsContent';

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

  if (!isAdmin) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return <AdminCompetitionDetailContent />;
});

MyCompetitionDetails.displayName = 'MyCompetitionDetails';

export default MyCompetitionDetails;
