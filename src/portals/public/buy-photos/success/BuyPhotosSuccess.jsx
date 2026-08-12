import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import BuyPhotosSuccessMain from './sections/BuyPhotosSuccessMain';

const BuyPhotosSuccess = memo(() => {
  useSEO({
    title: 'Purchase Successful',
    description: 'Your premium photo purchase was successful. Download your photo from My12Photos.',
    keywords: ['purchase success', 'download photo', 'my12photos'],
  });

  return <BuyPhotosSuccessMain />;
});

BuyPhotosSuccess.displayName = 'BuyPhotosSuccess';

export default BuyPhotosSuccess;
