import React, { memo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import { getWinnerById } from '@/modules/public/winners/data/winnersArchive';
import WinnerDetailMain from '@/modules/public/winners/sections/WinnerDetailMain';

const WinnerDetail = memo(() => {
  const { id } = useParams();
  const winner = getWinnerById(id);

  useSEO({
    title: winner?.title ?? 'Winner',
    description: winner
      ? `${winner.title} — My12Photos winners archive entry.`
      : 'My12Photos winners archive.',
    keywords: ['winners', 'archive', 'my12photos', winner?.title].filter(Boolean),
  });

  if (!winner) {
    return <Navigate to={ROUTES.WINNERS} replace />;
  }

  return <WinnerDetailMain winner={winner} />;
});

WinnerDetail.displayName = 'WinnerDetail';

export default WinnerDetail;
