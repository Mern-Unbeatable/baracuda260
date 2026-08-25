import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdvertiseWithUsMain from './sections/AdvertiseWithUsMain';

const AdvertiseWithUs = memo(() => {
  useSEO({
    title: 'Advertise with us',
    description:
      'Promote your business to our photography community with transparent ad placements.',
    keywords: ['advertise', 'business', 'marketing', 'photography'],
  });

  return <AdvertiseWithUsMain />;
});

AdvertiseWithUs.displayName = 'AdvertiseWithUs';

export default AdvertiseWithUs;

