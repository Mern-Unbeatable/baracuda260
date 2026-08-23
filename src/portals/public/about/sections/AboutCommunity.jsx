import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { ImgIcon, Shell } from '@/shared/site-chrome';
import { SectionHeader } from '@/shared/ui/marketing';
import { ABOUT_COMMUNITY_FEATURES, ABOUT_COMMUNITY_IMAGES } from '@/portals/public/about/data/aboutData';

const AboutCommunity = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white section-py">
      <Shell>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="flex flex-col gap-8">
            <SectionHeader
              align="left"
              className="max-w-xl"
              title={t('about.community.title')}
              description={t('about.community.body')}
            />

            <div className="flex flex-col gap-8 sm:gap-9.5">
              <p className="text-[16px] font-medium text-[#33333a] sm:text-[20px]">
                {t('about.community.belief')}
              </p>
              <div className="grid gap-4.75 sm:grid-cols-2">
                {ABOUT_COMMUNITY_FEATURES.map((feature) => (
                  <div
                    key={feature.titleKey}
                    className="flex gap-3.5 rounded-xl border border-black/24 bg-white p-4"
                  >
                    <ImgIcon src={feature.icon} size={24} />
                    <div className="min-w-0">
                      <p className="text-[16px] font-semibold text-[#33333a] sm:text-[18px]">
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
            <div className="flex flex-col gap-5">
              {ABOUT_COMMUNITY_IMAGES.left.map((image) => (
                <div
                  key={image.src}
                  className={`relative overflow-hidden rounded-[20px] bg-[#f3f3f3] ${image.className}`}
                >
                  <img src={image.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-5 pt-6 xl:pt-10">
              {ABOUT_COMMUNITY_IMAGES.right.map((image) => (
                <div
                  key={image.src}
                  className={`relative overflow-hidden rounded-[20px] bg-[#f3f3f3] ${image.className}`}
                >
                  <img src={image.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
});

AboutCommunity.displayName = 'AboutCommunity';

export default AboutCommunity;
