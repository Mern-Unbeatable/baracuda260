import re

with open('src/portals/admin/views/AdminOverviewContent.jsx', 'r') as f:
    content = f.read()

# 1. Add recharts imports
content = content.replace("import { useSelector } from 'react-redux';", 
"import { useSelector } from 'react-redux';\nimport { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';")

# 2. Update adminOverviewData imports
content = content.replace("""  CHART_MONTHS,
  CHART_Y_LABELS,
  COMMUNITY_COUNTRIES,
  OVERVIEW_STATS_PRIMARY,
  OVERVIEW_STATS_SECONDARY,
  PENDING_SUBMISSIONS,
  REVENUE_CHART,
  REVENUE_PERIODS,""", """  COMMUNITY_COUNTRIES,
  OVERVIEW_STATS_PRIMARY,
  OVERVIEW_STATS_SECONDARY,
  PENDING_SUBMISSIONS,
  REVENUE_DATA,
  VISITOR_DATA,
  REVENUE_PERIODS,""")

# 3. Remove buildLinePath
content = re.sub(r'/\*\*.+?buildLinePath.+?};\n', '', content, flags=re.DOTALL)

# 4. Replace VisitorChart
visitor_chart_new = """const VisitorChart = memo(() => {
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
          <AreaChart data={VISITOR_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="visitor-area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3374E6" stopOpacity={0.17} />
                <stop offset="95%" stopColor="#3374E6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#a2a9b7' }} 
              tickFormatter={(val) => t(`adminOverview.analytics.months.${val}`)}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#a2a9b7' }} 
              tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#3374E6"
              strokeWidth={3.2}
              fillOpacity={1}
              fill="url(#visitor-area-fill)"
              activeDot={{ r: 6, strokeWidth: 3, stroke: '#3374E6', fill: 'white' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
});

VisitorChart.displayName = 'VisitorChart';"""
content = re.sub(r'const VisitorChart = memo\(\(\) => \{.+?VisitorChart\.displayName = \'VisitorChart\';', visitor_chart_new, content, flags=re.DOTALL)

# 5. Replace RevenueTrendCard
revenue_chart_new = """const RevenueTrendCard = memo(() => {
  const { t } = useTranslation();
  const commissionValue = t('adminOverview.revenueTrend.commissionValue');
  const promotedValue = t('adminOverview.revenueTrend.promotedValue');

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
          <p className="text-[15px] font-bold leading-5" style={{ color: REVENUE_COMMISSION_COLOR }}>
            ${payload[0].value.toLocaleString()}
          </p>
          <p className="mt-1.5 text-[11px] font-medium leading-4 text-[#8993a5]">
            {t('adminOverview.revenueTrend.promoted')}
          </p>
          <p className="text-[15px] font-bold leading-5" style={{ color: REVENUE_PROMOTED_COLOR }}>
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
          <LineChart data={REVENUE_DATA} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#a2a9b7' }} 
              tickFormatter={(val) => t(`adminOverview.analytics.months.${val}`)}
              dy={10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#c9ced8', strokeWidth: 1.5, strokeDasharray: '7 7' }} />
            <Line
              type="monotone"
              dataKey="commission"
              stroke={REVENUE_COMMISSION_COLOR}
              strokeWidth={3.2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 3, stroke: REVENUE_COMMISSION_COLOR, fill: 'white' }}
            />
            <Line
              type="monotone"
              dataKey="promoted"
              stroke={REVENUE_PROMOTED_COLOR}
              strokeWidth={3.2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 3, stroke: REVENUE_PROMOTED_COLOR, fill: 'white' }}
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

RevenueTrendCard.displayName = 'RevenueTrendCard';"""
content = re.sub(r'const RevenueTrendCard = memo\(\(\) => \{.+?RevenueTrendCard\.displayName = \'RevenueTrendCard\';', revenue_chart_new, content, flags=re.DOTALL)

with open('src/portals/admin/views/AdminOverviewContent.jsx', 'w') as f:
    f.write(content)

print("SUCCESS")
