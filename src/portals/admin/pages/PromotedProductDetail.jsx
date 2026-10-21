import React, { memo } from 'react';
import AdminPromotedProductDetailContent from '@/portals/admin/views/AdminPromotedProductDetailContent';
import { useSEO } from '@/shared/hooks/useSEO';

const PromotedProductDetail = memo(() => {
  useSEO({
    title: 'Promoted Product Details',
    description:
      'Admin promoted product management — view promotion details, promoter information, and media.',
    keywords: ['promoted product details', 'admin', 'My12Photos'],
  });

  return <AdminPromotedProductDetailContent />;
});

PromotedProductDetail.displayName = 'PromotedProductDetail';

export default PromotedProductDetail;
