import { Check, ChevronDown, Search, X } from 'lucide-react';
import React, { memo, useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * Searchable Combobox / Typeahead Dropdown.
 * Allows selecting from a dropdown list OR typing to search in real time.
 * Also supports custom text input when allowCustom is true.
 *
 * @param {{
 *   id?: string,
 *   value?: string,
 *   onChange: (val: string, item?: any) => void,
 *   options?: Array<{ value: string, label: string, flag?: string, subLabel?: string }>,
 *   placeholder?: string,
 *   disabled?: boolean,
 *   allowCustom?: boolean,
 *   error?: any,
 *   maxResults?: number,
 *   emptyMessage?: string,
 *   className?: string,
 *   inputClassName?: string,
 *   ariaLabel?: string,
 * }} props
 */
const SearchableCombobox = memo(
  ({
    id: propId,
    value = '',
    onChange,
    options = [],
    placeholder = 'Select or type...',
    disabled = false,
    allowCustom = true,
    error,
    maxResults = 60,
    emptyMessage = 'No options found',
    className = '',
    inputClassName = '',
    ariaLabel,
  }) => {
    const autoId = useId();
    const id = propId || autoId;
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value || '');
    const [highlightIndex, setHighlightIndex] = useState(-1);

    // Keep query synced with external value changes
    useEffect(() => {
      setQuery(value || '');
    }, [value]);

    // Close on click outside or Escape
    useEffect(() => {
      if (!isOpen) return;

      const handlePointerDown = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
          // If not allowCustom and no exact match, revert query to current value
          if (!allowCustom) {
            const exact = options.find(
              (o) =>
                (o?.value || '').toLowerCase() === (query || '').toLowerCase() ||
                (o?.label || '').toLowerCase() === (query || '').toLowerCase(),
            );
            if (!exact) {
              setQuery(value || '');
            }
          }
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
    }, [isOpen, allowCustom, options, query, value]);

    // Filter options based on query
    const filteredOptions = useMemo(() => {
      const q = (query || '').trim().toLowerCase();
      if (!q) return options.slice(0, maxResults);

      // Support common shortcuts like "UK" -> United Kingdom, "USA" -> United States
      const results = [];
      for (const opt of options) {
        const label = (opt.label || opt.value || '').toLowerCase();
        const val = (opt.value || '').toLowerCase();
        const code = (opt.isoCode || opt.code || '').toLowerCase();

        let matches =
          label.includes(q) || val.includes(q) || (code && code === q);

        if (!matches && q === 'uk' && (code === 'gb' || label.includes('united kingdom'))) {
          matches = true;
        }
        if (!matches && q === 'usa' && (code === 'us' || label.includes('united states'))) {
          matches = true;
        }

        if (matches) {
          results.push(opt);
          if (results.length >= maxResults) break;
        }
      }
      return results;
    }, [options, query, maxResults]);

    // Find if the currently typed query has an exact match in the options
    const matchedOption = useMemo(() => {
      const q = (query || '').trim().toLowerCase();
      if (!q) return null;
      return options.find(
        (o) =>
          (o?.value || '').toLowerCase() === q ||
          (o?.label || '').toLowerCase() === q,
      );
    }, [options, query]);

    const handleSelectOption = (option) => {
      const newVal = option.value;
      setQuery(option.label || option.value);
      onChange?.(newVal, option);
      setIsOpen(false);
      setHighlightIndex(-1);
    };

    const handleInputChange = (e) => {
      const val = e.target.value;
      setQuery(val);
      setIsOpen(true);
      setHighlightIndex(0);
      if (allowCustom) {
        onChange?.(val, null);
      }
    };

    const handleClear = (e) => {
      e.stopPropagation();
      setQuery('');
      onChange?.('', null);
      setIsOpen(true);
      setHighlightIndex(-1);
      inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightIndex(0);
        } else {
          setHighlightIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0,
          );
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightIndex(filteredOptions.length - 1);
        } else {
          setHighlightIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1,
          );
        }
      } else if (e.key === 'Enter') {
        if (isOpen && highlightIndex >= 0 && filteredOptions[highlightIndex]) {
          e.preventDefault();
          handleSelectOption(filteredOptions[highlightIndex]);
        } else if (allowCustom && query) {
          setIsOpen(false);
        }
      }
    };

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightIndex];
        if (item) {
          item.scrollIntoView({ block: 'nearest' });
        }
      }
    }, [highlightIndex]);

    return (
      <div className={`relative w-full ${className}`} ref={containerRef}>
        <div className="relative flex items-center">
          <input
            id={id}
            ref={inputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={`${id}-listbox`}
            aria-label={ariaLabel}
            disabled={disabled}
            value={query}
            placeholder={placeholder}
            autoComplete="off"
            onClick={() => {
              if (!disabled) setIsOpen(true);
            }}
            onFocus={() => {
              if (!disabled) setIsOpen(true);
            }}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={
              inputClassName ||
              `h-12 w-full rounded-[10px] border bg-white px-4 pr-16 text-[15px] text-[#151e31] outline-none transition placeholder:text-[#9aa3b5] ${
                error
                  ? 'border-red-400 ring-2 ring-red-100'
                  : isOpen
                    ? 'border-[#4048cd] ring-2 ring-[#4048cd]/20'
                    : 'border-[#e4e8f8] hover:border-[#cbd5e1]'
              } ${disabled ? 'cursor-not-allowed bg-gray-50 opacity-60' : ''}`
            }
          />

          <div className="absolute right-2.5 flex items-center gap-1 text-gray-400">
            {query && !disabled ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear"
                className="flex size-6 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X size={14} />
              </button>
            ) : null}

            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setIsOpen((prev) => !prev);
                  inputRef.current?.focus();
                }
              }}
              className={`flex size-7 cursor-pointer items-center justify-center rounded-md hover:text-gray-700 transition ${
                isOpen ? 'rotate-180 text-[#4048cd]' : ''
              }`}
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {error && typeof error === 'string' ? (
          <p className="mt-1 text-[11px] text-red-500">{error}</p>
        ) : null}

        {isOpen && !disabled && (
          <div
            id={`${id}-listbox`}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-64 overflow-hidden rounded-xl border border-[#e4e8f8] bg-white shadow-xl animate-in fade-in duration-100"
          >
            {filteredOptions.length > 0 ? (
              <ul
                ref={listRef}
                className="scrollbar-white max-h-60 overflow-y-auto p-1.5"
              >
                {filteredOptions.map((opt, idx) => {
                  const isSelected =
                    (opt?.value || '').toLowerCase() === (value || '').toLowerCase() ||
                    (opt?.label || '').toLowerCase() === (value || '').toLowerCase();
                  const isHighlighted = idx === highlightIndex;

                  return (
                    <li
                      key={`${opt.value}-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectOption(opt)}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[14px] transition ${
                        isSelected
                          ? 'bg-[#eef0fc] font-semibold text-[#4048cd]'
                          : isHighlighted
                            ? 'bg-gray-100 text-[#151e31]'
                            : 'text-[#333] hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {opt.flag ? (
                          <span className="shrink-0 text-base leading-none" aria-hidden="true">
                            {opt.flag}
                          </span>
                        ) : null}
                        <span className="truncate">{opt.label || opt.value}</span>
                        {opt.subLabel ? (
                          <span className="text-[12px] text-gray-400 truncate">
                            ({opt.subLabel})
                          </span>
                        ) : null}
                      </div>

                      {isSelected ? (
                        <Check size={16} className="shrink-0 text-[#4048cd]" />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                <p>{emptyMessage}</p>
                {allowCustom && query ? (
                  <p className="mt-1 text-xs text-gray-400">
                    Press outside or keep typing to use &quot;{query}&quot;
                  </p>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

SearchableCombobox.displayName = 'SearchableCombobox';

export default SearchableCombobox;
