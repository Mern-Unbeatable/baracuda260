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
        <ul className="mt-1 flex flex-col gap-0">
          {options.map((option) => {
            const checked = selected.includes(option);
            const label = getLabel ? getLabel(option) : option;
            const hasSubcategories = subcategories[option] && subcategories[option].length > 0;
            const isExpanded = expandedCategory === option;

            if (hasSubcategories) {
              return (
                <li key={option} className="flex flex-col gap-1.5 border-b border-[#e5e7eb] pb-1.5">
                  <button
                    type="button"
                    onClick={() => setExpandedCategory(isExpanded ? null : option)}
                    className="flex items-center justify-between rounded-md px-1 py-1.5 text-[14px] font-medium transition duration-200 hover:bg-[#f3f4f6]"
                    aria-expanded={isExpanded}
                  >
                    <span className={`transition-colors duration-200 ${isExpanded ? 'text-[#ee1c25]' : 'text-[#0d0d14]'}`}>
                      {label}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={16} strokeWidth={2} className="transition-all duration-300 text-[#ee1c25]" aria-hidden="true" />
                    ) : (
                      <ChevronRight size={16} strokeWidth={2} className="transition-all duration-300 text-[#6b7280]" aria-hidden="true" />
                    )}
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: isExpanded ? '500px' : '0px',
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <ul className="flex flex-col gap-1 pl-3 pt-1.5">
                      {subcategories[option].map((subOption) => {
                        const subChecked = selected.includes(subOption);
                        const subLabel = getLabel ? getLabel(subOption) : subOption;
                        return (
                          <li key={subOption} className="transition-all duration-200">
                            <label className="group flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-[14px] leading-5 text-[#6b7280] transition-colors duration-200 hover:bg-[#f3f4f6]">
                              <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={subChecked}
                                  onChange={() => onToggle(subOption)}
                                  className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                                />
                                <span
                                  className={[
                                    'flex size-4 items-center justify-center rounded-[3px] border transition-all duration-200',
                                    subChecked
                                      ? 'border-[#ee1c25] bg-[#ee1c25] scale-95'
                                      : 'border-[#d1d5db] bg-white group-hover:border-[#9ca3af] scale-100',
                                  ].join(' ')}
                                  aria-hidden="true"
                                >
                                  {subChecked ? (
                                    <Check size={10} strokeWidth={3} className="text-white" aria-hidden="true" />
                                  ) : null}
                                </span>
                              </span>
                              <span className={`transition-colors duration-200 ${subChecked ? 'font-medium text-[#0d0d14]' : ''}`}>{subLabel}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={option} className="transition-all duration-200">
                <label className="group flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-[14px] font-medium leading-5 text-[#0d0d14] transition-colors duration-200 hover:bg-[#f3f4f6]">
                  <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(option)}
                      className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                    />
                    <span
                      className={[
                        'flex size-4 items-center justify-center rounded-[3px] border transition-all duration-200',
                        checked
                          ? 'border-[#ee1c25] bg-[#ee1c25] scale-95'
                          : 'border-[#d1d5db] bg-white group-hover:border-[#9ca3af] scale-100',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      {checked ? (
                        <Check size={10} strokeWidth={3} className="text-white" aria-hidden="true" />
                      ) : null}
                    </span>
                  </span>
                  <span className="transition-colors duration-200">{label}</span>
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
