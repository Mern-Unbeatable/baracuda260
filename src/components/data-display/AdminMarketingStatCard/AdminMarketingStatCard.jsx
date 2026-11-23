import { ArrowUpRight } from 'lucide-react';
import React, { memo } from 'react';
import { formatCompactStatValue } from '@/components/data-display/AdminOverviewStatCard/AdminOverviewStatCard';
import {
  CARD_BORDER,
  CARD_SHADOW,
} from '@/portals/admin/data/adminOverviewData';

const AdminMarketingStatCard = memo(
  ({ title, value, percentage, icon: Icon, subtitle, gradient, className = '' }) => (
    <article
      className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-4 sm:p-5 ${CARD_BORDER} ${CARD_SHADOW} ${className}`.trim()}
    >
      <div className="relative z-10 flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm sm:size-10 ${gradient}`}
          >
            {Icon ? <Icon size={18} strokeWidth={2} aria-hidden="true" /> : null}
          </div>
          {percentage != null ? (
            <div className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 sm:text-[12px]">
              <ArrowUpRight size={12} aria-hidden="true" />
              {percentage}%
            </div>
          ) : null}
        </div>

        <div className="mt-auto min-w-0">
          <p className="min-h-8 text-[12px] font-medium uppercase leading-4 tracking-[0.6px] text-[#494453] sm:min-h-0 sm:text-[13px]">
            {title}
          </p>
          <p className="mt-2 truncate text-[22px] font-bold tracking-[-0.64px] text-[#161c27] sm:text-[26px] lg:text-[28px]">
            {formatCompactStatValue(value)}
          </p>
          {subtitle ? (
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-4 text-[#687186] sm:text-[13px]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <div
        className={`pointer-events-none absolute -right-10 -bottom-10 size-28 rounded-full bg-gradient-to-br opacity-5 blur-2xl ${gradient}`}
        aria-hidden="true"
      />
    </article>
  ),
);

AdminMarketingStatCard.displayName = 'AdminMarketingStatCard';

export default AdminMarketingStatCard;
