import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImgIcon, Shell } from '../site';
import { ABOUT_COMMUNITY_FEATURES, ABOUT_COMMUNITY_IMAGES } from './aboutData';

const AboutCommunity = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-16 sm:py-20 xl:py-[100px]">
      <Shell>
        <div className="grid items-center gap-12 xl:grid-cols-[760fr_628fr] xl:gap-[150px]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-[32px] font-extrabold text-[#0d0d14] sm:text-[40px] xl:text-[48px]">
                {t('about.community.title')}
              </h2>
              <p className="mt-4 text-[16px] leading-normal text-[#6b7280] sm:mt-0 sm:text-[20px]">
                {t('about.community.body')}
              </p>
            </div>

            <div className="flex flex-col gap-8 sm:gap-[38px]">
              <p className="text-[16px] font-medium text-[#33333a] sm:text-[20px]">
                {t('about.community.belief')}
              </p>
              <div className="grid gap-[19px] sm:grid-cols-2">
                {ABOUT_COMMUNITY_FEATURES.map((feature) => (
                  <div
                    key={feature.titleKey}
                    className="flex gap-3.5 rounded-xl border border-black/24 bg-white p-4"
                  >
                    <ImgIcon src={feature.icon} size={24} />
                    <div className="min-w-0">
                      <p className="text-[18px] font-medium text-[#33333a] sm:text-[20px]">
                        {t(feature.titleKey)}
                      </p>
                      <p className="mt-1 text-[14px] leading-normal text-[#6b7280]">
                        {t(feature.textKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {ABOUT_COMMUNITY_IMAGES.map((image) => (
              <div
                key={image.src}
                className={`relative overflow-hidden rounded-[20px] bg-[#f3f3f3] ${image.className}`}
              >
                <img src={image.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </Shell>
    </section>
  );
});

AboutCommunity.displayName = 'AboutCommunity';

export default AboutCommunity;
