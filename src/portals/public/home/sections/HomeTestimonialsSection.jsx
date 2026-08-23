import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { ImgIcon, Shell } from '@/shared/site-chrome';
import { SectionHeader } from '@/shared/ui/marketing';
import { HOME_TESTIMONIALS, homeAssets } from '../data/homePageData';

const HomeTestimonialsSection = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-[#f7f8fa] section-py">
      <Shell>
        <SectionHeader
          className="mb-11"
          badge={t('home.testimonials.eyebrow')}
          title={t('home.testimonials.title')}
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {HOME_TESTIMONIALS.map((item) => (
            <article
              key={item.name}
              className="flex flex-col rounded-2xl border border-black/8 bg-white p-8"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ImgIcon
                    key={i}
                    src={i < Math.floor(item.stars) ? homeAssets.starFull : homeAssets.starHalf}
                    size={16}
                  />
                ))}
              </div>
              <p className="flex-1 text-[14px] leading-[22.75px] text-[#0d0d14]">
                &ldquo;{t(item.quoteKey)}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-[14px] font-bold text-[#0d0d14]">{item.name}</p>
                  <p className="text-[12px] text-[#6b7280]">{t(item.roleKey)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Shell>
    </section>
  );
});

HomeTestimonialsSection.displayName = 'HomeTestimonialsSection';

export default HomeTestimonialsSection;
