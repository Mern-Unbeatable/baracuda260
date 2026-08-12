import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImgIcon, Shell } from '@/shared/site-chrome';
import { SectionHeader } from '@/shared/ui/marketing';
import { HOME_FEATURES } from '../data/homePageData';

const HomeFeaturesSection = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white section-py">
      <Shell>
        <SectionHeader
          className="mb-11"
          align="left"
          badge={t('home.features.eyebrow')}
          badgeTone="navy"
          title={t('home.features.title')}
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {HOME_FEATURES.map((f) => (
            <article key={f.titleKey} className="rounded-2xl border border-black/17 p-6.25">
              <div className="mb-2.5 flex size-10 items-center justify-center rounded-[14px] bg-[#eef2ff]">
                <ImgIcon src={f.icon} size={18} />
              </div>
              <h3 className="text-[24px] font-semibold leading-6.75 text-[#3a3a42]">
                {t(f.titleKey)}
              </h3>
              <p className="mt-2.5 max-w-81 text-[16px] leading-[22.75px] text-[#6b7280]">
                {t(f.textKey)}
              </p>
            </article>
          ))}
        </div>
      </Shell>
    </section>
  );
});

HomeFeaturesSection.displayName = 'HomeFeaturesSection';

export default HomeFeaturesSection;
