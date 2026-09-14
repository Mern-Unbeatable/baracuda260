import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';

export const PROFILE_TABS = [
  { id: 'profile', labelKey: 'photographerProfile.tabs.profile' },
  { id: 'artwork', labelKey: 'photographerProfile.tabs.artwork' },
  { id: 'store', labelKey: 'photographerProfile.tabs.store' },
  { id: 'premium', labelKey: 'photographerProfile.tabs.premium' },
  { id: 'posts', labelKey: 'photographerProfile.tabs.posts' },
];

const PhotographerProfileTabs = memo(({ activeTab, onChange }) => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t('photographerProfile.tabs.aria')}
      className="-mx-4 mt-5 border-b border-[#e5e7eb] sm:-mx-6 sm:mt-6"
    >
      <div className="scrollbar-white flex gap-1 overflow-x-auto px-4 sm:gap-2 sm:px-6">
        {PROFILE_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative shrink-0 cursor-pointer px-3 py-3 text-[14px] font-semibold transition sm:px-4 sm:text-[15px] ${
                active ? 'text-[#4048cd]' : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              {t(tab.labelKey)}
              {active ? (
                <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-[#4048cd]" />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

PhotographerProfileTabs.displayName = 'PhotographerProfileTabs';

export default PhotographerProfileTabs;
