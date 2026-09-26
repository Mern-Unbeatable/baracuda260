import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const AdminBasicStatCard = memo(
  ({
    labelKey,
    value,
    hintKey,
    icon,
    iconBg,
    borderClass = 'border-[#f3f4f6]',
    valueClass = 'text-[#111827]',
    cardClass = '',
    hintClass = 'text-[#9ca3af]',
  }) => {
    const { t } = useTranslation();

    return (
      <article
        className={`rounded-[14px] border bg-white px-5.75 py-5.25 shadow-[0px_1px_2px_rgba(0,0,0,0.06)] ${borderClass} ${cardClass}`}
      >
        <div className="flex items-start justify-between">
          <p className="text-[12px] font-semibold leading-4.5 tracking-[0.24px] text-[#6b7280]">
            {t(labelKey)}
          </p>
          <span
            className={`inline-flex size-8.5 items-center justify-center rounded-[9px] text-[16px] font-bold leading-6 ${iconBg}`}
            aria-hidden="true"
          >
            {icon}
          </span>
        </div>
        <p
          className={`pt-3.5 text-[32px] font-extrabold leading-8 ${valueClass}`}
        >
          {value}
        </p>
        {hintKey && (
          <p
            className={`pt-2 text-[11px] font-semibold leading-[16.5px] ${hintClass}`}
          >
            {t(hintKey)}
          </p>
        )}
      </article>
    );
  },
);

AdminBasicStatCard.displayName = 'AdminBasicStatCard';

export default AdminBasicStatCard;
