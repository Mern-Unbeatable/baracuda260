import { ChevronDown, Filter } from 'lucide-react';
import React, { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PortalDropdown from '@/components/common/PortalDropdown/PortalDropdown';
import Button from '@/components/ui/Button';

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
    const buttonWrapRef = useRef(null);
    const buttonRef = useRef(null);

    return (
      <div className="relative shrink-0" ref={buttonWrapRef}>
        <Button
          unstyled
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={onToggle}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border border-[#606060] bg-white px-4 py-2.5 text-[14px] font-medium leading-5 text-[#1c1c1c]"
        >
          {showFilterIcon ? (
            <Filter
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="shrink-0 text-[#6b7280]"
            />
          ) : null}
          {prefixLabelKey ? (
            <span className="shrink-0 leading-5 text-[#6b7280]">
              {t(prefixLabelKey)}
            </span>
          ) : null}
          <span className="leading-5">{t(`${optionKeyPrefix}.${value}`)}</span>
          <ChevronDown
            size={18}
            strokeWidth={2}
            aria-hidden="true"
            className={`shrink-0 transition ${open ? 'rotate-180' : ''}`}
          />
        </Button>
        <PortalDropdown
          open={open}
          onClose={onClose}
          buttonRef={buttonRef}
          buttonWrapRef={buttonWrapRef}
          width={200}
          role="listbox"
          aria-label={label}
          className="overflow-hidden rounded-[10px] border border-black/10 bg-white py-1 shadow-lg"
        >
          {options.map((option) => (
            <Button
              unstyled
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => onSelect(option)}
              className={`w-full cursor-pointer whitespace-nowrap px-4 py-2.5 text-left text-[14px] font-medium leading-5 transition hover:bg-[#ecedfa] ${
                option === value
                  ? 'bg-[#fde8e9] text-[#ee1c25]'
                  : 'text-[#1c1c1c]'
              }`}
            >
              {t(`${optionKeyPrefix}.${option}`)}
            </Button>
          ))}
        </PortalDropdown>
      </div>
    );
  },
);

MemberFilterSelect.displayName = 'MemberFilterSelect';

export default MemberFilterSelect;
