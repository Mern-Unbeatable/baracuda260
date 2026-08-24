import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Settings, UserCheck, Users } from 'lucide-react';
import { ROUTES } from '@/shared/config';

const SELECTION_ITEMS = [
  {
    id: 'following',
    to: ROUTES.ADMIN_PROFILE_FOLLOWING,
    titleKey: 'profileConnections.following.title',
    subtitleKey: 'profileConnections.following.subtitle',
    icon: UserCheck,
  },
  {
    id: 'followers',
    to: ROUTES.ADMIN_PROFILE_FOLLOWERS,
    titleKey: 'profileConnections.followers.title',
    subtitleKey: 'profileConnections.followers.subtitle',
    icon: Users,
  },
  {
    id: 'settings',
    to: ROUTES.ADMIN_PROFILE_SETTINGS,
    titleKey: 'profileConnections.settings.title',
    subtitleKey: 'profileConnections.settings.subtitle',
    icon: Settings,
  },
];

const ProfileSelectionContent = memo(() => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-crimson text-[28px] font-semibold leading-normal text-[#050609] sm:text-[36px]">
          {t('profileConnections.selection.title')}
        </h1>
        <p className="font-poppins text-[16px] font-normal leading-[1.5] text-[#464646]">
          {t('profileConnections.selection.subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SELECTION_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.to}
              className="group flex flex-col gap-3 rounded-2xl border border-[rgba(0,0,0,0.12)] bg-white p-6 transition hover:border-[#4048cd]/40 hover:shadow-sm"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#ecedfa] text-[#4048cd]">
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-[18px] font-semibold text-[#161c27]">{t(item.titleKey)}</span>
                <span className="text-[14px] leading-6 text-[#494453]">{t(item.subtitleKey)}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[14px] font-medium text-[#4048cd]">
                {t('profileConnections.selection.open')}
                <ChevronRight size={16} aria-hidden="true" className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

ProfileSelectionContent.displayName = 'ProfileSelectionContent';

export default ProfileSelectionContent;
