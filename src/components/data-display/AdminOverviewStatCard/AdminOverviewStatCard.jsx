import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CARD_BORDER,
  CARD_SHADOW,
} from '@/portals/admin/data/adminOverviewData';

const AdminOverviewStatCard = memo(({ labelKey, valueKey }) => {
  const { t } = useTranslation();

  return (
    <article
      className={`flex min-w-0 flex-1 flex-col rounded-2xl bg-white p-5 sm:p-6 ${CARD_BORDER} ${CARD_SHADOW}`}
    >
      <p className="text-[15px] leading-6 text-[#7a8497] sm:text-[16px]">
        {t(labelKey)}
      </p>
      <p className="mt-3 text-[26px] font-bold leading-tight tracking-[-1.2px] text-[#172033] sm:mt-4 sm:text-[30px]">
        {t(valueKey)}
      </p>
    </article>
  );
});

AdminOverviewStatCard.displayName = 'AdminOverviewStatCard';

export default AdminOverviewStatCard;
