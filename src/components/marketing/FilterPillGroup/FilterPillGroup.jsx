import React, { memo } from 'react';
import { FOCUS_RING } from '@/shared/ui/sectionStyles';

const pillClass = (active) =>
  [
    'cursor-pointer rounded-full px-4 py-2.5 text-center text-[13px] font-semibold transition sm:shrink-0 sm:px-4 sm:py-2 sm:text-[14px]',
    active
      ? 'bg-[#4048cd] text-white shadow-sm'
      : 'bg-[#f3f4f6] text-[#6b7280] hover:bg-[#eceef2] hover:text-[#0d0d14]',
    FOCUS_RING,
  ].join(' ');

const pillClassCompact = (active) =>
  [
    'cursor-pointer rounded-full px-4 py-2 text-[14px] font-semibold capitalize transition',
    active
      ? 'bg-[#4048cd] text-white shadow-sm'
      : 'bg-[#f2f2f2] text-[#6b7280] hover:bg-[#eceef2] hover:text-[#0d0d14]',
    FOCUS_RING,
  ].join(' ');

const FilterPillGroup = memo(
  ({
    items,
    value,
    onChange,
    ariaLabel,
    density = 'default',
    layout = 'default',
    className = '',
    renderLabel,
  }) => {
    const layoutClass =
      layout === 'scroll'
        ? 'flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:gap-3'
        : density === 'default'
          ? 'grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-3 lg:justify-end'
          : 'flex flex-wrap items-center gap-2 sm:gap-4';

    const pillLayoutClass = layout === 'scroll' ? 'shrink-0 whitespace-nowrap' : '';

    return (
      <div
        className={[layoutClass, className].filter(Boolean).join(' ')}
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item) => {
          const active = value === item.value;
          const label = renderLabel ? renderLabel(item, active) : item.label;
          return (
            <button
              key={item.id ?? item.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.value)}
              className={[
                density === 'compact' ? pillClassCompact(active) : pillClass(active),
                pillLayoutClass,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  },
);

FilterPillGroup.displayName = 'FilterPillGroup';

export default FilterPillGroup;
