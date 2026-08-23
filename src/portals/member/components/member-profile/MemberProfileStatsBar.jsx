import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';

const STAT_ITEMS = [
  { key: 'followers', href: ROUTES.ADMIN_PROFILE_FOLLOWERS },
  { key: 'following', href: ROUTES.ADMIN_PROFILE_FOLLOWING },
  { key: 'profileVisitors' },
  { key: 'totalArtwork' },
  { key: 'competitionEntries' },
  { key: 'totalHearts' },
  { key: 'premiumPhotos' },
];

const MemberProfileStatsBar = memo(({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 border-b border-black/8 pb-6 sm:mt-8 sm:grid-cols-4 lg:grid-cols-7">
      {STAT_ITEMS.map(({ key, href }) => {
        const value = Number(stats[key] ?? 0).toLocaleString('en-US');
        const label = t(`memberProfile.stats.${key}`, {
          defaultValue: t(`photographerProfile.stats.${key}`, { defaultValue: key }),
        });

        const content = (
          <>
            <p className="text-[24px] font-bold leading-none text-[#111827] sm:text-[28px]">{value}</p>
            <p className="text-[13px] leading-snug text-[#6b7280] sm:text-[14px]">{label}</p>
          </>
        );

        if (href) {
          return (
            <Link
              key={key}
              to={href}
              className="flex flex-col gap-1.5 transition hover:opacity-70"
            >
              {content}
            </Link>
          );
        }

        return (
          <div key={key} className="flex flex-col gap-1.5">
            {content}
          </div>
        );
      })}
    </div>
  );
});

MemberProfileStatsBar.displayName = 'MemberProfileStatsBar';

export default MemberProfileStatsBar;
