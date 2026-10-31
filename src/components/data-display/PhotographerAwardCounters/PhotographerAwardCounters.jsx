import { Camera, Plus } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AwardArtworkModal from '@/components/data-display/AwardArtworkModal/AwardArtworkModal';

const COUNTER_STYLES = {
  gold: {
    badge:
      'bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] border-[#eab308] text-[#713f12] shadow-xs',
    icon: 'text-[#854d0e]',
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
    submissionId,
    photographerName,
    artworkTitle,
    artworkImage,
    userId,
    interactive = false,
    showAwardButton = false,
    onAwardSuccess,
  }) => {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const sizeConfig = SIZE_STYLES[size] ?? SIZE_STYLES.sm;

    const defaultZeroTiers = [
      { id: 'gold', count: 0 },
      { id: 'silver', count: 0 },
      { id: 'bronze', count: 0 },
    ];

    const tierList = Array.isArray(awards)
      ? awards
      : awards &&
          typeof awards === 'object' &&
          ('gold' in awards || 'silver' in awards || 'bronze' in awards)
        ? [
            { id: 'gold', count: Number(awards.gold) || 0 },
            { id: 'silver', count: Number(awards.silver) || 0 },
            { id: 'bronze', count: Number(awards.bronze) || 0 },
          ]
        : defaultZeroTiers;

    const isClickable = interactive && Boolean(submissionId);

    const handleClick = (e) => {
      if (!isClickable) return;
      e.preventDefault();
      e.stopPropagation();
      setModalOpen(true);
    };

    return (
      <>
        <div
          className={`inline-flex items-center ${sizeConfig.wrap} ${className}`.trim()}
          aria-label={t('photographerProfile.appreciation.title', {
            defaultValue: 'Artwork Appreciation Awards',
          })}
        >
          {tierList.map((tier) => {
            const style = COUNTER_STYLES[tier.id] ?? COUNTER_STYLES.gold;
            const tierTitle = t(style.labelKey, {
              defaultValue: style.defaultLabel,
            });
            const tooltip = isClickable
              ? `${tierTitle}: ${tier.count} · ${t('photographerProfile.appreciation.clickToAward', 'Click to award')}`
              : `${tierTitle}: ${tier.count}`;

            return (
              <span
                key={tier.id}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onClick={handleClick}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    handleClick(e);
                  }
                }}
                title={tooltip}
                aria-label={tooltip}
                className={`inline-flex items-center rounded-full border font-semibold leading-none tracking-tight shadow-2xs transition-transform select-none ${
                  isClickable
                    ? 'cursor-pointer hover:scale-110 active:scale-95'
                    : 'cursor-default'
                } ${style.badge} ${sizeConfig.badge}`}
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

          {showAwardButton && isClickable && (
            <button
              type="button"
              onClick={handleClick}
              className={`inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 font-semibold text-amber-800 transition hover:bg-amber-100 ${sizeConfig.badge}`}
              title={t(
                'photographerProfile.appreciation.giveAward',
                'Give Award',
              )}
            >
              <Plus size={sizeConfig.iconSize} />
              <span>
                {t('photographerProfile.appreciation.award', 'Award')}
              </span>
            </button>
          )}
        </div>

        {isClickable && (
          <AwardArtworkModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            submissionId={submissionId}
            artworkTitle={artworkTitle}
            photographerName={photographerName}
            artworkImage={artworkImage}
            appreciation={awards}
            userId={userId}
            onSuccess={onAwardSuccess}
          />
        )}
      </>
    );
  },
);

PhotographerAwardCounters.displayName = 'PhotographerAwardCounters';

export default PhotographerAwardCounters;
