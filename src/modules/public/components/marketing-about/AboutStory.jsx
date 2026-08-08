import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shell } from '@/shared/site-chrome';
import { ABOUT_ASSETS } from '@/modules/public/data/aboutAssets';

const AboutStory = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-16 sm:py-20 xl:py-[120px]">
      <Shell>
        <div className="grid items-center gap-10 lg:grid-cols-[668fr_759fr] lg:gap-[101px]">
          <div className="relative h-[360px] overflow-hidden rounded-[20px] sm:h-[480px] lg:h-[604px]">
            <img
              src={ABOUT_ASSETS.story}
              alt=""
              width={668}
              height={604}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-8 lg:gap-10">
            <h2 className="text-[32px] font-extrabold text-[#0d0d14] sm:text-[40px] xl:text-[48px]">
              {t('about.story.title')}
            </h2>
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
