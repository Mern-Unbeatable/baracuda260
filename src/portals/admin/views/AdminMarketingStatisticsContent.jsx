import React, { memo } from 'react';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import { useMarketingStatistics } from '@/portals/admin/hooks/useMarketingStatistics';
import { 
  Users, 
  Store, 
  TrendingUp, 
  Camera, 
  Trophy, 
  Activity, 
  Globe, 
  PenTool,
  ArrowUpRight 
} from 'lucide-react';

const StatCard = ({ title, value, percentage, icon: Icon, subtitle, gradient }) => (
  <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-[0px_4px_20px_-4px_rgba(22,28,39,0.05)] transition-all hover:shadow-[0px_8px_30px_-4px_rgba(22,28,39,0.1)]">
    <div className="relative z-10 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
          <Icon size={24} strokeWidth={2} />
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
    <div className={`absolute -bottom-12 -right-12 size-32 rounded-full bg-gradient-to-br ${gradient} opacity-5 blur-2xl`} />
  </div>
);

const AdminMarketingStatisticsContent = memo(() => {
  const { data, loading } = useMarketingStatistics();

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!data) return null;

  const total = data.totalRegisteredProfiles;
  const calcPct = (val) => ((val / total) * 100).toFixed(1);

  return (
    <div className="flex w-full flex-col gap-8 pb-12">
      <AdminPageHeader
        eyebrow="Marketing & Growth"
        title="Marketing Statistics"
        description="Live overview of user conversion, engagement, and retention metrics."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registered Profiles"
          value={total}
          icon={Users}
          gradient="from-blue-600 to-indigo-600"
          subtitle="Baseline metric for all conversions"
        />
        <StatCard
          title="Daily Website Visits"
          value={data.traffic.dailyWebsiteVisits}
          icon={Globe}
          gradient="from-emerald-500 to-teal-600"
          subtitle="Total unique hits today"
        />
        <StatCard
          title="Active 'My Store' Owners"
          value={data.storeStats.activeStores}
          percentage={calcPct(data.storeStats.activeStores)}
          icon={Store}
          gradient="from-orange-500 to-amber-600"
          subtitle={`${data.storeStats.storesWithProducts.toLocaleString()} have active products`}
        />
        <StatCard
          title="Store Owners Buying 'Promote'"
          value={data.storeStats.storesBoughtPromote}
          percentage={((data.storeStats.storesBoughtPromote / data.storeStats.activeStores) * 100).toFixed(1)}
          icon={TrendingUp}
          gradient="from-rose-500 to-pink-600"
          subtitle="% based on active store owners"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-900">User Behavior & Engagement</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title="Photos + Competitions"
            value={data.behaviorStats.addedPhotosAndCompetitions}
            percentage={calcPct(data.behaviorStats.addedPhotosAndCompetitions)}
            icon={Trophy}
            gradient="from-violet-600 to-fuchsia-600"
            subtitle="Highly engaged users"
          />
          <StatCard
            title="Photos Only (No Competitions)"
            value={data.behaviorStats.onlyAddedPhotos}
            percentage={calcPct(data.behaviorStats.onlyAddedPhotos)}
            icon={Camera}
            gradient="from-cyan-500 to-blue-600"
            subtitle="Casual users"
          />
          <StatCard
            title="Bought Photo/Album 'Promote'"
            value={data.promotionStats.boughtPhotoAlbumPromote}
            percentage={calcPct(data.promotionStats.boughtPhotoAlbumPromote)}
            icon={TrendingUp}
            gradient="from-pink-500 to-rose-500"
            subtitle="Direct monetization conversion"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900">Competition Popularity</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              {[
                { label: 'Single Photo', value: data.competitionPopularity.singlePhotoEntries },
                { label: '6-Photo Story', value: data.competitionPopularity.sixPhotoStoryEntries },
                { label: '12-Photo Story', value: data.competitionPopularity.twelvePhotoStoryEntries },
              ].map((item, i) => {
                const totalEntries = Object.values(data.competitionPopularity).reduce((a, b) => a + b, 0);
                const pct = ((item.value / totalEntries) * 100).toFixed(1);
                return (
                  <div key={i} className="flex items-center justify-between p-5 hover:bg-gray-50">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">{item.value.toLocaleString()} entries</span>
                      <span className="inline-flex w-16 justify-end font-bold text-indigo-600">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900">Retention & Activity (Rolling)</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-5 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <div className="p-4 text-center">3 Days</div>
              <div className="p-4 text-center">7 Days</div>
              <div className="p-4 text-center">14 Days</div>
              <div className="p-4 text-center">30 Days</div>
              <div className="p-4 text-center">90 Days</div>
            </div>
            
            <div className="p-4">
              <p className="mb-3 text-sm font-medium text-gray-500">Active Logins</p>
              <div className="grid grid-cols-5 gap-2 text-center">
                {Object.values(data.activeUsers).map((val, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900">{calcPct(val)}%</span>
                    <span className="text-xs text-gray-400">{val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-100 p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
                <PenTool size={14} /> Users Posting
              </p>
              <div className="grid grid-cols-5 gap-2 text-center">
                {Object.values(data.postingUsers).map((val, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900">{calcPct(val)}%</span>
                    <span className="text-xs text-gray-400">{val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AdminMarketingStatisticsContent.displayName = 'AdminMarketingStatisticsContent';

export default AdminMarketingStatisticsContent;
