import React, { memo } from 'react';

const TwelveStoryStrip = memo(({ slides, activeIndex, onSelect }) => (
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

export default TwelveStoryStrip;
