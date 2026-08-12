import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { MarketingSearchBar } from '@/shared/ui/marketing';

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
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState('');
  const slideCount = HOME_HERO_SLIDES.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, HOME_HERO_SLIDE_MS);

    return () => window.clearInterval(id);
  }, [slideCount]);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    const target = trimmed
      ? `${ROUTES.GALLERY}?q=${encodeURIComponent(trimmed)}`
      : ROUTES.GALLERY;
    navigate(target);
  };

  return (
    <section className="relative min-h-140 w-full overflow-hidden md:min-h-180 xl:min-h-200">
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
      <div className="absolute inset-0 bg-linear-to-r from-[#1b1e56]/85 from-28% via-[#1b1e56]/70 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-4 sm:h-6 bg-linear-to-t from-white via-white/30 to-transparent z-10" />
      <div className="relative z-20 mx-auto flex min-h-140 w-full max-w-480 items-center px-4 py-16 sm:px-6 md:min-h-180 md:px-10 xl:min-h-200 xl:px-48">
        <div className="flex w-full max-w-225 flex-col gap-9">
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4.25 py-1.75">
              <span className="size-2 rounded-full bg-[#05df72]" />
              <span className="text-sm font-semibold text-white">{t('home.hero.badge')}</span>
            </div>
            <h1 className="text-[36px] font-bold uppercase leading-[1.15] tracking-[-1.44px] text-white sm:text-[48px] xl:text-[64px] xl:leading-[77.76px]">
              {t('home.hero.title')}
            </h1>
            <p className="max-w-180 text-[16px] leading-[1.6] text-white sm:text-[20px] sm:leading-[32.5px]">
              {t('home.hero.subtitle')}
            </p>
          </div>
          <MarketingSearchBar
            className="max-w-180 bg-white"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onSubmit={handleSearch}
            placeholder={t('home.hero.searchPlaceholder')}
            ariaLabel={t('home.hero.searchPlaceholder')}
          />
        </div>
      </div>

      <div
        className="absolute bottom-8.75 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.75"
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
