import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import { selectUser } from '@/app/store/slices/authSlice';
import AdminCompetitionsContent from '@/portals/admin/views/AdminCompetitionsContent';
// import MyCompetitionsContent from '@/portals/member/views/MyCompetitionsContent';

const MyCompetitions = memo(() => {
  const user = useSelector(selectUser);
  const isAdmin = user?.role === 'admin';

  useSEO(
    isAdmin
      ? {
          title: 'Competitions',
          description:
            'Admin Photo Showcase — browse Single Photo, 6 Photo Story, and Zodiac Story submissions.',
          keywords: ['competitions', 'photo showcase', 'admin', 'My12Photos'],
        }
      : {
          title: 'My Competitions',
          description:
            'Track your My12Photos competition submissions, live voting results, and photography entries.',
          keywords: ['my competitions', 'submissions', 'voting', 'My12Photos'],
        },
  );

  if (!isAdmin) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  return <AdminCompetitionsContent />;
});

MyCompetitions.displayName = 'MyCompetitions';

export default MyCompetitions;
