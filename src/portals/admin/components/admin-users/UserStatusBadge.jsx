import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getUserStatusLabel,
  USER_STATUS,
  USER_STATUS_STYLES,
} from '@/portals/admin/data/adminUsersData';

/**
 * @param {{ status: string }} props
 */
const UserStatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const styles =
    USER_STATUS_STYLES[status] ?? USER_STATUS_STYLES[USER_STATUS.SUSPENDED];

  return (
    <span
      className={`inline-flex h-7.5 items-center gap-1.25 rounded-lg px-2.25 py-1.25 ${styles.badge}`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-[3px] ${styles.dot}`}
        aria-hidden="true"
      />
      <span
        className={`text-[13px] font-bold leading-4.75 whitespace-nowrap ${styles.text}`}
      >
        {getUserStatusLabel(t, status)}
      </span>
    </span>
  );
});

UserStatusBadge.displayName = 'UserStatusBadge';

export default UserStatusBadge;
