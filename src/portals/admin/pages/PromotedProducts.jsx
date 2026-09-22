import React, { memo } from 'react';
import AdminPromotedProductsContent from '@/portals/admin/views/AdminPromotedProductsContent';
import { useSEO } from '@/shared/hooks/useSEO';

const PromotedProducts = memo(() => {
  useSEO({
    title: 'Promoted Products',
    description:
      'Admin promoted products — browse promoted Single Photo, 6 Photo Story, and Zodiac Story entries.',
    keywords: ['promoted products', 'promoted albums', 'admin', 'My12Photos'],
  });

  return <AdminPromotedProductsContent />;
});

PromotedProducts.displayName = 'PromotedProducts';

export default PromotedProducts;
