import React, { memo } from 'react';
import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PHOTOGRAPHER_TALENT_APPRECIATION } from '@/portals/public/photographer/data/photographerProfileData';

const COUNTER_STYLES = {
  gold: {
    badge: 'bg-[#fefce8] border-[#fef08a] text-[#854d0e]',
    icon: 'text-[#ca8a04]',
    labelKey: 'photographerProfile.appreciation.tiers.gold',
    defaultLabel: 'Gold Camera',
  },
  silver: {
    badge: 'bg-[#f1f5f9] border-[#e2e8f0] text-[#475569]',
    icon: 'text-[#64748b]',
    labelKey: 'photographerProfile.appreciation.tiers.silver',
    defaultLabel: 'Silver Camera',
  },
  bronze: {
    badge: 'bg-[#fff7ed] border-[#ffedd5] text-[#9a3412]',
    icon: 'text-[#b45309]',
    labelKey: 'photographerProfile.appreciation.tiers.bronze',
    defaultLabel: 'Bronze Camera',
  },
};

const SIZE_STYLES = {
  sm: {
    wrap: 'gap-1.5',
    badge: 'gap-1 px-2 py-0.5 text-[11px]',
    iconSize: 12,
  },
  md: {
    wrap: 'gap-2',
    badge: 'gap-1.5 px-2.5 py-1 text-[12px]',
    iconSize: 14,
  },
};

const PhotographerAwardCounters = memo(
  ({
    awards,
    size = 'sm',
    className = '',
  }) => {
    const { t } = useTranslation();
    const sizeConfig = SIZE_STYLES[size] ?? SIZE_STYLES.sm;
    const tierList = Array.isArray(awards)
      ? awards
      : PHOTOGRAPHER_TALENT_APPRECIATION.tiers;

    return (
      <div
        className={`inline-flex items-center ${sizeConfig.wrap} ${className}`.trim()}
        aria-label={t('photographerProfile.appreciation.title', {
          defaultValue: 'Artwork Appreciation Awards',
        })}
      >
        {tierList.map((tier) => {
          const style = COUNTER_STYLES[tier.id] ?? COUNTER_STYLES.gold;
          const tierTitle = t(style.labelKey, { defaultValue: style.defaultLabel });
          const tooltip = `${tierTitle}: ${tier.count}`;

          return (
            <span
              key={tier.id}
              title={tooltip}
              aria-label={tooltip}
              className={`inline-flex items-center rounded-full border font-semibold leading-none tracking-tight shadow-2xs transition-transform hover:scale-105 cursor-default select-none ${style.badge} ${sizeConfig.badge}`}
            >
              <Camera
                size={sizeConfig.iconSize}
                strokeWidth={2.2}
                className={`shrink-0 ${style.icon}`}
                aria-hidden="true"
              />
              <span>{tier.count}</span>
            </span>
          );
        })}
      </div>
    );
  },
);

PhotographerAwardCounters.displayName = 'PhotographerAwardCounters';

export default PhotographerAwardCounters;
