import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Bell } from 'lucide-react';

const MemberNotificationItem = memo(({ item }) => {
  const { t } = useTranslation();

  return (
    <article className="flex items-start gap-4 px-1 py-5 sm:gap-5 sm:px-2">
      {item.type === 'platform' ? (
        <span className="inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ecedfa] ring-1 ring-[#ececf0]">
          {item.icon ? (
            <img src={item.icon} alt="" width={32} height={32} className="size-8 object-contain" />
          ) : (
            <Bell size={20} strokeWidth={2} aria-hidden="true" className="text-[#4048cd]" />
          )}
        </span>
      ) : (
        <img
          src={item.avatar}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full object-cover ring-1 ring-[#ececf0]"
        />
      )}

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[15px] leading-6 text-[#161c27] sm:text-[16px]">
          {t(item.messageKey)}
        </p>
        <p className="mt-1 text-[13px] leading-5 text-[#9ca3af]">{item.date}</p>
      </div>
    </article>
  );
});

MemberNotificationItem.displayName = 'MemberNotificationItem';

export default MemberNotificationItem;
