import { useQuery } from '@tanstack/react-query';
import React, { memo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PageLoader from '@/app/router/ui/PageLoader';
import BuyPhotoDetailView from '@/components/data-display/BuyPhotoDetailView/BuyPhotoDetailView';
import {
  getPublicPremiumPhotoDetailsApi,
  PUBLIC_PREMIUM_PHOTO_DETAIL_QUERY_KEY,
} from '@/shared/api/premiumPhotos.api';
import { ROUTES } from '@/shared/config';
import { getBuyPhotoById } from '@/shared/data/buyPhotos';
import { useSEO } from '@/shared/hooks/useSEO';

const BuyPhotoDetail = memo(() => {
  const { id } = useParams();
  const staticPhoto = getBuyPhotoById(id);

  const { data: apiPhoto, isLoading } = useQuery({
    queryKey: PUBLIC_PREMIUM_PHOTO_DETAIL_QUERY_KEY(id),
    queryFn: () => getPublicPremiumPhotoDetailsApi(id),
    enabled: Boolean(id) && !staticPhoto,
    staleTime: 60 * 1000,
  });

  const photo = staticPhoto || apiPhoto;

  useSEO({
    title: photo?.title ?? 'Buy Photo',
    description: photo?.description ?? 'Purchase premium photos on My12Photos.',
    keywords: ['buy photos', photo?.title, 'my12photos', 'premium photo'],
  });

  if (isLoading && !photo) {
    return <PageLoader />;
  }

  if (!photo) {
    return <Navigate to={ROUTES.BUY_PHOTOS} replace />;
  }

  return <BuyPhotoDetailView photo={photo} />;
});

BuyPhotoDetail.displayName = 'BuyPhotoDetail';

export default BuyPhotoDetail;
