import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminPayoutsContent from '@/portals/admin/views/AdminPayoutsContent';

const Payouts = memo(() => {
  useSEO({
    title: 'Payouts',
    description:
      'Admin prize payouts — review withdrawal requests and reconcile manual payments on My12Photos.',
    keywords: ['payouts', 'prize', 'withdrawals', 'admin', 'My12Photos'],
  });

  return <AdminPayoutsContent />;
});

Payouts.displayName = 'AdminPayouts';

export default Payouts;
