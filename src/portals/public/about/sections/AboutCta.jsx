import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Shell } from '@/shared/site-chrome';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';
import MarketingCard from '@/components/marketing/MarketingCard/MarketingCard';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';

const AboutCta = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white section-py">
      <Shell>
        {/* Promo banner above CTA */}
        <div className="mb-6">
          <SectionHeader
            badge={t('about.cta.eyebrow')}
            badgeTone="brand"
            title={t('about.cta.title')}
            description={t('about.cta.subtitle')}
          />
        </div>

        <MarketingCard variant="inset" className="px-6 py-12 sm:px-10 ">
          <div className="mx-auto flex max-w-170.5 flex-col items-center gap-8">
            <MarketingButton as="a" href="#" className="font-medium">
              {t('about.cta.registerFree')}
            </MarketingButton>
          </div>
        </MarketingCard>
      </Shell>
    </section>
  );
});

AboutCta.displayName = 'AboutCta';

export default AboutCta;
