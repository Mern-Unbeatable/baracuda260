import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import Zodiac12Content from '@/portals/member/views/Zodiac12Content';

const Zodiac12 = memo(() => {
  useSEO({
    title: '12 Photo Zodiac Album',
    description:
      'Upload a full 12-photo red and blue zodiac story for My12Photos competitions.',
    keywords: ['12 photo', 'zodiac album', 'upload', 'My12Photos'],
  });

  return <Zodiac12Content />;
});

Zodiac12.displayName = 'Zodiac12';

export default Zodiac12;
