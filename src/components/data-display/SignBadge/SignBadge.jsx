import React, { memo } from 'react';

const SignBadge = memo(({ slide, blue }) => (
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

export default SignBadge;
