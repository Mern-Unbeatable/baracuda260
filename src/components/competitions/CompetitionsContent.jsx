import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import { ImgIcon, Shell, SitePageLayout } from '../site';
import { COMPETITION_CARDS, COMPETITION_STEPS } from '../../data/competitionsMarketing';

const A = '/assets/home';

const ASSETS = {
  logo: `${A}/logo.png`,
  logoFooter: `${A}/logo-footer.png`,
  chevron: `${A}/chevron-down.svg`,
  camera: `${A}/icon-camera.svg`,
  book: `${A}/icon-book.svg`,
  sparkle: `${A}/icon-sparkle.svg`,
  check: `${A}/icon-check.svg`,
  checkAlt: `${A}/icon-check-alt.svg`,
  arrow: `${A}/icon-arrow.svg`,
  mail: `${A}/icon-mail.svg`,
  ig: `${A}/icon-ig.svg`,
  fb: `${A}/icon-fb.svg`,
  x: `${A}/icon-x.svg`,
  newsletterBg: `${A}/newsletter-bg.png`,
};

const CompetitionsContent = memo(() => {
  const { t } = useTranslation();

  return (
    <SitePageLayout
      activeHref={ROUTES.COMPETITIONS}
      rootClassName="competitions-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      {/* Active Competitions */}
      <section className="bg-[#f7f8fa] py-16 sm:py-20 xl:py-[114px]">
        <Shell>
          <div className="mx-auto mb-11 max-w-[682px] text-center">
            <p className="text-[16px] font-bold uppercase tracking-[1.2px] text-[#e31837]">
              {t('home.competitions.eyebrow')}
            </p>
            <h1 className="mt-5 text-[32px] font-extrabold leading-tight text-[#0d0d14] sm:text-[40px] xl:text-[48px] xl:leading-[48px]">
              {t('home.competitions.title')}
            </h1>
            <p className="mt-2.5 text-[16px] leading-[1.45] text-[#6b7280] sm:text-[20px] sm:leading-[29.25px]">
              {t('home.competitions.subtitle')}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {COMPETITION_CARDS.map((card) => (
              <article
                key={card.titleKey}
                className="relative flex h-full flex-col justify-between rounded-[20px] border border-black/16 bg-white p-6 sm:p-8"
              >
                {card.popular && (
                  <span className="absolute left-1/2 top-[-12px] -translate-x-1/2 rounded-full bg-[#4048cd] px-3 py-1 text-[10px] font-extrabold tracking-[0.5px] text-white">
                    {t('common.mostPopular')}
                  </span>
                )}
                <div className="flex flex-col gap-4">
                  <div className="flex size-14 items-center justify-center rounded-lg bg-[#fde8e9]">
                    <ImgIcon src={card.icon} size={32} />
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      <h2 className="text-[24px] font-semibold capitalize leading-7 text-[#0d0d14] sm:text-[32px]">
                        {t(card.titleKey)}
                      </h2>
                      <p className="text-[16px] leading-normal text-[#6b7280]">
                        {t(card.descriptionKey)}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {card.featureKeys.map((featureKey) => (
                        <li
                          key={featureKey}
                          className="flex items-center gap-2 text-[14px] text-[#111827]"
                        >
                          <ImgIcon src={card.check} size={13} />
                          {t(featureKey)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[16px] text-[#1b1e56]">
                    <span className="text-[28px] font-semibold text-[#4048cd] sm:text-[32px]">
                      {card.prize}
                    </span>
                    {t('common.prizeMoney')}
                  </p>
                </div>
                <a
                  href="#"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-bold text-white"
                >
                  {t('common.enterNow')}
                  <ImgIcon src={ASSETS.arrow} size={16} />
                </a>
              </article>
            ))}
          </div>
        </Shell>
      </section>

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
