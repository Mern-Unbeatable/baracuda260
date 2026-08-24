import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Shell } from '@/shared/site-chrome';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import { ABOUT_ASSETS } from '@/portals/public/about/data/aboutAssets';

const AboutStory = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white section-py">
      <Shell>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="relative h-90 overflow-hidden rounded-[20px] sm:h-120 lg:h-151">
            <img
              src={ABOUT_ASSETS.story}
              alt=""
              width={668}
              height={604}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-8 lg:gap-10">
            <SectionHeader align="left" title={t('about.story.title')} />
            <div className="flex flex-col gap-5 text-[16px] leading-normal text-[#5b5b5b] sm:text-[20px]">
              <p>{t('about.story.p1')}</p>
              <p>{t('about.story.p2')}</p>
            </div>
            <blockquote className="flex gap-2.5 border-l-2 border-[#4048cd] pl-2.5">
              <p className="text-[16px] italic leading-normal text-[#6b7280] sm:text-[20px]">
                &ldquo;{t('about.story.quote')}&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </Shell>
    </section>
  );
});

AboutStory.displayName = 'AboutStory';

export default AboutStory;
