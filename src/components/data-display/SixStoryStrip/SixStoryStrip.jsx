import React, { memo } from 'react';

const SixStoryStrip = memo(({ slides, activeIndex, onSelect, stripAccent }) => {
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

export default SixStoryStrip;
