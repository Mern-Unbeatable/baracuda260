import React, { memo } from 'react';
import { isBlueSlide } from '@/portals/public/gallery/detail/galleryDetailShared';

export const SignBadge = memo(({ slide, blue }) => (
  <div
    className={`absolute left-3 top-3 flex gap-2 rounded-[20px] px-4 py-1 sm:left-6 sm:top-6 sm:px-5 sm:py-1.25 ${
      blue ? 'items-center bg-[#4048cd]' : 'items-end bg-[#ee1c25]'
    }`}
  >
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${
        blue ? 'size-7 sm:size-8.75' : 'h-4.5 w-5 sm:h-5.25 sm:w-6'
      } ${slide.iconBoxed ? 'rounded-sm bg-[#4048cd]' : ''}`}
    >
      <img
        src={slide.icon}
        alt=""
        width={35}
        height={35}
        className={`object-contain ${slide.iconBoxed ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-full w-full'}`}
      />
    </span>
    <span className="text-[16px] leading-none text-white sm:text-[20px]">{slide.sign}</span>
  </div>
));

SignBadge.displayName = 'SignBadge';

export const SixStoryStrip = memo(({ slides, activeIndex, onSelect, stripAccent }) => {
  const blueAccent = stripAccent === 'blue';

  return (
    <div className="mt-2 w-full overflow-x-auto pb-2">
      <div className="flex min-w-245 flex-col gap-2.5 lg:min-w-0">
        <div className="grid grid-cols-6 gap-3 xl:gap-5">
          {slides.map((slide) => (
            <div key={slide.id} className="flex items-center justify-between gap-1">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
                <span
                  className={
                    blueAccent
                      ? `relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden sm:size-8.75 ${
                          slide.iconBoxed ? 'rounded-sm bg-[#4048cd]' : ''
                        }`
                      : 'inline-flex shrink-0 items-end rounded bg-[#ee1c25] px-1.5 py-1 sm:px-2.5 sm:py-1.25'
                  }
                >
                  <img
                    src={slide.icon}
                    alt=""
                    width={35}
                    height={35}
                    className={
                      blueAccent
                        ? `object-contain ${
                            slide.iconBoxed ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-full w-full'
                          }`
                        : 'h-4 w-4.5 object-contain sm:h-5.25 sm:w-6'
                    }
                  />
                </span>
                <span className="truncate text-[13px] text-[#2b2b2b] sm:text-[18px] xl:text-[24px]">
                  {slide.sign}
                </span>
              </div>
              <span
                className={`inline-flex size-6.5 shrink-0 items-center justify-center rounded-full bg-[#fde8e9] text-[14px] sm:size-7.5 sm:text-[20px] ${
                  blueAccent ? 'text-[#4048cd]' : 'text-[#ee1c25]'
                }`}
              >
                {slide.number}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-6 gap-3 xl:gap-5">
          {slides.map((slide, index) => (
            <button
              key={`${slide.id}-thumb`}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Show ${slide.sign}`}
              aria-pressed={index === activeIndex}
              className={`relative h-18 overflow-hidden rounded-lg sm:h-25 xl:h-30 ${
                index === activeIndex
                  ? 'border-[3px] border-[#ee1c25]'
                  : 'border border-transparent'
              }`}
            >
              <img
                src={slide.thumb}
                alt={slide.sign}
                width={240}
                height={120}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

SixStoryStrip.displayName = 'SixStoryStrip';

export const TwelveStoryStrip = memo(({ slides, activeIndex, onSelect }) => (
  <div className="mt-2 w-full overflow-x-auto pb-2">
    <div className="grid min-w-275 grid-cols-12 gap-2 lg:min-w-0 xl:gap-3">
      {slides.map((slide, index) => {
        const blue = slide.theme === 'blue';
        return (
          <div key={slide.id} className="flex flex-col items-center gap-2">
            <div className="flex w-full flex-col items-center gap-2">
              <span
                className={`inline-flex size-6.5 items-center justify-center rounded-full bg-[#fde8e9] text-[14px] sm:size-7.5 sm:text-[18px] ${
                  blue ? 'text-[#4048cd]' : 'text-[#ee1c25]'
                }`}
              >
                {slide.number}
              </span>
              <span
                className={`relative inline-flex size-7 items-center justify-center overflow-hidden sm:size-8.75 ${
                  blue
                    ? slide.iconBoxed
                      ? 'rounded-sm bg-[#4048cd]'
                      : ''
                    : 'rounded bg-[#ee1c25] px-1.5 py-1'
                }`}
              >
                <img
                  src={slide.icon}
                  alt=""
                  width={35}
                  height={35}
                  className={`object-contain ${
                    blue
                      ? slide.iconBoxed
                        ? 'h-4 w-4 sm:h-5 sm:w-5'
                        : 'h-full w-full'
                      : 'h-4 w-4.5 sm:h-5.25 sm:w-6'
                  }`}
                />
              </span>
              <span className="truncate text-center text-[12px] text-[#2b2b2b] sm:text-[14px] xl:text-[16px]">
                {slide.sign}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Show ${slide.sign}`}
              aria-pressed={index === activeIndex}
              className={`relative h-18 w-full overflow-hidden rounded-lg sm:h-25 xl:h-30 ${
                index === activeIndex ? 'border-[3px] border-[#ee1c25]' : 'border border-black/10'
              }`}
            >
              <img
                src={slide.thumb}
                alt={slide.sign}
                width={112}
                height={120}
                className="h-full w-full object-cover"
              />
            </button>
          </div>
        );
      })}
    </div>
  </div>
));

TwelveStoryStrip.displayName = 'TwelveStoryStrip';

export { isBlueSlide };
