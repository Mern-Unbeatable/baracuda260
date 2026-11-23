import {
  Camera,
  Globe,
  PenTool,
  Store,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import React, { memo } from 'react';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminMarketingStatCard from '@/components/data-display/AdminMarketingStatCard/AdminMarketingStatCard';
import { formatCompactStatValue } from '@/components/data-display/AdminOverviewStatCard/AdminOverviewStatCard';
import { useMarketingStatistics } from '@/portals/admin/hooks/useMarketingStatistics';
import {
  CARD_BORDER,
  CARD_SHADOW,
} from '@/portals/admin/data/adminOverviewData';

const AdminMarketingStatisticsContent = memo(() => {
  const { data, loading } = useMarketingStatistics();

  if (loading) {
    return (
      <div className="flex h-100 w-full items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!data) return null;

  const total = data.totalRegisteredProfiles || 1;
  const calcPct = (val) => ((val / total) * 100).toFixed(1);

  return (
    <div className="flex w-full flex-col gap-6 pb-10 sm:gap-8 sm:pb-12">
      <AdminPageHeader
        eyebrow="Marketing & Growth"
        title="Marketing Statistics"
        description="Live overview of user conversion, engagement, and retention metrics."
      />

      <section
        aria-label="Marketing overview stats"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        <AdminMarketingStatCard
          title="Total Registered Profiles"
          value={total}
          icon={Users}
          gradient="from-blue-600 to-indigo-600"
          subtitle="Baseline metric for all conversions"
        />
        <AdminMarketingStatCard
          title="Daily Website Visits"
          value={data.traffic.dailyWebsiteVisits}
          icon={Globe}
          gradient="from-emerald-500 to-teal-600"
          subtitle="Total unique hits today"
        />
        <AdminMarketingStatCard
          title="Active My Store Owners"
          value={data.storeStats.activeStores}
          percentage={calcPct(data.storeStats.activeStores)}
          icon={Store}
          gradient="from-orange-500 to-amber-600"
          subtitle={`${formatCompactStatValue(data.storeStats.storesWithProducts)} have active products`}
        />
        <AdminMarketingStatCard
          title="Store Owners Buying Promote"
          value={data.storeStats.storesBoughtPromote}
          percentage={(
            (data.storeStats.storesBoughtPromote /
              (data.storeStats.activeStores || 1)) *
            100
          ).toFixed(1)}
          icon={TrendingUp}
          gradient="from-rose-500 to-pink-600"
          subtitle="% based on active store owners"
        />
      </section>

      <section className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h2 className="text-[18px] font-semibold leading-7 text-[#161c27] sm:text-[20px] lg:text-[22px]">
            User Behavior & Engagement
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <AdminMarketingStatCard
            title="Photos + Competitions"
            value={data.behaviorStats.addedPhotosAndCompetitions}
            percentage={calcPct(data.behaviorStats.addedPhotosAndCompetitions)}
            icon={Trophy}
            gradient="from-violet-600 to-fuchsia-600"
            subtitle="Highly engaged users"
          />
          <AdminMarketingStatCard
            title="Photos Only (No Competitions)"
            value={data.behaviorStats.onlyAddedPhotos}
            percentage={calcPct(data.behaviorStats.onlyAddedPhotos)}
            icon={Camera}
            gradient="from-cyan-500 to-blue-600"
            subtitle="Casual users"
          />
          <AdminMarketingStatCard
            title="Bought Photo/Album Promote"
            value={data.promotionStats.boughtPhotoAlbumPromote}
            percentage={calcPct(data.promotionStats.boughtPhotoAlbumPromote)}
            icon={TrendingUp}
            gradient="from-pink-500 to-rose-500"
            subtitle="Direct monetization conversion"
            className="col-span-2 lg:col-span-1"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-5">
        <div className="flex flex-col gap-3 sm:gap-4">
          <h2 className="text-[18px] font-semibold leading-7 text-[#161c27] sm:text-[20px] lg:text-[22px]">
            Competition Popularity
          </h2>
          <div
            className={`overflow-hidden rounded-2xl bg-white ${CARD_BORDER} ${CARD_SHADOW}`}
          >
            <div className="divide-y divide-[#f0f1f4]">
              {[
                {
                  label: 'Single Photo',
                  value: data.competitionPopularity.singlePhotoEntries,
                },
                {
                  label: '6-Photo Story',
                  value: data.competitionPopularity.sixPhotoStoryEntries,
                },
                {
                  label: '12-Photo Story',
                  value: data.competitionPopularity.twelvePhotoStoryEntries,
                },
              ].map((item) => {
                const totalEntries = Object.values(
                  data.competitionPopularity,
                ).reduce((a, b) => a + b, 0);
                const pct =
                  totalEntries > 0
                    ? ((item.value / totalEntries) * 100).toFixed(1)
                    : '0.0';
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4"
                  >
                    <span className="text-[13px] font-medium text-[#161c27] sm:text-[14px]">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-[12px] text-[#687186] sm:text-[13px]">
                        {formatCompactStatValue(item.value)} entries
                      </span>
                      <span className="inline-flex min-w-12 justify-end text-[13px] font-bold text-[#4048cd] sm:text-[14px]">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <h2 className="text-[18px] font-semibold leading-7 text-[#161c27] sm:text-[20px] lg:text-[22px]">
            Retention & Activity
          </h2>
          <div
            className={`overflow-hidden rounded-2xl bg-white ${CARD_BORDER} ${CARD_SHADOW}`}
          >
            <div className="grid grid-cols-5 divide-x divide-[#f0f1f4] border-b border-[#f0f1f4] bg-[#f8f9fb] text-[10px] font-semibold uppercase tracking-[0.5px] text-[#687186] sm:text-[11px]">
              {['3 Days', '7 Days', '14 Days', '30 Days', '90 Days'].map(
                (label) => (
                  <div key={label} className="px-1 py-3 text-center sm:p-3">
                    {label}
                  </div>
                ),
              )}
            </div>

            <div className="p-3 sm:p-4">
              <p className="mb-2.5 text-[12px] font-medium uppercase tracking-[0.6px] text-[#494453] sm:text-[13px]">
                Active Logins
              </p>
              <div className="grid grid-cols-5 gap-1 text-center sm:gap-2">
                {Object.values(data.activeUsers).map((val, i) => (
                  <div key={`active-${i}`} className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-[#161c27] sm:text-[14px]">
                      {calcPct(val)}%
                    </span>
                    <span className="text-[10px] text-[#8993a5] sm:text-[11px]">
                      {formatCompactStatValue(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#f0f1f4] p-3 sm:p-4">
              <p className="mb-2.5 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.6px] text-[#494453] sm:text-[13px]">
                <PenTool size={12} aria-hidden="true" /> Users Posting
              </p>
              <div className="grid grid-cols-5 gap-1 text-center sm:gap-2">
                {Object.values(data.postingUsers).map((val, i) => (
                  <div key={`posting-${i}`} className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-[#161c27] sm:text-[14px]">
                      {calcPct(val)}%
                    </span>
                    <span className="text-[10px] text-[#8993a5] sm:text-[11px]">
                      {formatCompactStatValue(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

AdminMarketingStatisticsContent.displayName = 'AdminMarketingStatisticsContent';

export default AdminMarketingStatisticsContent;
