import React, { memo } from 'react';
import { Check } from 'lucide-react';

/**
 * Sidebar / drawer filter list with custom checkbox styling (gallery album type, category).
 */
const FilterCheckboxGroup = memo(({ title, options, selected, onToggle, getLabel, className = '' }) => (
  <div className={className}>
    <h3 className="text-[18px] font-semibold leading-6 text-[var(--primary-text-heading-color)] sm:text-[20px]">{title}</h3>
    <ul className="mt-4 flex flex-col gap-3.5">
      {options.map((option) => {
        const checked = selected.includes(option);
        const label = getLabel ? getLabel(option) : option;
        return (
          <li key={option}>
            <label className="group flex cursor-pointer items-center gap-2.5 text-[14px] leading-5 text-[#111827]">
              <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(option)}
                  className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                />
                <span
                  className={[
                    'flex size-4 items-center justify-center rounded-[3px] border transition',
                    checked
                      ? 'border-[#ee1c25] bg-[#ee1c25]'
                      : 'border-[#d1d5db] bg-white group-hover:border-[#9ca3af]',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {checked ? (
                    <Check size={11} strokeWidth={3} className="text-white" aria-hidden="true" />
                  ) : null}
                </span>
              </span>
              <span className={checked ? 'font-medium text-[#0d0d14]' : ''}>{label}</span>
            </label>
          </li>
        );
      })}
    </ul>
  </div>
));

FilterCheckboxGroup.displayName = 'FilterCheckboxGroup';

export default FilterCheckboxGroup;
