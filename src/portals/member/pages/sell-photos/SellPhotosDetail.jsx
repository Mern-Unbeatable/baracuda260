import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import MemberSellPhotoDetailContent from '@/portals/member/views/MemberSellPhotoDetailContent';

const SellPhotosDetail = memo(() => {
  useSEO({
    title: 'Selling Photo Details',
    description: 'View your selling photo details, pricing, specs, and sales stats on My12Photos.',
    keywords: ['sell photos', 'photo details', 'pricing', 'My12Photos'],
  });

  return <MemberSellPhotoDetailContent />;
});

SellPhotosDetail.displayName = 'SellPhotosDetail';

export default SellPhotosDetail;
