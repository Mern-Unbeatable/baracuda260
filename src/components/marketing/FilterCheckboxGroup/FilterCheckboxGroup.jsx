import React, { memo, useState } from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Sidebar / drawer filter list with custom checkbox styling (gallery album type, category).
 * Supports expandable subcategories for hierarchical filtering.
 */
const FilterCheckboxGroup = memo(
  ({ title, options, selected, onToggle, getLabel, className = '', subcategories = {}, defaultExpanded = 'Nature' }) => {
    const [expandedCategory, setExpandedCategory] = useState(defaultExpanded);

    return (
      <div className={className}>
        <h3 className="text-[16px] lg:text-[18px] font-semibold text-[#0d0d14]">
          {title}
        </h3>
        <ul className="mt-3 flex flex-col gap-2.5">
          {options.map((option) => {
            const checked = selected.includes(option);
            const label = getLabel ? getLabel(option) : option;
            const hasSubcategories = subcategories[option] && subcategories[option].length > 0;
            const isExpanded = expandedCategory === option;

            if (hasSubcategories) {
              return (
                <li key={option} className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setExpandedCategory(isExpanded ? null : option)}
                    className="flex items-center justify-between text-[14px] font-medium transition"
                    aria-expanded={isExpanded}
                  >
                    <span className={isExpanded ? 'text-[#ee1c25]' : 'text-[#0d0d14]'}>
                      {label}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={16} strokeWidth={2} className="text-[#ee1c25]" aria-hidden="true" />
                    ) : (
                      <ChevronRight size={16} strokeWidth={2} className="text-[#6b7280]" aria-hidden="true" />
                    )}
                  </button>

                  {isExpanded && (
                    <ul className="flex flex-col gap-2 pl-3">
                      {subcategories[option].map((subOption) => {
                        const subChecked = selected.includes(subOption);
                        const subLabel = getLabel ? getLabel(subOption) : subOption;
                        return (
                          <li key={subOption}>
                            <label className="group flex cursor-pointer items-center gap-2 text-[14px] leading-5 text-[#6b7280]">
                              <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={subChecked}
                                  onChange={() => onToggle(subOption)}
                                  className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                                />
                                <span
                                  className={[
                                    'flex size-4 items-center justify-center rounded-[3px] border transition',
                                    subChecked
                                      ? 'border-[#ee1c25] bg-[#ee1c25]'
                                      : 'border-[#d1d5db] bg-white group-hover:border-[#9ca3af]',
                                  ].join(' ')}
                                  aria-hidden="true"
                                >
                                  {subChecked ? (
                                    <Check size={10} strokeWidth={3} className="text-white" aria-hidden="true" />
                                  ) : null}
                                </span>
                              </span>
                              <span className={subChecked ? 'font-medium text-[#0d0d14]' : ''}>{subLabel}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={option}>
                <label className="group flex cursor-pointer items-center gap-2.5 text-[14px] leading-5 text-[#0d0d14]">
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
                        <Check size={10} strokeWidth={3} className="text-white" aria-hidden="true" />
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
    );
  },
);

FilterCheckboxGroup.displayName = 'FilterCheckboxGroup';

export default FilterCheckboxGroup;
