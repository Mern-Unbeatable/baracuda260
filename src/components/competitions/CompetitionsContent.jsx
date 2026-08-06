import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import { ImgIcon, Shell, SitePageLayout } from '../site';
import { COMPETITION_STEPS } from '../../data/competitionsMarketing';
import ActiveCompetitions from './ActiveCompetitions';

const CompetitionsContent = memo(() => {
  const { t } = useTranslation();

  return (
    <SitePageLayout
      activeHref={ROUTES.COMPETITIONS}
      rootClassName="competitions-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      <ActiveCompetitions headingAs="h1" />

      {/* How It Works */}
      <section className="bg-white py-16 sm:py-20 xl:py-[112px]">
        <Shell>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="max-w-[576px]">
              <p className="text-[16px] font-bold uppercase tracking-[1.2px] text-[#e31837]">
                {t('home.howItWorks.eyebrow')}
              </p>
              <h2 className="mt-2.5 text-[36px] font-extrabold leading-[1.1] text-[#0d0d14] sm:text-[48px] sm:leading-[48px]">
                {t('home.howItWorks.titleLine1')}
                <br />
                {t('home.howItWorks.titleLine2')}
              </h2>
              <p className="mt-2.5 text-[16px] leading-[1.45] text-[#6b7280] sm:text-[20px] sm:leading-[29.25px]">
                {t('home.howItWorks.subtitle')}
              </p>
            </div>

            <div className="flex flex-col">
              {COMPETITION_STEPS.map((step, i) => (
                <div key={step.num} className="flex gap-5">
                  <div className="flex w-11 flex-col items-center">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-[rgba(227,24,55,0.08)] text-[12px] font-extrabold text-[#e31837]">
                      {step.num}
                    </div>
                    {i < COMPETITION_STEPS.length - 1 && (
                      <div className="my-2 min-h-10 w-px flex-1 bg-black/8" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-[20px] font-extrabold leading-6 text-[#0d0d14]">
                      {t(step.titleKey)}
                    </h3>
                    <p className="mt-1.5 text-[16px] leading-normal text-[#6b7280]">
                      {t(step.textKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Shell>
      </section>
    </SitePageLayout>
  );
});

CompetitionsContent.displayName = 'CompetitionsContent';

export default CompetitionsContent;
