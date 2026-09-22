import React, { memo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import BuyPhotoDetailView from '@/components/data-display/BuyPhotoDetailView/BuyPhotoDetailView';
import { ROUTES } from '@/shared/config';
import { getBuyPhotoById } from '@/shared/data/buyPhotos';
import { useSEO } from '@/shared/hooks/useSEO';

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
