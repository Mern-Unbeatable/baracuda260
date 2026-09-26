import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ADS_STATUS,
  ADS_STATUS_STYLES,
  getStatusLabel,
} from '@/portals/admin/data/adminAdsData';

/**
 * @param {{ status: string }} props
 */
const AdsStatusBadge = memo(({ status }) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold leading-4 whitespace-nowrap ${
        ADS_STATUS_STYLES[status] ?? ADS_STATUS_STYLES[ADS_STATUS.EXPIRED]
      }`}
    >
      {getStatusLabel(t, status)}
    </span>
  );
});

AdsStatusBadge.displayName = 'AdsStatusBadge';

export default AdsStatusBadge;
