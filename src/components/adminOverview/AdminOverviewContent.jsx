import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ArrowUpRight } from 'lucide-react';
import { selectUser } from '../../store/slices/authSlice';
import {
  ADMIN_OVERVIEW_ASSETS,
  CARD_BORDER,
  CARD_SHADOW,
  CHART_MONTHS,
  CHART_Y_LABELS,
  COMMUNITY_COUNTRIES,
  OVERVIEW_STATS,
  PENDING_SUBMISSIONS,
} from './adminOverviewData';

const StatCard = memo(({ labelKey, valueKey }) => {
  const { t } = useTranslation();

  return (
    <article
      className={`flex min-w-0 flex-1 flex-col rounded-[16px] bg-white p-5 sm:p-6 ${CARD_BORDER} ${CARD_SHADOW}`}
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
        <p className="mt-1.5 text-[14px] leading-5 text-[#696969] sm:text-[16px] sm:leading-[21px]">
          {t('adminOverview.analytics.subtitle')}
        </p>
      </header>

      <p className="mt-6 text-[28px] font-extrabold tracking-[-1.2px] text-[#172033] sm:mt-7 sm:text-[32px]">
        {t('adminOverview.analytics.total')}
      </p>

      <div className="relative mt-4 min-h-[200px] flex-1 pl-7 sm:mt-4 sm:min-h-[220px] sm:pl-8">
        <div className="absolute inset-y-0 left-0 flex w-6 flex-col justify-between py-1 sm:w-7">
          {CHART_Y_LABELS.map((label) => (
            <span key={label} className="text-[11px] leading-4 text-[#a2a9b7] sm:text-[12px]">
              {label}
            </span>
          ))}
        </div>

        <div className="relative h-[180px] w-full border-b border-[#edf0f5] sm:h-[204px]">
          <img
            src={ADMIN_OVERVIEW_ASSETS.chartArea}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-fill"
          />
          <img
            src={ADMIN_OVERVIEW_ASSETS.chartLine}
            alt=""
            className="pointer-events-none absolute inset-x-0 top-0 h-[80%] w-full object-fill"
          />
          <div
            className="pointer-events-none absolute bottom-0 left-[63.5%] top-[38%] w-px"
            aria-hidden="true"
          >
            <img
              src={ADMIN_OVERVIEW_ASSETS.chartMarkerLine}
              alt=""
              width={2}
              height={120}
              className="h-full w-[2px] max-w-none object-fill"
            />
          </div>
          <div
            className="pointer-events-none absolute left-[62.5%] top-[32%] size-3"
            aria-hidden="true"
          >
            <img
              src={ADMIN_OVERVIEW_ASSETS.chartMarkerDot}
              alt=""
              width={12}
              height={12}
              className="size-3 max-w-none object-contain"
            />
          </div>
        </div>

        <div className="mt-2 flex items-start justify-between gap-1">
          {CHART_MONTHS.map((month) => (
            <span
              key={month}
              className="text-[10px] leading-4 text-[#a2a9b7] sm:text-[11px] sm:leading-[17px]"
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
            <div className="flex w-full shrink-0 items-center gap-3 sm:w-[160px]">
              <span
                className={`size-[18px] shrink-0 rounded-[9px] ${country.flagClass}`}
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
              <span className="w-14 shrink-0 text-right text-[12px] font-bold leading-5 text-[#6f7a8f] sm:w-[100px] sm:text-[13px]">
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
      <header className="flex flex-col items-start">
        <p className="text-[12px] font-extrabold uppercase tracking-[1.5px] text-[#7f8ba1] sm:text-[14px]">
          {t('adminOverview.greeting', { name: displayName })}
        </p>
        <h1 className="mt-3 text-[28px] leading-tight tracking-[-1.5px] text-[#151e31] sm:text-[32px] lg:text-[36px] lg:leading-[42px]">
          {t('adminOverview.title')}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-6 text-[#687186] sm:text-[16px] sm:leading-[25px]">
          {t('adminOverview.subtitle')}
        </p>
      </header>

      <section
        aria-label={t('adminOverview.stats.aria')}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5"
      >
        {OVERVIEW_STATS.map((stat) => (
          <StatCard key={stat.id} labelKey={stat.labelKey} valueKey={stat.valueKey} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-5">
        <VisitorChart />
        <PendingReviewCard />
      </section>

      <CommunityReachCard />
    </div>
  );
});

AdminOverviewContent.displayName = 'AdminOverviewContent';

export default AdminOverviewContent;
