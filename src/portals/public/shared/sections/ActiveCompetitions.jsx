import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { COMPETITION_CARDS } from '@/shared/data/competitionsMarketing';
import { Shell, homeAsset } from '@/shared/site-chrome';
import { PlanCard, SectionHeader } from '@/shared/ui/marketing';

const ENTER_ARROW = homeAsset('icon-arrow.svg');

/**
 * Shared Active Competitions section (Home + Competitions pages).
 */
const ActiveCompetitions = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-[#f7f8fa] section-py">
      <Shell>
        <SectionHeader
          className="mb-11"
          badge={t('home.competitions.eyebrow')}
          title={t('home.competitions.title')}
          description={t('home.competitions.subtitle')}
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {COMPETITION_CARDS.map((card) => (
            <PlanCard
              key={card.titleKey}
              id={card.id}
              icon={card.icon}
              checkIcon={card.check}
              title={t(card.titleKey)}
              description={t(card.descriptionKey)}
              features={card.featureKeys.map((key) => t(key))}
              prize={card.prize}
              prizeSuffix={t('common.prizeMoney')}
              popular={card.popular}
              popularLabel={card.popular ? t('common.mostPopular') : undefined}
              ctaLabel={t('common.enterNow')}
              ctaIcon={ENTER_ARROW}
            />
          ))}
        </div>
      </Shell>
    </section>
  );
});

ActiveCompetitions.displayName = 'ActiveCompetitions';

export default ActiveCompetitions;
