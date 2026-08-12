import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shell } from '@/shared/site-chrome';
import { MarketingButton, MarketingCard, SectionHeader } from '@/shared/ui/marketing';

const AboutCta = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white section-py">
      <Shell>
        <MarketingCard variant="inset" className="px-6 py-12 sm:px-10 ">
          <div className="mx-auto flex max-w-170.5 flex-col items-center gap-8">
            <SectionHeader
              badge={t('about.cta.eyebrow')}
              badgeTone="brand"
              title={t('about.cta.title')}
              description={t('about.cta.subtitle')}
            />
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
