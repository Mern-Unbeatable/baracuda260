import React from 'react';

const BADGE_COLOR = {
  red: 'text-[#e31837]',
  indigo: 'text-[#666dd7]',
  brand: 'text-[#4048cd]',
  navy: 'text-[#3f51b5]',
};

export default function SectionHeader({
  badge,
  title,
  description,
  badgeTone = 'red',
  align = 'center',
  end = null,
  className = '',
}) {
  const left = align === 'left';
  const wrap = left
    ? 'flex w-full flex-col gap-2.5 items-start text-left'
    : 'mx-auto flex w-full max-w-[682px] flex-col gap-2.5 items-center text-center';

  const copy = (
    <div className={wrap}>
      {badge ? (
        <p
          className={`text-[14px] font-semibold uppercase leading-4 tracking-[1.2px] ${BADGE_COLOR[badgeTone] ?? BADGE_COLOR.red}`}
        >
          {badge}
        </p>
      ) : null}
      {title ? (
        <h2 className="text-[36px] font-semibold leading-tight text-[var(--primary-text-heading-color)] sm:text-[48px] sm:leading-[48px]">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="text-[20px] font-normal leading-[29px] text-[var(--primary-text-color)]">
          {description}
        </p>
      ) : null}
    </div>
  );

  if (end) {
    return (
      <header
        className={`flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between ${className}`.trim()}
      >
        {copy}
        <div className="shrink-0">{end}</div>
      </header>
    );
  }

  return (
    <header className={`w-full ${left ? '' : 'mx-auto'} ${className}`.trim()}>{copy}</header>
  );
}
