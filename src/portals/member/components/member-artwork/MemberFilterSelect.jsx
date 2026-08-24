import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useRef } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

const MemberFilterSelect = memo(
  ({
    label,
    value,
    options,
    optionKeyPrefix,
    prefixLabelKey,
    showFilterIcon = true,
    open,
    onToggle,
    onSelect,
    onClose,
  }) => {
    const { t } = useTranslation();
    const rootRef = useRef(null);

    useEffect(() => {
      if (!open) return undefined;

      const onPointerDown = (event) => {
        if (rootRef.current && !rootRef.current.contains(event.target)) onClose();
      };
      const onKeyDown = (event) => {
        if (event.key === 'Escape') onClose();
      };

      document.addEventListener('mousedown', onPointerDown);
      document.addEventListener('keydown', onKeyDown);
      return () => {
        document.removeEventListener('mousedown', onPointerDown);
        document.removeEventListener('keydown', onKeyDown);
      };
    }, [open, onClose]);

    return (
      <div className="relative" ref={rootRef}>
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={onToggle}
          className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#606060] px-4 py-2.5 text-[14px] font-medium text-[#1c1c1c]"
        >
          {showFilterIcon ? (
            <Filter size={16} strokeWidth={2} aria-hidden="true" className="text-[#6b7280]" />
          ) : null}
          {prefixLabelKey ? (
            <span className="text-[#6b7280]">{t(prefixLabelKey)}</span>
          ) : null}
          <span>{t(`${optionKeyPrefix}.${value}`)}</span>
          <ChevronDown
            size={18}
            strokeWidth={2}
            aria-hidden="true"
            className={`transition ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open ? (
          <ul
            role="listbox"
            aria-label={label}
            className="absolute right-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-[10px] border border-black/10 bg-white py-1 shadow-lg sm:min-w-44"
          >
            {options.map((option) => (
              <li key={option} role="option" aria-selected={option === value}>
                <button
                  type="button"
                  onClick={() => onSelect(option)}
                  className={`w-full cursor-pointer whitespace-nowrap px-4 py-2.5 text-left text-[14px] font-medium transition hover:bg-[#ecedfa] ${
                    option === value ? 'bg-[#fde8e9] text-[#ee1c25]' : 'text-[#1c1c1c]'
                  }`}
                >
                  {t(`${optionKeyPrefix}.${option}`)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
);

MemberFilterSelect.displayName = 'MemberFilterSelect';

export default MemberFilterSelect;
