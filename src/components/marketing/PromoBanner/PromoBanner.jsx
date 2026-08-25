import React from 'react';
import { Shell } from '@/shared/site-chrome';

const PromoBanner = ({ title, subtitle, ctaLabel = 'Learn more', href = '#', image }) => {
  return (
    <section className="bg-white py-6 sm:py-8">
      <Shell>
        <div
          className="relative w-full overflow-hidden rounded-[12px] border border-dashed border-[#4b4b4b] bg-cover bg-center"
          style={{
            backgroundImage: `url(${image || '/assets/home/hero.jpg'})`,
          }}
        >
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative flex min-h-[180px] items-center justify-center px-6 py-8 sm:min-h-[220px] sm:px-12">
            <div className="mx-auto max-w-[860px] text-center text-white">
              {title ? (
                <h2 className="text-[30px] font-semibold leading-tight sm:text-[40px]">
                  {title}
                </h2>
              ) : null}
              {subtitle ? (
                <p className="text-[20px] leading-[1.55] sm:text-[34px]">{subtitle}</p>
              ) : null}
              <a
                href={href}
                className="mt-3 inline-block text-[18px] font-medium text-[#f2c94c] underline decoration-transparent transition hover:decoration-current sm:mt-4 sm:text-[30px]"
              >
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
};

PromoBanner.displayName = 'PromoBanner';

export default PromoBanner;

