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

    const canAward = Boolean(submissionId);

    const handleOpenAwardModal = (e) => {
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
            const tooltip = `${tierTitle}: ${tier.count}`;

            return (
              <span
                key={tier.id}
                title={tooltip}
                aria-label={tooltip}
                className={`inline-flex items-center rounded-full border font-semibold leading-none tracking-tight shadow-2xs select-none cursor-default ${style.badge} ${sizeConfig.badge}`}
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

          {showAwardButton && canAward && (
            <button
              type="button"
              onClick={handleOpenAwardModal}
              className={`inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 font-semibold text-amber-800 transition hover:bg-amber-100 cursor-pointer ${sizeConfig.badge}`}
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

        {canAward && (
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
