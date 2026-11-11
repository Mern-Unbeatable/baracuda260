import {
  Check,
  ChevronDown,
  Filter,
  Search,
  X,
} from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Compact Category Filter Dropdown with search.
 * Replaces bulky category pill rows with an elegant, compact single-dropdown filter.
 *
 * @param {{
 *   items: Array<{ id: string, value: string, label: string, labelKey?: string }>,
 *   value: string,
 *   onChange: (val: string) => void,
 *   labelPrefix?: string,
 *   ariaLabel?: string,
 *   className?: string,
 *   align?: 'left' | 'right',
 * }} props
 */
const CategoryFilterDropdown = memo(
  ({
    items = [],
    value = 'all',
    onChange,
    labelPrefix = 'Category:',
    ariaLabel = 'Filter products by category',
    className = '',
    align = 'left',
  }) => {
    const rootRef = useRef(null);
    const searchInputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    // Close on outside click or Escape
    useEffect(() => {
      if (!isOpen) return;

      const handlePointerDown = (e) => {
        if (rootRef.current && !rootRef.current.contains(e.target)) {
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

    // Auto focus search input when opened
    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen]);

    // Active item label
    const activeItem = useMemo(() => {
      return (
        items.find((item) => item.value === value || item.id === value) ||
        items[0] || { label: 'All items', value: 'all' }
      );
    }, [items, value]);

    // Filter list by search query
    const filteredItems = useMemo(() => {
      if (!search.trim()) return items;
      const q = search.toLowerCase().trim();
      return items.filter(
        (item) =>
          item.label?.toLowerCase().includes(q) ||
          item.value?.toLowerCase().includes(q)
      );
    }, [items, search]);

    const handleSelect = (val) => {
      onChange(val);
      setIsOpen(false);
      setSearch('');
    };

    const handleReset = (e) => {
      e.stopPropagation();
      onChange('all');
    };

    const isFiltered = value && value !== 'all';

    return (
      <div className={`relative inline-block ${className}`} ref={rootRef}>
        {/* Trigger Button */}
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`inline-flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-[14px] transition cursor-pointer shadow-xs ${
            isOpen || isFiltered
              ? 'border-[#4048cd] bg-[#f8f9fe] text-[#161c27] ring-2 ring-[#4048cd]/15'
              : 'border-[#e2e8f0] bg-white text-[#161c27] hover:border-[#cbd5e1] hover:bg-[#f9fafb]'
          }`}
        >
          <Filter
            size={16}
            className={`transition shrink-0 ${
              isFiltered ? 'text-[#4048cd]' : 'text-[#64748b]'
            }`}
            aria-hidden="true"
          />

          <span className="text-[13px] text-[#64748b] font-normal">
            {labelPrefix}
          </span>

          <span className="font-semibold text-[#111827] max-w-44 truncate sm:max-w-64">
            {activeItem.label}
          </span>

          {isFiltered && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Reset category filter"
              onClick={handleReset}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleReset(e);
              }}
              className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-[#e2e8f0] text-[#64748b] hover:bg-[#ee1c25] hover:text-white transition cursor-pointer"
            >
              <X size={10} strokeWidth={2.5} />
            </span>
          )}

          <ChevronDown
            size={16}
            className={`text-[#64748b] transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-[#4048cd]' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div
            role="listbox"
            aria-label={ariaLabel}
            className={`absolute top-full mt-2 z-40 w-72 sm:w-80 rounded-2xl border border-[#e2e8f0] bg-white p-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.16)] animate-in fade-in zoom-in-95 duration-150 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {/* Search Input */}
            <div className="relative mb-2">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search category..."
                className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8fafc] py-2 pl-9 pr-8 text-[13px] text-[#111827] outline-none placeholder:text-[#94a3b8] focus:border-[#4048cd] focus:bg-white focus:ring-2 focus:ring-[#4048cd]/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#111827] cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Options List */}
            <div className="max-h-68 overflow-y-auto pr-1">
              {filteredItems.length === 0 ? (
                <p className="py-6 text-center text-[13px] text-[#64748b]">
                  No category matches "{search}"
                </p>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {filteredItems.map((item) => {
                    const isSelected =
                      value === item.value ||
                      (value === 'all' && item.value === 'all');
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(item.value || item.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#f0f2fd] font-bold text-[#4048cd]'
                            : 'font-medium text-[#475569] hover:bg-[#f8fafc] hover:text-[#111827]'
                        }`}
                      >
                        <span className="truncate pr-2">{item.label}</span>
                        {isSelected && (
                          <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#4048cd] text-white">
                            <Check size={11} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

CategoryFilterDropdown.displayName = 'CategoryFilterDropdown';

export default CategoryFilterDropdown;

