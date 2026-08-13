import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MemberNotificationItem from '@/portals/member/components/member-notifications/MemberNotificationItem';
import {
  MEMBER_NOTIFICATIONS,
  sortMemberNotifications,
} from '@/portals/member/data/memberNotificationsData';

const NotificationsContent = memo(() => {
  const { t } = useTranslation();

  const notifications = useMemo(
    () => sortMemberNotifications(MEMBER_NOTIFICATIONS),
    [],
  );

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6">
      <header>
        <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
          {t('memberNotifications.title')}
        </h1>
      </header>

      {notifications.length === 0 ? (
        <p className="text-[16px] text-[#494453]" role="status">
          {t('memberNotifications.empty')}
        </p>
      ) : (
        <section
          aria-label={t('memberNotifications.listAria')}
          className="overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.08)] bg-white shadow-sm"
        >
          <ul className="divide-y divide-[#ececf0] px-4 sm:px-6">
            {notifications.map((item) => (
              <li key={item.id}>
                <MemberNotificationItem item={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});

NotificationsContent.displayName = 'NotificationsContent';

export default NotificationsContent;
