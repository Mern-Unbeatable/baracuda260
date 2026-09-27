import React, { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';

const AdminMarketingStatCard = memo(
  ({ title, value, percentage, icon: Icon, subtitle, gradient }) => (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-[0px_4px_20px_-4px_rgba(22,28,39,0.05)] transition-all hover:shadow-[0px_8px_30px_-4px_rgba(22,28,39,0.1)]">
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div
            className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}
          >
            {Icon && <Icon size={24} strokeWidth={2} />}
          </div>
          {percentage != null && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
              <ArrowUpRight size={16} />
              {percentage}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="font-manrope text-3xl font-bold tracking-tight text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
          </div>
          {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div
        className={`absolute -bottom-12 -right-12 size-32 rounded-full bg-gradient-to-br ${gradient} opacity-5 blur-2xl`}
      />
    </div>
  ),
);

AdminMarketingStatCard.displayName = 'AdminMarketingStatCard';

export default AdminMarketingStatCard;
