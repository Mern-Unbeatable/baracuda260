import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ABOUT_HERO_SLIDE_MS, ABOUT_HERO_SLIDES } from '@/portals/public/about/data/aboutAssets';

const AboutHero = memo(() => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = ABOUT_HERO_SLIDES.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, ABOUT_HERO_SLIDE_MS);

    return () => window.clearInterval(id);
  }, [slideCount]);

  return (
    <section className="relative min-h-130 w-full overflow-hidden md:min-h-170 xl:min-h-222.5">
      {ABOUT_HERO_SLIDES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          width={1920}
          height={890}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-r from-[#1b1e56] from-28% via-[#1b1e56]/70 to-transparent" />
      <div className="relative mx-auto flex min-h-130 w-full max-w-480 items-center px-4 py-16 sm:px-6 md:min-h-170 md:px-10 xl:min-h-200 xl:px-48">
        <div className="flex w-full max-w-171.75 flex-col gap-9">
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4.25 py-1.75">
              <span className="size-2 rounded-full bg-[#05df72]" />
              <span className="text-sm font-semibold text-white">{t('about.hero.badge')}</span>
            </div>
            <h1 className="text-[36px] font-semibold leading-[1.15] tracking-[-1.44px] text-white sm:text-[48px] xl:text-[64px] xl:leading-[77.76px]">
              {t('about.hero.title')}
            </h1>
            <p className="max-w-2xl text-[16px] leading-[1.6] text-white sm:text-[20px] sm:leading-[32.5px]">
              {t('about.hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
            >
              {t('about.hero.ctaJoin')}
            </a>
            <a
              href="#how-competitions-work"
              className="inline-flex items-center justify-center rounded-full bg-[#4048cd] px-6 py-3 text-[16px] font-medium text-white"
            >
              {t('about.hero.ctaLearn')}
            </a>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-12.5 left-1/2 flex -translate-x-1/2 items-center gap-1.75"
        role="tablist"
        aria-label={t('common.heroSlides')}
      >
        {ABOUT_HERO_SLIDES.map((_, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={ABOUT_HERO_SLIDES[index]}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={t('common.showSlide', { n: index + 1 })}
              onClick={() => setActiveIndex(index)}
              className={`size-3.5 rounded-full transition ${
                active ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
});

AboutHero.displayName = 'AboutHero';

export default AboutHero;
