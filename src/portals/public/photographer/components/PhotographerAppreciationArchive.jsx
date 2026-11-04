import {
  Award,
  Calendar,
  CalendarDays,
  Camera,
  ChevronDown,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CAMERA_TIERS = {
  gold: {
    badge:
      'bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] border border-[#eab308] text-[#713f12]',
    icon: 'text-[#854d0e]',
    dot: 'bg-[#eab308]',
  },
  silver: {
    badge: 'bg-[#f1f5f9] border border-[#e2e8f0] text-[#475569]',
    icon: 'text-[#64748b]',
    dot: 'bg-[#94a3b8]',
  },
  bronze: {
    badge: 'bg-[#fff7ed] border border-[#ffedd5] text-[#9a3412]',
    icon: 'text-[#b45309]',
    dot: 'bg-[#b45309]',
  },
};

/**
 * Weekly & Monthly Archive component for the Artist Appreciation Award.
 * Displays historical camera breakdown per week and per month.
 */
const PhotographerAppreciationArchive = memo(
  ({ weeklyArchive = [], monthlyArchive = [], className = '' }) => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState('weekly'); // 'weekly' | 'monthly'
    const [selectedYear, setSelectedYear] = useState('all');

    // Filter list based on selected view mode and year
    const currentList = useMemo(() => {
      const list = viewMode === 'weekly' ? weeklyArchive : monthlyArchive;
      if (selectedYear === 'all') return list;
      return list.filter((item) => String(item.periodKey || item.label).includes(selectedYear));
    }, [viewMode, weeklyArchive, monthlyArchive, selectedYear]);

    // Compute aggregated highlights
    const stats = useMemo(() => {
      const list = viewMode === 'weekly' ? weeklyArchive : monthlyArchive;
      if (!list || list.length === 0) {
        return { totalCameras: 0, bestPeriod: null, avgPerPeriod: 0 };
      }

      let total = 0;
      let best = list[0];

      list.forEach((item) => {
        const itemTotal = (item.gold || 0) + (item.silver || 0) + (item.bronze || 0);
        total += itemTotal;
        const currentBestTotal =
          (best.gold || 0) + (best.silver || 0) + (best.bronze || 0);
        if (itemTotal > currentBestTotal) {
          best = item;
        }
      });

      return {
        totalCameras: total,
        bestPeriod: best,
        avgPerPeriod: Math.round(total / list.length),
      };
    }, [viewMode, weeklyArchive, monthlyArchive]);

    return (
      <div
        className={`mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6 shadow-xs ${className}`.trim()}
      >
        {/* Header with Title & Switcher */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#eef2ff] text-[#4f46e5]">
                <Award size={18} />
              </span>
              <h3 className="text-[17px] font-bold text-[#111827] sm:text-[19px]">
                {t(
                  'photographerProfile.appreciation.archive.title',
                  'Award Archive & Statistics',
                )}
              </h3>
            </div>
            <p className="mt-1 text-[13px] text-[#6b7280]">
              {t(
                'photographerProfile.appreciation.archive.subtitle',
                'Historical record of Gold, Silver, and Bronze cameras received each week and month.',
              )}
            </p>
          </div>

          {/* Toggle Switch: Weekly / Monthly */}
          <div className="inline-flex shrink-0 items-center rounded-xl bg-[#f3f4f6] p-1">
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${
                viewMode === 'weekly'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              <Calendar size={14} />
              <span>
                {t(
                  'photographerProfile.appreciation.archive.weeklyTab',
                  'Weekly Archive',
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('monthly')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${
                viewMode === 'monthly'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              <CalendarDays size={14} />
              <span>
                {t(
                  'photographerProfile.appreciation.archive.monthlyTab',
                  'Monthly Archive',
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Performance Metric Bar */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Camera size={20} />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                {viewMode === 'weekly'
                  ? t(
                      'photographerProfile.appreciation.archive.totalWeekly',
                      'Weekly Archive Total',
                    )
                  : t(
                      'photographerProfile.appreciation.archive.totalMonthly',
                      'Monthly Archive Total',
                    )}
              </p>
              <p className="text-[17px] font-bold text-gray-900">
                {stats.totalCameras}{' '}
                <span className="text-[12px] font-normal text-gray-500">
                  {t(
                    'photographerProfile.appreciation.archive.cameras',
                    'cameras',
                  )}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                {t(
                  'photographerProfile.appreciation.archive.averagePeriod',
                  'Average / Period',
                )}
              </p>
              <p className="text-[17px] font-bold text-gray-900">
                ~{stats.avgPerPeriod}{' '}
                <span className="text-[12px] font-normal text-gray-500">
                  {viewMode === 'weekly'
                    ? t(
                        'photographerProfile.appreciation.archive.perWeek',
                        '/ week',
                      )
                    : t(
                        'photographerProfile.appreciation.archive.perMonth',
                        '/ month',
                      )}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                {t(
                  'photographerProfile.appreciation.archive.bestRecord',
                  'Best Record',
                )}
              </p>
              <p className="text-[17px] font-bold text-gray-900 truncate">
                {stats.bestPeriod ? (
                  <>
                    {(stats.bestPeriod.gold || 0) +
                      (stats.bestPeriod.silver || 0) +
                      (stats.bestPeriod.bronze || 0)}{' '}
                    <span className="text-[12px] font-normal text-gray-500">
                      ({stats.bestPeriod.shortLabel || stats.bestPeriod.label})
                    </span>
                  </>
                ) : (
                  '—'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Archive Table / List */}
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
          {currentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-[14px] font-semibold text-gray-700">
                {t(
                  'photographerProfile.appreciation.archive.empty',
                  'No historical awards recorded for this period yet.',
                )}
              </p>
              <p className="mt-1 text-[12px] text-gray-500">
                {t(
                  'photographerProfile.appreciation.archive.emptyHint',
                  'Cameras received this week will automatically be archived here every Sunday at midnight.',
                )}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-gray-200 bg-gray-50/90 text-[12px] font-semibold uppercase tracking-wider text-gray-600">
                  <tr>
                    <th scope="col" className="px-4 py-3 sm:px-5">
                      {t(
                        'photographerProfile.appreciation.archive.colPeriod',
                        'Time Period',
                      )}
                    </th>
                    <th scope="col" className="px-3 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-amber-700">
                        <Camera size={14} className="text-amber-500" />
                        {t(
                          'photographerProfile.appreciation.tiers.gold',
                          'Gold',
                        )}
                      </span>
                    </th>
                    <th scope="col" className="px-3 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <Camera size={14} className="text-slate-500" />
                        {t(
                          'photographerProfile.appreciation.tiers.silver',
                          'Silver',
                        )}
                      </span>
                    </th>
                    <th scope="col" className="px-3 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-orange-800">
                        <Camera size={14} className="text-amber-700" />
                        {t(
                          'photographerProfile.appreciation.tiers.bronze',
                          'Bronze',
                        )}
                      </span>
                    </th>
                    <th scope="col" className="px-3 py-3 text-center">
                      {t(
                        'photographerProfile.appreciation.archive.colTotal',
                        'Total',
                      )}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right sm:px-5">
                      {t(
                        'photographerProfile.appreciation.archive.colStatus',
                        'Status',
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {currentList.map((row, idx) => {
                    const rowTotal =
                      (row.gold || 0) + (row.silver || 0) + (row.bronze || 0);

                    return (
                      <tr
                        key={row.periodKey || idx}
                        className={`transition hover:bg-gray-50/80 ${
                          row.isCurrent ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5 sm:px-5 font-medium text-gray-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span>{row.label}</span>
                            {row.isCurrent ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {t(
                                  'photographerProfile.appreciation.archive.current',
                                  'Current',
                                )}
                              </span>
                            ) : null}
                          </div>
                        </td>

                        {/* Gold */}
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-bold text-amber-800">
                            {row.gold || 0}
                          </span>
                        </td>

                        {/* Silver */}
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-700">
                            {row.silver || 0}
                          </span>
                        </td>

                        {/* Bronze */}
                        <td className="px-3 py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 font-bold text-orange-800">
                            {row.bronze || 0}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-3 py-3.5 text-center font-bold text-gray-900 whitespace-nowrap">
                          {rowTotal}
                        </td>

                        {/* Status / Standing */}
                        <td className="px-4 py-3.5 text-right sm:px-5 whitespace-nowrap">
                          {row.isCurrent ? (
                            <span className="text-[12px] font-semibold text-emerald-600">
                              {t(
                                'photographerProfile.appreciation.archive.inProgress',
                                'In Progress',
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600">
                              {t(
                                'photographerProfile.appreciation.archive.archived',
                                'Archived',
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Note explaining Sunday reset and future benefits */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-gray-50 px-4 py-3 text-[12px] text-gray-600">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#4f46e5]" />
            <span>
              {t(
                'photographerProfile.appreciation.archive.resetNotice',
                'Camera counters reset every Sunday at midnight. Weekly & monthly totals are permanently preserved in this archive.',
              )}
            </span>
          </div>
          <span className="text-[11px] font-medium text-gray-400">
            {t(
              'photographerProfile.appreciation.archive.rankingEligible',
              'Eligible for weekly & monthly artist bonuses',
            )}
          </span>
        </div>
      </div>
    );
  },
);

PhotographerAppreciationArchive.displayName = 'PhotographerAppreciationArchive';

export default PhotographerAppreciationArchive;
