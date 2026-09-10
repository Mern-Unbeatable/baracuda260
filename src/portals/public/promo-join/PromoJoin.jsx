import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSEO } from '@/shared/hooks/useSEO';
import PromoJoinContent from '@/portals/public/promo-join/PromoJoinContent';

const PromoJoin = memo(() => {
  const { code = '' } = useParams();

  useSEO({
    title: 'Create your Account',
    description:
      'Join My12Photos with a promotional invite — create your account and complete your zodiac photo story.',
    keywords: ['promo join', 'create account', 'zodiac', 'My12Photos'],
  });

  return <PromoJoinContent code={code} />;
});

PromoJoin.displayName = 'PromoJoin';

export default PromoJoin;
