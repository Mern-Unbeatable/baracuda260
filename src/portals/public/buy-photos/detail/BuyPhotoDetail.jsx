import React, { memo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';
import { ROUTES } from '@/shared/config';
import { getBuyPhotoById } from '@/shared/data/buyPhotos';
import BuyPhotoDetailView from '@/portals/public/buy-photos/detail/BuyPhotoDetailView';

const BuyPhotoDetail = memo(() => {
  const { id } = useParams();
  const photo = getBuyPhotoById(id);

  useSEO({
    title: photo?.title ?? 'Buy Photo',
    description: photo?.description ?? 'Purchase premium photos on My12Photos.',
    keywords: ['buy photos', photo?.title, 'my12photos', 'premium photo'],
  });

  if (!photo) {
    return <Navigate to={ROUTES.BUY_PHOTOS} replace />;
  }

  return <BuyPhotoDetailView photo={photo} />;
});

BuyPhotoDetail.displayName = 'BuyPhotoDetail';

export default BuyPhotoDetail;
