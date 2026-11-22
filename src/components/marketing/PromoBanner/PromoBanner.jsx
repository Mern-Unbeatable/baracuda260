import React, { useEffect, useState } from 'react';
import { Shell } from '@/shared/site-chrome';

const SLIDE_MS = 5000;

const PromoBanner = ({
  title,
  subtitle,
  ctaLabel = 'Learn more',
  href = '#',
  image,
  external = false,
  /** When provided, auto-rotates every 5s through these slides. */
  slides,
}) => {
  const items =
    Array.isArray(slides) && slides.length > 0
      ? slides
      : [{ title, subtitle, ctaLabel, href, image, external }];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const slide = items[Math.min(index, items.length - 1)] || items[0];
  const isExternal =
    slide.external ||
    (/^https?:\/\//i.test(slide.href || '') && !(slide.href || '').startsWith('#'));

  return (
    <section className="bg-white py-6 sm:py-8">
      <Shell>
        <div
          className="relative w-full overflow-hidden rounded-[12px] border border-dashed border-[#4b4b4b] bg-cover bg-center transition-[background-image] duration-700"
          style={{
            backgroundImage: `url(${slide.image || '/assets/home/hero.webp'})`,
          }}
        >
          <div className="absolute inset-0 bg-black/45" />
          <div
            key={`${index}-${slide.title || ''}-${slide.ctaLabel || ''}`}
            className="relative flex min-h-[180px] items-center justify-center px-6 py-8 sm:min-h-[220px] sm:px-12 animate-[promo-fade_0.55s_ease]"
          >
            <div className="mx-auto max-w-[860px] text-center text-white">
              {slide.title ? (
                <h2 className="text-[22px] font-semibold leading-tight sm:text-[28px]">
                  {slide.title}
                </h2>
              ) : null}
              {slide.subtitle ? (
                <p
                  className={`text-[18px] leading-[1.55] sm:text-[28px] ${
                    slide.title ? 'mt-2 sm:mt-3' : ''
                  }`}
                >
                  {slide.subtitle}
                </p>
              ) : null}
              {slide.ctaLabel ? (
                <a
                  href={slide.href || '#'}
                  {...(isExternal
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="mt-3 inline-block text-[18px] font-medium text-[#f2c94c] underline decoration-transparent transition hover:decoration-current sm:mt-4 sm:text-[26px]"
                >
                  {slide.ctaLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Shell>
      <style>{`
        @keyframes promo-fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

PromoBanner.displayName = 'PromoBanner';

export default PromoBanner;
