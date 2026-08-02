import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import { AppLink } from '../site';

const A = '/assets/home';

/** Auto-advance interval for Home hero image slider (ms). */
export const HOME_HERO_SLIDE_MS = 6000;

export const HOME_HERO_SLIDES = [
  `${A}/hero.jpg`,
  `${A}/six-hero-aries.jpg`,
  `${A}/blue-hero-libra.jpg`,
  `${A}/detail-hero.jpg`,
];

const HomeHero = memo(() => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = HOME_HERO_SLIDES.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, HOME_HERO_SLIDE_MS);

    return () => window.clearInterval(id);
  }, [slideCount]);

  return (
    <section className="relative min-h-[560px] w-full overflow-hidden md:min-h-[720px] xl:min-h-[890px]">
      {HOME_HERO_SLIDES.map((src, index) => (
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
      <div className="absolute inset-0 bg-gradient-to-r from-[#1b1e56] from-[28%] via-[#1b1e56]/70 to-transparent" />
      <div className="relative mx-auto flex min-h-[560px] w-full max-w-[1920px] items-center px-4 py-16 sm:px-6 md:min-h-[720px] md:px-10 xl:min-h-[890px] xl:px-[192px]">
        <div className="flex w-full max-w-[900px] flex-col gap-9">
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-[17px] py-[7px]">
              <span className="size-2 rounded-full bg-[#05df72]" />
              <span className="text-sm font-semibold text-white">{t('home.hero.badge')}</span>
            </div>
            <h1 className="text-[36px] font-extrabold uppercase leading-[1.15] tracking-[-1.44px] text-white sm:text-[48px] xl:text-[64px] xl:leading-[77.76px]">
              {t('home.hero.title')}
            </h1>
            <p className="max-w-[720px] text-[16px] leading-[1.6] text-white sm:text-[20px] sm:leading-[32.5px]">
              {t('home.hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-medium text-white"
            >
              {t('home.hero.ctaJoin')}
            </a>
            <AppLink
              href={ROUTES.GALLERY}
              className="inline-flex items-center justify-center rounded-full bg-[#4048cd] px-6 py-3 text-[16px] font-medium text-white"
            >
              {t('home.hero.ctaGallery')}
            </AppLink>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[50px] left-1/2 flex -translate-x-1/2 items-center gap-[7px]"
        role="tablist"
        aria-label={t('common.heroSlides')}
      >
        {HOME_HERO_SLIDES.map((src, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={src}
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

HomeHero.displayName = 'HomeHero';

export default HomeHero;
