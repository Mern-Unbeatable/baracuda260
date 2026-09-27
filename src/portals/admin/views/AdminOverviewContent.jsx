import { ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { selectUser } from '@/app/store/slices/authSlice';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  CARD_BORDER,
  CARD_SHADOW,
  COMMUNITY_COUNTRIES,
  OVERVIEW_STATS_PRIMARY,
  OVERVIEW_STATS_SECONDARY,
  PENDING_SUBMISSIONS,
  REVENUE_DATA,
  REVENUE_PERIODS,
  VISITOR_DATA,
} from '@/portals/admin/data/adminOverviewData';

import AdminOverviewStatCard from '@/components/data-display/AdminOverviewStatCard/AdminOverviewStatCard';

const VisitorChart = memo(() => {
  const { t } = useTranslation();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-[#eef0f4] bg-white px-3.5 py-2.5 shadow-[0px_8px_24px_rgba(23,32,51,0.12)]">
          <p className="text-[11px] font-medium leading-4 text-[#8993a5] uppercase">
            {t(`adminOverview.analytics.months.${label}`)}
          </p>
          <p className="mt-1 text-[15px] font-bold leading-5 text-[#3374E6]">
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <article
      className={`flex min-h-0 flex-col rounded-[18px] bg-white p-5 sm:p-7 ${CARD_BORDER} ${CARD_SHADOW}`}
    >
      <header>
        <h2 className="text-[18px] leading-7 tracking-[-0.5px] text-[#172033] sm:text-[20px]">
          {t('adminOverview.analytics.title')}
        </h2>
        <p className="mt-1.5 text-[14px] leading-5 text-[#696969] sm:text-[16px] sm:leading-5.25">
          {t('adminOverview.analytics.subtitle')}
        </p>
      </header>

      <p className="mt-6 text-[28px] font-extrabold tracking-[-1.2px] text-[#172033] sm:mt-7 sm:text-[32px]">
        {t('adminOverview.analytics.total')}
      </p>

      <div className="mt-4 h-50 flex-1 sm:mt-4 sm:h-55 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={VISITOR_DATA}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="visitor-area-fill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#3374E6" stopOpacity={0.17} />
                <stop offset="95%" stopColor="#3374E6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#edf0f5"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#a2a9b7' }}
              tickFormatter={(val) =>
                t(`adminOverview.analytics.months.${val}`)
              }
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#a2a9b7' }}
              tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#3374E6"
              strokeWidth={3.2}
              fillOpacity={1}
              fill="url(#visitor-area-fill)"
              activeDot={{
                r: 6,
                strokeWidth: 3,
                stroke: '#3374E6',
                fill: 'white',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
});

VisitorChart.displayName = 'VisitorChart';

const PendingBadge = memo(() => {
  const { t } = useTranslation();

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#fff6e9] px-2.5 py-1.5">
      <span className="size-1.5 rounded-sm bg-[#bd7b25]" aria-hidden="true" />
      <span className="text-[13px] font-bold leading-5 text-[#bd7b25] sm:text-[14px]">
        {t('adminOverview.pending.badge')}
      </span>
    </span>
  );
});

PendingBadge.displayName = 'PendingBadge';

const PendingReviewCard = memo(() => {
  const { t } = useTranslation();

  return (
    <article
      className={`flex h-full flex-col rounded-[18px] bg-white p-5 sm:p-7 ${CARD_BORDER} ${CARD_SHADOW}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[18px] leading-7 tracking-[-0.5px] text-[#172033] sm:text-[20px]">
            {t('adminOverview.pending.title')}
          </h2>
          <p className="mt-1.5 text-[13px] leading-5 text-[#8993a5] sm:text-[14px]">
            {t('adminOverview.pending.subtitle')}
          </p>
        </div>
        <Button
          unstyled
          type="button"
          className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-bold text-[#3068d3] transition hover:text-[#2454b0] sm:text-[14px]"
        >
          {t('adminOverview.pending.reviewAll')}
          <ArrowUpRight size={14} aria-hidden="true" />
        </Button>
      </header>

      <ul className="mt-5 flex flex-1 flex-col" role="list">
        {PENDING_SUBMISSIONS.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 border-b border-[#f0f1f4] py-2.5 last:border-b-0 sm:gap-3"
          >
            <div className="relative size-11 shrink-0 overflow-hidden rounded-[9px] bg-[#dce4ed]">
              <Image
                src={item.image}
                alt=""
                width={44}
                height={44}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold leading-5 text-[#172033] sm:text-[16px]">
                {t(item.titleKey)}
              </p>
              <p className="truncate text-[13px] leading-5 text-[#8590a1] sm:text-[14px]">
                {t(item.metaKey)}
              </p>
            </div>
            <PendingBadge />
          </li>
        ))}
      </ul>

      <Button
        unstyled
        type="button"
        className="mt-4 w-full rounded-[9px] bg-[#ee1c25] px-4 py-3 text-[14px] font-bold text-white transition hover:bg-[#d41921]"
      >
        {t('adminOverview.pending.openQueue')}
      </Button>
    </article>
  );
});

PendingReviewCard.displayName = 'PendingReviewCard';

const CommunityReachCard = memo(() => {
  const { t } = useTranslation();

  return (
    <article
      className={`flex flex-col rounded-[18px] bg-white p-5 sm:p-7 ${CARD_BORDER} ${CARD_SHADOW}`}
    >
      <header>
        <h2 className="text-[18px] leading-7 tracking-[-0.5px] text-[#172033] sm:text-[19px]">
          {t('adminOverview.community.title')}
        </h2>
        <p className="mt-1.5 text-[13px] leading-5 text-[#8993a5] sm:text-[14px]">
          {t('adminOverview.community.subtitle')}
        </p>
      </header>

      <ul className="mt-4 flex flex-col gap-4 sm:mt-5 sm:gap-4" role="list">
        {COMMUNITY_COUNTRIES.map((country) => (
          <li
            key={country.id}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
          >
            <div className="flex w-full shrink-0 items-center gap-3 sm:w-40">
              <span
                className={`size-4.5 shrink-0 rounded-[9px] ${country.flagClass}`}
                aria-hidden="true"
              />
              <span className="text-[14px] font-bold leading-5 text-[#172033]">
                {t(country.nameKey)}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#edf0f5]">
                <div
                  className="h-full rounded-full bg-[#4e7ee0]"
                  style={{ width: `${country.percent}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-[12px] font-bold leading-5 text-[#6f7a8f] sm:w-25 sm:text-[13px]">
                {t(country.valueKey)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
});

CommunityReachCard.displayName = 'CommunityReachCard';

const REVENUE_COMMISSION_COLOR = '#F5A623';
const REVENUE_PROMOTED_COLOR = '#34C759';

const RevenueLegendItem = memo(({ color, label, value }) => (
  <span className="inline-flex items-center gap-2">
    <span
      className="size-2.5 rounded-full"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
    <span className="text-[13px] font-semibold text-[#172033] sm:text-[14px]">
      {label}
    </span>
    {value ? (
      <span className="text-[13px] text-[#8993a5] sm:text-[14px]">{value}</span>
    ) : null}
  </span>
));

RevenueLegendItem.displayName = 'RevenueLegendItem';

const RevenuePeriodDropdown = memo(() => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(REVENUE_PERIODS[0].id);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectedOption = REVENUE_PERIODS.find(
    (option) => option.id === selected,
  );

  return (
    <div ref={containerRef} className="relative">
      <Button
        unstyled
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8ebf1] bg-white px-3 py-2 text-[13px] font-semibold text-[#4a5568] transition hover:bg-[#f6f8fb] sm:text-[14px]"
      >
        {t(selectedOption.labelKey)}
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </Button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-[#e8ebf1] bg-white py-1 shadow-[0px_12px_32px_rgba(23,32,51,0.14)]"
        >
          {REVENUE_PERIODS.map((option) => {
            const isSelected = option.id === selected;
            return (
              <li key={option.id}>
                <Button
                  unstyled
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelected(option.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-[13px] transition hover:bg-[#f6f8fb] sm:text-[14px] ${
                    isSelected
                      ? 'font-semibold text-[#172033]'
                      : 'text-[#4a5568]'
                  }`}
                >
                  {t(option.labelKey)}
                  {isSelected ? (
                    <Check
                      size={15}
                      className="text-[#3374E6]"
                      aria-hidden="true"
                    />
                  ) : null}
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
});

RevenuePeriodDropdown.displayName = 'RevenuePeriodDropdown';

const RevenueTrendCard = memo(() => {
  const { t } = useTranslation();
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length === 2) {
      return (
        <div className="rounded-xl border border-[#eef0f4] bg-white px-3.5 py-2.5 shadow-[0px_8px_24px_rgba(23,32,51,0.12)]">
          <p className="text-[11px] font-medium leading-4 text-[#8993a5] uppercase mb-1">
            {t(`adminOverview.analytics.months.${label}`)}
          </p>
          <p className="text-[11px] font-medium leading-4 text-[#8993a5]">
            {t('adminOverview.revenueTrend.commission')}
          </p>
          <p
            className="text-[15px] font-bold leading-5"
            style={{ color: REVENUE_COMMISSION_COLOR }}
          >
            ${payload[0].value.toLocaleString()}
          </p>
          <p className="mt-1.5 text-[11px] font-medium leading-4 text-[#8993a5]">
            {t('adminOverview.revenueTrend.promoted')}
          </p>
          <p
            className="text-[15px] font-bold leading-5"
            style={{ color: REVENUE_PROMOTED_COLOR }}
          >
            ${payload[1].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <article
      className={`flex flex-col rounded-[18px] bg-white p-5 sm:p-7 ${CARD_BORDER} ${CARD_SHADOW}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-semibold leading-7 tracking-[-0.5px] text-[#172033] sm:text-[20px]">
          {t('adminOverview.revenueTrend.title')}
        </h2>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 sm:flex">
            <RevenueLegendItem
              color={REVENUE_COMMISSION_COLOR}
              label={t('adminOverview.revenueTrend.commission')}
            />
            <RevenueLegendItem
              color={REVENUE_PROMOTED_COLOR}
              label={t('adminOverview.revenueTrend.promoted')}
            />
          </div>
          <RevenuePeriodDropdown />
        </div>
      </header>

      <div className="mt-6 h-56 sm:mt-7 sm:h-64 w-full text-[11px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={REVENUE_DATA}
            margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#edf0f5"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#a2a9b7' }}
              tickFormatter={(val) =>
                t(`adminOverview.analytics.months.${val}`)
              }
              dy={10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#c9ced8',
                strokeWidth: 1.5,
                strokeDasharray: '7 7',
              }}
            />
            <Line
              type="monotone"
              dataKey="commission"
              stroke={REVENUE_COMMISSION_COLOR}
              strokeWidth={3.2}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 3,
                stroke: REVENUE_COMMISSION_COLOR,
                fill: 'white',
              }}
            />
            <Line
              type="monotone"
              dataKey="promoted"
              stroke={REVENUE_PROMOTED_COLOR}
              strokeWidth={3.2}
              dot={false}
              activeDot={{
                r: 6,
                strokeWidth: 3,
                stroke: REVENUE_PROMOTED_COLOR,
                fill: 'white',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center gap-5 sm:hidden">
        <RevenueLegendItem
          color={REVENUE_COMMISSION_COLOR}
          label={t('adminOverview.revenueTrend.commission')}
        />
        <RevenueLegendItem
          color={REVENUE_PROMOTED_COLOR}
          label={t('adminOverview.revenueTrend.promoted')}
        />
      </div>
    </article>
  );
});

RevenueTrendCard.displayName = 'RevenueTrendCard';

/**
 * Admin Overview main content — Figma node 339:1136 (content column).
 */
const AdminOverviewContent = memo(() => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const displayName = (
    user?.fullName ||
    user?.name ||
    user?.username ||
    t('adminOverview.defaultName')
  ).toUpperCase();

  return (
    <div className="flex w-full flex-col gap-8 sm:gap-10">
      <AdminPageHeader
        eyebrow={t('adminOverview.greeting', { name: displayName })}
        title={t('adminOverview.title')}
        description={t('adminOverview.subtitle')}
      />

      <section
        aria-label={t('adminOverview.stats.aria')}
        className="flex flex-col gap-4 xl:gap-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-5">
          {OVERVIEW_STATS_PRIMARY.map((stat) => (
            <AdminOverviewStatCard
              key={stat.id}
              labelKey={stat.labelKey}
              valueKey={stat.valueKey}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5">
          {OVERVIEW_STATS_SECONDARY.map((stat) => (
            <AdminOverviewStatCard
              key={stat.id}
              labelKey={stat.labelKey}
              valueKey={stat.valueKey}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-5">
        <VisitorChart />
        <PendingReviewCard />
      </section>

      <RevenueTrendCard />

      <CommunityReachCard />
    </div>
  );
});

AdminOverviewContent.displayName = 'AdminOverviewContent';

export default AdminOverviewContent;
