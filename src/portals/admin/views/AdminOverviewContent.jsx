import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { selectUser } from '@/app/store/slices/authSlice';
import {
  ADMIN_OVERVIEW_ASSETS,
  CARD_BORDER,
  CARD_SHADOW,
  CHART_MONTHS,
  CHART_Y_LABELS,
  COMMUNITY_COUNTRIES,
  OVERVIEW_STATS_PRIMARY,
  OVERVIEW_STATS_SECONDARY,
  PENDING_SUBMISSIONS,
  REVENUE_CHART,
  REVENUE_PERIODS,
} from '@/portals/admin/data/adminOverviewData';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';

/** Smooth line path (horizontal-tangent cubic beziers) through equally spaced points. */
const buildLinePath = (values, width) => {
  const step = width / (values.length - 1);
  return values.reduce((acc, y, i) => {
    const x = i * step;
    if (i === 0) return `M ${x} ${y}`;
    const prevX = (i - 1) * step;
    const prevY = values[i - 1];
    const midX = (prevX + x) / 2;
    return `${acc} C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
  }, '');
};

const StatCard = memo(({ labelKey, valueKey }) => {
  const { t } = useTranslation();

  return (
    <article
      className={`flex min-w-0 flex-1 flex-col rounded-2xl bg-white p-5 sm:p-6 ${CARD_BORDER} ${CARD_SHADOW}`}
    >
      <p className="text-[15px] leading-6 text-[#7a8497] sm:text-[16px]">{t(labelKey)}</p>
      <p className="mt-3 text-[26px] font-bold leading-tight tracking-[-1.2px] text-[#172033] sm:mt-4 sm:text-[30px]">
        {t(valueKey)}
      </p>
    </article>
  );
});

StatCard.displayName = 'StatCard';

const VisitorChart = memo(() => {
  const { t } = useTranslation();

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

      <div className="relative mt-4 min-h-50 flex-1 pl-7 sm:mt-4 sm:min-h-55 sm:pl-9">
        <div className="absolute inset-y-0 left-0 flex w-6 flex-col justify-between py-1 sm:w-8">
          {CHART_Y_LABELS.map((label) => (
            <span key={label} className="text-[11px] leading-4 text-[#a2a9b7] sm:text-[12px]">
              {label}
            </span>
          ))}
        </div>

        <div className="relative h-45 w-full border-b border-[#edf0f5] sm:h-51">
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-1" aria-hidden="true">
            {[0, 1, 2, 3].map((line) => (
              <div key={line} className="h-px w-full bg-[#edf0f5]" />
            ))}
          </div>

          <svg
            viewBox="0 0 838 194"
            className="absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="none"
            role="img"
            aria-label={t('adminOverview.analytics.title')}
          >
            <defs>
              <linearGradient id="visitor-area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3374E6" stopOpacity="0.17" />
                <stop offset="100%" stopColor="#3374E6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 155.312C58.874 135.054 83.7319 146.308 130.831 118.172C177.93 90.0358 196.247 126.05 235.496 94.5376C274.745 63.0251 308.761 106.918 345.394 75.405C382.027 43.8925 400.343 109.168 450.059 81.0323C499.775 52.8961 528.557 85.534 565.19 48.3943C601.823 11.2545 638.456 75.405 682.938 36.0143C727.421 -3.37634 745.737 40.5161 837.319 0V193.577H0V155.312Z"
              fill="url(#visitor-area-fill)"
            />
            <path
              d="M0.592223 156.976C59.4662 136.718 84.3241 147.973 131.423 119.837C178.522 91.7004 196.839 127.715 236.088 96.2022C275.337 64.6896 309.354 108.582 345.986 77.0696C382.619 45.557 400.935 110.833 450.651 82.6968C500.367 54.5606 529.15 87.1986 565.782 50.0588C602.415 12.919 639.048 77.0696 683.53 37.6789C728.013 -1.7118 746.329 42.1807 837.911 1.66454"
              fill="none"
              stroke="#3374E6"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="532"
              y1="55"
              x2="532"
              y2="194"
              stroke="#3374E6"
              strokeWidth="1.5"
              strokeDasharray="8 8"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx="532"
              cy="55"
              r="6"
              fill="white"
              stroke="#3374E6"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <div className="mt-2 flex items-start justify-between gap-1">
          {CHART_MONTHS.map((month, index) => (
            <span
              key={month}
              className={`text-[10px] leading-4 sm:text-[11px] sm:leading-4.25 ${
                index === 7 ? 'font-semibold text-[#3374E6]' : 'text-[#a2a9b7]'
              }`}
            >
              {t(`adminOverview.analytics.months.${month}`)}
            </span>
          ))}
        </div>
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
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-bold text-[#3068d3] transition hover:text-[#2454b0] sm:text-[14px]"
        >
          {t('adminOverview.pending.reviewAll')}
          <ArrowUpRight size={14} aria-hidden="true" />
        </button>
      </header>

      <ul className="mt-5 flex flex-1 flex-col" role="list">
        {PENDING_SUBMISSIONS.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 border-b border-[#f0f1f4] py-2.5 last:border-b-0 sm:gap-3"
          >
            <div className="relative size-11 shrink-0 overflow-hidden rounded-[9px] bg-[#dce4ed]">
              <img
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

      <button
        type="button"
        className="mt-4 w-full rounded-[9px] bg-[#ee1c25] px-4 py-3 text-[14px] font-bold text-white transition hover:bg-[#d41921]"
      >
        {t('adminOverview.pending.openQueue')}
      </button>
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
    <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
    <span className="text-[13px] font-semibold text-[#172033] sm:text-[14px]">{label}</span>
    {value ? <span className="text-[13px] text-[#8993a5] sm:text-[14px]">{value}</span> : null}
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
      if (containerRef.current && !containerRef.current.contains(event.target)) {
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

  const selectedOption = REVENUE_PERIODS.find((option) => option.id === selected);

  return (
    <div ref={containerRef} className="relative">
      <button
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
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-[#e8ebf1] bg-white py-1 shadow-[0px_12px_32px_rgba(23,32,51,0.14)]"
        >
          {REVENUE_PERIODS.map((option) => {
            const isSelected = option.id === selected;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelected(option.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-[13px] transition hover:bg-[#f6f8fb] sm:text-[14px] ${
                    isSelected ? 'font-semibold text-[#172033]' : 'text-[#4a5568]'
                  }`}
                >
                  {t(option.labelKey)}
                  {isSelected ? <Check size={15} className="text-[#3374E6]" aria-hidden="true" /> : null}
                </button>
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
  const { viewBox, markerIndex, yLabels, commission, promoted } = REVENUE_CHART;
  const { width, height } = viewBox;
  const step = width / (commission.length - 1);
  const markerX = markerIndex * step;
  const commissionPath = buildLinePath(commission, width);
  const promotedPath = buildLinePath(promoted, width);
  const commissionValue = t('adminOverview.revenueTrend.commissionValue');
  const promotedValue = t('adminOverview.revenueTrend.promotedValue');
  const tooltipLeft = `${(markerX / width) * 100}%`;

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

      <div className="relative mt-6 pl-11 sm:mt-7 sm:pl-14">
        <div className="absolute inset-y-0 left-0 flex w-9 flex-col justify-between py-1 sm:w-12">
          {yLabels.map((label) => (
            <span key={label} className="text-[10px] leading-4 text-[#a2a9b7] sm:text-[11px]">
              {label}
            </span>
          ))}
        </div>

        <div className="relative h-56 w-full sm:h-64">
          <div
            className="pointer-events-none absolute inset-0 flex flex-col justify-between py-1"
            aria-hidden="true"
          >
            {yLabels.map((label) => (
              <div key={label} className="h-px w-full bg-[#edf0f5]" />
            ))}
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="none"
            role="img"
            aria-label={t('adminOverview.revenueTrend.title')}
          >
            <defs>
              <linearGradient id="revenue-commission-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={REVENUE_COMMISSION_COLOR} stopOpacity="0.16" />
                <stop offset="100%" stopColor={REVENUE_COMMISSION_COLOR} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="revenue-promoted-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={REVENUE_PROMOTED_COLOR} stopOpacity="0.14" />
                <stop offset="100%" stopColor={REVENUE_PROMOTED_COLOR} stopOpacity="0" />
              </linearGradient>
            </defs>

            <path d={`${commissionPath} L ${width} ${height} L 0 ${height} Z`} fill="url(#revenue-commission-fill)" />
            <path d={`${promotedPath} L ${width} ${height} L 0 ${height} Z`} fill="url(#revenue-promoted-fill)" />

            <line
              x1={markerX}
              y1="0"
              x2={markerX}
              y2={height}
              stroke="#c9ced8"
              strokeWidth="1.5"
              strokeDasharray="7 7"
              vectorEffect="non-scaling-stroke"
            />

            <path
              d={promotedPath}
              fill="none"
              stroke={REVENUE_PROMOTED_COLOR}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={commissionPath}
              fill="none"
              stroke={REVENUE_COMMISSION_COLOR}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            <circle
              cx={markerX}
              cy={promoted[markerIndex]}
              r="6"
              fill="white"
              stroke={REVENUE_PROMOTED_COLOR}
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={markerX}
              cy={commission[markerIndex]}
              r="6"
              fill="white"
              stroke={REVENUE_COMMISSION_COLOR}
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div
            className="pointer-events-none absolute top-2 z-10 w-max -translate-x-1/2 rounded-xl border border-[#eef0f4] bg-white px-3.5 py-2.5 shadow-[0px_8px_24px_rgba(23,32,51,0.12)]"
            style={{ left: tooltipLeft }}
          >
            <p className="text-[11px] font-medium leading-4 text-[#8993a5]">
              {t('adminOverview.revenueTrend.commission')}
            </p>
            <p className="text-[15px] font-bold leading-5" style={{ color: REVENUE_COMMISSION_COLOR }}>
              {commissionValue}
            </p>
            <p className="mt-1.5 text-[11px] font-medium leading-4 text-[#8993a5]">
              {t('adminOverview.revenueTrend.promoted')}
            </p>
            <p className="text-[15px] font-bold leading-5" style={{ color: REVENUE_PROMOTED_COLOR }}>
              {promotedValue}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-start justify-between gap-1">
          {CHART_MONTHS.map((month, index) => (
            <span
              key={month}
              className={`text-[10px] leading-4 sm:text-[11px] ${
                index === markerIndex ? 'font-semibold text-[#172033]' : 'text-[#a2a9b7]'
              }`}
            >
              {t(`adminOverview.analytics.months.${month}`)}
            </span>
          ))}
        </div>
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

      <section aria-label={t('adminOverview.stats.aria')} className="flex flex-col gap-4 xl:gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-5">
          {OVERVIEW_STATS_PRIMARY.map((stat) => (
            <StatCard key={stat.id} labelKey={stat.labelKey} valueKey={stat.valueKey} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-5">
          {OVERVIEW_STATS_SECONDARY.map((stat) => (
            <StatCard key={stat.id} labelKey={stat.labelKey} valueKey={stat.valueKey} />
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
