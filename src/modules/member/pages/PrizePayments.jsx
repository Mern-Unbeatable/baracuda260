import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import PrizePaymentsContent from '@/modules/member/views/PrizePaymentsContent';

const PrizePayments = memo(() => {
  useSEO({
    title: 'Prize & Payments',
    description:
      'Manage your My12Photos earnings, pending rewards, and withdrawal methods securely.',
    keywords: ['prize', 'payments', 'payout', 'wallet', 'My12Photos'],
  });

  return <PrizePaymentsContent />;
});

PrizePayments.displayName = 'PrizePayments';

export default PrizePayments;
