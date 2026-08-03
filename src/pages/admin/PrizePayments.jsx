import React, { memo } from 'react';
import UserSectionPlaceholder from './UserSectionPlaceholder';

const PrizePayments = memo(() => (
  <UserSectionPlaceholder titleKey="dashboard.nav.prizePayments" />
));

PrizePayments.displayName = 'PrizePayments';

export default PrizePayments;
