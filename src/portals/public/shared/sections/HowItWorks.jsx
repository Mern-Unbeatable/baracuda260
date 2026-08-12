import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { COMPETITION_STEPS } from '@/shared/data/competitionsMarketing';
import { Shell } from '@/shared/site-chrome';
import { SectionHeader } from '@/shared/ui/marketing';

/**
 * Shared How It Works section (Home + Competitions pages).
 */
const HowItWorks = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white section-py">
      <Shell>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeader
            className="max-w-xl"
            align="left"
            badge={t('home.howItWorks.eyebrow')}
            title={
              <>
                {t('home.howItWorks.titleLine1')}
                <br />
                {t('home.howItWorks.titleLine2')}
              </>
            }
            description={t('home.howItWorks.subtitle')}
          />

          <div className="flex flex-col">
            {COMPETITION_STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-5">
                <div className="flex w-11 flex-col items-center">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[rgba(227,24,55,0.08)] text-[12px] font-extrabold text-[#e31837]">
                    {step.num}
                  </div>
                  {i < COMPETITION_STEPS.length - 1 ? (
                    <div className="my-2 min-h-10 w-px flex-1 bg-black/8" />
                  ) : null}
                </div>
                <div className="pb-8">
                  <h3 className="text-[20px] font-semibold leading-6 text-(--primary-text-heading-color)">
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-1.5 text-[16px] leading-normal text-(--primary-text-color)">
                    {t(step.textKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    </section>
  );
});

HowItWorks.displayName = 'HowItWorks';

export default HowItWorks;
