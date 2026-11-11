import {
  Check,
  ChevronDown,
  Search,
  Tag,
  X,
} from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Modern multi-category selector with tags, search, and checkbox popover.
 * Replaces bulky multi-line button blocks with a clean, compact UI.
 *
 * @param {{
 *   options: Array<{ id: string, value: string, label: string, labelKey?: string }>,
 *   selected: string[],
 *   onChange: (selected: string[]) => void,
 *   label?: string,
 *   required?: boolean,
 *   placeholder?: string,
 *   error?: string,
 *   hint?: string,
 *   renderLabel?: (option: any) => string,
 * }} props
 */
const CategoryMultiSelect = memo(
  ({
    options = [],
    selected = [],
    onChange,
    label,
    required = false,
    placeholder = 'Click to select categories...',
    error,
    hint,
    renderLabel,
  }) => {
    const containerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Close on click outside or Escape
    useEffect(() => {
      if (!isOpen) return;

      const handlePointerDown = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen]);

    const getOptionLabel = (val) => {
      const match = options.find((o) => o.value === val || o.id === val);
      if (!match) return val;
      return renderLabel ? renderLabel(match) : match.label || match.value;
    };

    const toggleOption = (val) => {
      if (selected.includes(val)) {
        onChange(selected.filter((item) => item !== val));
      } else {
        onChange([...selected, val]);
      }
    };

    const removeOption = (val, e) => {
      e?.stopPropagation?.();
      onChange(selected.filter((item) => item !== val));
    };

    const clearAll = (e) => {
      e?.stopPropagation?.();
      onChange([]);
    };

    const selectAll = (e) => {
      e?.stopPropagation?.();
      onChange(options.map((o) => o.value));
    };

    // Filter options by search query
    const filteredOptions = useMemo(() => {
      if (!search.trim()) return options;
      const q = search.toLowerCase().trim();
      return options.filter((o) => {
        const lbl = renderLabel ? renderLabel(o) : o.label || o.value;
        return lbl.toLowerCase().includes(q) || o.value.toLowerCase().includes(q);
      });
    }, [options, search, renderLabel]);

    return (
      <div className="relative w-full" ref={containerRef}>
        {/* Header label and counter */}
        {label && (
          <div className="mb-2 flex flex-wrap items-center justify-between gap-1">
            <label className="text-[14px] font-semibold tracking-[-0.2px] text-[#161c27]">
              {label} {required && <span className="text-[#ee1c25]">*</span>}
            </label>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition ${
                selected.length > 0
                  ? 'bg-[#eef0fc] text-[#4048cd]'
                  : 'bg-[#f1f5f9] text-[#64748b]'
              }`}
            >
              {selected.length > 0 ? `${selected.length} marked` : 'None marked'}
            </span>
          </div>
        )}

        {/* Trigger Field */}
        <div
          role="button"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
          className={`flex min-h-[50px] w-full cursor-pointer items-center justify-between gap-2 rounded-[12px] border bg-white p-2.5 sm:px-3.5 transition ${
            error
              ? 'border-red-400 ring-2 ring-red-100'
              : isOpen
                ? 'border-[#4048cd] ring-3 ring-[#4048cd]/15'
                : 'border-[#e4e8f8] hover:border-[#cbd5e1]'
          }`}
        >
          {selected.length === 0 ? (
            <div className="flex items-center gap-2 text-[14px] text-[#9aa3b5]">
              <Tag size={16} className="text-[#8b93a7]" aria-hidden="true" />
              <span>{placeholder}</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 py-0.5">
              {selected.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d6dbf8] bg-[#f0f2fd] px-3 py-1 text-[12px] font-bold text-[#3b43b6] transition hover:bg-[#e6e9fc]"
                >
                  <span>{getOptionLabel(val)}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${val}`}
                    onClick={(e) => removeOption(val, e)}
                    className="flex size-3.5 items-center justify-center rounded-full text-[#6b75b8] hover:bg-[#d6dbf8] hover:text-[#111827]"
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#cbd5e1] px-2.5 py-1 text-[11px] font-bold text-[#64748b] transition hover:border-[#4048cd] hover:text-[#4048cd]"
              >
                + Add more
              </button>
            </div>
          )}

          <div className="flex shrink-0 items-center gap-1.5 pl-2">
            {selected.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[12px] font-semibold text-[#8b93a7] hover:text-red-500 transition mr-1"
              >
                Clear
              </button>
            )}
            <ChevronDown
              size={17}
              className={`text-[#8b93a7] transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#4048cd]' : ''
              }`}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Dropdown Popover */}
        {isOpen && (
          <div
            role="listbox"
            aria-multiselectable="true"
            className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-[#e2e8f0] bg-white p-3.5 shadow-[0_16px_48px_rgba(15,23,42,0.14)] animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Search Input inside popover */}
            <div className="relative mb-2.5">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                aria-hidden="true"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search category (e.g. Street Wall Art, Decor)..."
                autoFocus
                className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-2 pl-9 pr-8 text-[13px] text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#4048cd] focus:bg-white focus:ring-2 focus:ring-[#4048cd]/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#111827]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className="mb-2 flex items-center justify-between border-b border-[#f1f5f9] px-1 pb-2 text-[12px]">
              <span className="font-semibold text-[#64748b]">
                {selected.length} of {options.length} categories marked
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="font-bold text-[#4048cd] hover:underline"
                >
                  Select all
                </button>
                <span className="text-[#cbd5e1]">•</span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="font-semibold text-[#64748b] hover:text-red-500"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Scrollable Category Checkbox List (2 columns on sm+) */}
            <div className="max-h-64 overflow-y-auto pr-1">
              {filteredOptions.length === 0 ? (
                <p className="py-8 text-center text-[13px] text-[#64748b]">
                  No category matches "{search}"
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {filteredOptions.map((opt) => {
                    const isChecked = selected.includes(opt.value);
                    const optLabel = renderLabel ? renderLabel(opt) : opt.label || opt.value;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="option"
                        aria-selected={isChecked}
                        onClick={() => toggleOption(opt.value)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] transition cursor-pointer ${
                          isChecked
                            ? 'border border-[#d6dbf8] bg-[#f0f2fd] font-bold text-[#3b43b6]'
                            : 'border border-transparent bg-white font-medium text-[#475569] hover:bg-[#f8fafc] hover:text-[#111827]'
                        }`}
                      >
                        <span className="truncate pr-2">{optLabel}</span>
                        <span
                          className={`flex size-4.5 shrink-0 items-center justify-center rounded-md border transition ${
                            isChecked
                              ? 'border-[#4048cd] bg-[#4048cd] text-white'
                              : 'border-[#cbd5e1] bg-white'
                          }`}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-[#f1f5f9] pt-2.5">
              <span className="text-[12px] text-[#64748b]">
                Click outside to finish
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-xl bg-[#4048cd] px-5 py-1.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#343bb0] active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Error or Hint message */}
        {error ? (
          <p className="mt-1.5 text-[12px] font-medium text-red-500">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-[12px] text-[#8b93a7]">{hint}</p>
        ) : null}
      </div>
    );
  },
);

CategoryMultiSelect.displayName = 'CategoryMultiSelect';

export default CategoryMultiSelect;

