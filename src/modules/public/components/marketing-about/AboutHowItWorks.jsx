import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImgIcon, Shell } from '@/shared/site-chrome';
import { ABOUT_ASSETS } from '@/modules/public/data/aboutAssets';
import { ABOUT_STEPS } from '@/modules/public/data/aboutData';

const AboutHowItWorks = memo(() => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(ABOUT_STEPS[0].id);
  const active = ABOUT_STEPS.find((step) => step.id === activeId) || ABOUT_STEPS[0];

  const goNext = () => {
    setActiveId((current) => {
      const index = ABOUT_STEPS.findIndex((step) => step.id === current);
      const next = ABOUT_STEPS[(index + 1) % ABOUT_STEPS.length];
      return next.id;
    });
  };

  return (
    <section id="how-competitions-work" className="bg-[#ecedfa] py-14 sm:py-16 xl:py-[60px]">
      <Shell>
        <div className="mx-auto mb-10 max-w-[694px] text-center xl:mb-14">
          <p className="text-[16px] font-bold uppercase tracking-[1.2px] text-[#4048cd]">
            {t('about.howItWorks.eyebrow')}
          </p>
          <h2 className="mt-3.5 text-[32px] font-extrabold text-[#0d0d14] sm:text-[40px] xl:text-[48px]">
            {t('about.howItWorks.title')}
          </h2>
          <p className="mt-3.5 text-[16px] leading-normal text-[#6b7280] sm:text-[20px]">
            {t('about.howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-2">
          <div className="flex flex-col gap-4">
            {ABOUT_STEPS.map((step) => {
              const selected = step.id === activeId;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveId(step.id)}
                  className={`flex w-full items-center gap-[22px] rounded-xl border p-5 text-left transition sm:p-6 ${
                    selected
                      ? 'border-[#4048cd]/40 bg-white shadow-[0_8px_24px_rgba(13,13,20,0.06)]'
                      : 'border-black/17 bg-white hover:border-black/30'
                  }`}
                >
                  <span className="inline-flex h-[33px] w-8 shrink-0 items-center justify-center rounded bg-[#fde8e9] text-[20px] text-[#4d4f53]">
                    {step.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[20px] font-extrabold text-[#0d0d14] sm:text-[24px]">
                      {t(step.titleKey)}
                    </span>
                    <span className="mt-2 block text-[16px] text-[#6b7280] sm:text-[20px]">
                      {t(step.summaryKey)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-black/20 bg-white px-5 py-8 sm:px-8 sm:py-8 xl:min-h-[476px]">
            <div className="flex h-full min-h-[360px] flex-col justify-between gap-10 xl:min-h-[412px]">
              <div className="flex flex-col gap-4">
                <div className="flex w-full max-w-[363px] items-center gap-[22px] rounded-xl border border-black/17 bg-[#fde8e9] p-6">
                  <span className="inline-flex h-[33px] w-8 shrink-0 items-center justify-center rounded bg-white">
                    <ImgIcon src={ABOUT_ASSETS.userOutlined} size={16} />
                  </span>
                  <div>
                    <p className="text-[16px] text-[#fd9c00]">
                      {t('about.howItWorks.stepOf', {
                        current: active.id,
                        total: ABOUT_STEPS.length,
                      })}
                    </p>
                    <p className="mt-2 text-[20px] font-bold text-[#111827] sm:text-[24px]">
                      {t(active.titleKey)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-[16px] font-semibold text-[#3b3b3c] sm:text-[20px]">
                    {t(active.detailTitleKey)}
                  </p>
                  <p className="text-[16px] leading-normal text-[#606266] sm:text-[20px]">
                    {t(active.detailBodyKey)}
                  </p>
                </div>
              </div>

              <div>
                <div className="h-px w-full bg-black/10" />
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-[14px] text-[#606266]">{t('about.howItWorks.activeMode')}</p>
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#4048cd]"
                  >
                    {t('about.howItWorks.nextStep')}
                    <span className="inline-flex size-6 rotate-90 items-center justify-center">
                      <ImgIcon src={ABOUT_ASSETS.arrowNext} size={24} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
});

AboutHowItWorks.displayName = 'AboutHowItWorks';

export default AboutHowItWorks;
