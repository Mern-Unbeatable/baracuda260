import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import MarketingSearchBar from '@/components/marketing/MarketingSearchBar/MarketingSearchBar';

const SLIDES = ['/assets/hero/hero.png', '/assets/hero/hero1.png'];
const SLIDE_MS = 6000;

const HomeHero = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((i) => (i + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, []);

  const goToGallery = (event) => {
    event.preventDefault();
    const q = search.trim();
    navigate(q ? `${ROUTES.GALLERY}?q=${encodeURIComponent(q)}` : ROUTES.GALLERY);
  };

  return (
    <section className="relative min-h-140 w-full overflow-hidden md:min-h-180 xl:min-h-200">
      {SLIDES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          width={1920}
          height={890}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            index === activeSlide ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-linear-to-r from-[#1b1e56]/85 from-28% via-[#1b1e56]/70 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-4 sm:h-6 bg-linear-to-t from-white via-white/30 to-transparent z-10" />

      <div className="relative z-20 mx-auto flex min-h-140 w-full max-w-480 items-center px-4 py-16 sm:px-6 md:min-h-180 md:px-10 xl:min-h-200 xl:px-48">
        <div className="flex w-full max-w-225 flex-col gap-9">
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
              <span className="size-2 rounded-full bg-[#05df72]" />
              <span className="text-sm font-semibold text-white">{t('home.hero.badge')}</span>
            </div>
            <h1 className="text-[36px] leading-[1.15] uppercase [word-spacing:4px] font-bold tracking-tight text-white sm:text-[48px] xl:text-[54px] xl:leading-[64.8px] xl:mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="max-w-180 text-[16px] leading-[1.6] text-white sm:text-[20px] sm:leading-[32.5px]">
              {t('home.hero.subtitle')}
            </p>
          </div>
          <MarketingSearchBar
            className="max-w-180 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSubmit={goToGallery}
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
        {SLIDES.map((src, index) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={index === activeSlide}
            aria-label={t('common.showSlide', { n: index + 1 })}
            onClick={() => setActiveSlide(index)}
            className={`size-3.5 rounded-full transition ${
              index === activeSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
});

HomeHero.displayName = 'HomeHero';

export default HomeHero;
