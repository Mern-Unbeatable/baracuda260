/** Admin Overview — Figma node 339:1136. */
const A = '/assets/admin-overview';

export const ADMIN_OVERVIEW_ASSETS = {
  thumbRiver: `${A}/thumb-river.webp`,
  thumbGarden: `${A}/thumb-garden.webp`,
  thumbCeiling: `${A}/thumb-ceiling.webp`,
  avatar: `${A}/avatar.webp`,
};

/** First stats row — 5 cards (Figma). */
export const OVERVIEW_STATS_PRIMARY = [
  {
    id: 'users',
    labelKey: 'adminOverview.stats.registeredUsers',
    valueKey: 'adminOverview.stats.registeredUsersValue',
  },
  {
    id: 'photos',
    labelKey: 'adminOverview.stats.photosSubmitted',
    valueKey: 'adminOverview.stats.photosSubmittedValue',
  },
  {
    id: 'votes',
    labelKey: 'adminOverview.stats.votesCast',
    valueKey: 'adminOverview.stats.votesCastValue',
  },
  {
    id: 'totalCommission',
    labelKey: 'adminOverview.stats.totalCommission',
    valueKey: 'adminOverview.stats.totalCommissionValue',
  },
  {
    id: 'thisMonthCommission',
    labelKey: 'adminOverview.stats.thisMonthCommission',
    valueKey: 'adminOverview.stats.thisMonthCommissionValue',
  },
];

/** Second stats row — 4 cards (Figma). */
export const OVERVIEW_STATS_SECONDARY = [
  {
    id: 'totalPromoted',
    labelKey: 'adminOverview.stats.totalPromoted',
    valueKey: 'adminOverview.stats.totalPromotedValue',
  },
  {
    id: 'thisMonthPromoted',
    labelKey: 'adminOverview.stats.thisMonthPromoted',
    valueKey: 'adminOverview.stats.thisMonthPromotedValue',
  },
  {
    id: 'totalRevenue',
    labelKey: 'adminOverview.stats.totalRevenue',
    valueKey: 'adminOverview.stats.totalRevenueValue',
  },
  {
    id: 'totalPayouts',
    labelKey: 'adminOverview.stats.totalPayouts',
    valueKey: 'adminOverview.stats.totalPayoutsValue',
  },
];

export const CHART_MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

export const REVENUE_DATA = [
  { month: 'jan', commission: 12500, promoted: 8500 },
  { month: 'feb', commission: 17000, promoted: 10750 },
  { month: 'mar', commission: 15500, promoted: 9750 },
  { month: 'apr', commission: 22500, promoted: 14250 },
  { month: 'may', commission: 21000, promoted: 15750 },
  { month: 'jun', commission: 30000, promoted: 22250 },
  { month: 'jul', commission: 28000, promoted: 20250 },
  { month: 'aug', commission: 37000, promoted: 27750 },
  { month: 'sep', commission: 35000, promoted: 25250 },
  { month: 'oct', commission: 43500, promoted: 32250 },
  { month: 'nov', commission: 40500, promoted: 29750 },
  { month: 'dec', commission: 47000, promoted: 35750 },
];

export const VISITOR_DATA = [
  { month: 'jan', visitors: 3000 },
  { month: 'feb', visitors: 3500 },
  { month: 'mar', visitors: 4200 },
  { month: 'apr', visitors: 3800 },
  { month: 'may', visitors: 5000 },
  { month: 'jun', visitors: 6500 },
  { month: 'jul', visitors: 6000 },
  { month: 'aug', visitors: 8500 },
  { month: 'sep', visitors: 9200 },
  { month: 'oct', visitors: 8100 },
  { month: 'nov', visitors: 10500 },
  { month: 'dec', visitors: 11800 },
];

export const REVENUE_PERIODS = [
  {
    id: 'thisYear',
    labelKey: 'adminOverview.revenueTrend.periodOptions.thisYear',
  },
  {
    id: 'sixMonths',
    labelKey: 'adminOverview.revenueTrend.periodOptions.sixMonths',
  },
  {
    id: 'thisMonth',
    labelKey: 'adminOverview.revenueTrend.periodOptions.thisMonth',
  },
  {
    id: 'lastYear',
    labelKey: 'adminOverview.revenueTrend.periodOptions.lastYear',
  },
];

export const PENDING_SUBMISSIONS = [
  {
    id: 'river',
    titleKey: 'adminOverview.pending.items.river.title',
    metaKey: 'adminOverview.pending.items.river.meta',
    image: ADMIN_OVERVIEW_ASSETS.thumbRiver,
  },
  {
    id: 'garden',
    titleKey: 'adminOverview.pending.items.garden.title',
    metaKey: 'adminOverview.pending.items.garden.meta',
    image: ADMIN_OVERVIEW_ASSETS.thumbGarden,
  },
  {
    id: 'ceiling',
    titleKey: 'adminOverview.pending.items.ceiling.title',
    metaKey: 'adminOverview.pending.items.ceiling.meta',
    image: ADMIN_OVERVIEW_ASSETS.thumbCeiling,
  },
];

/** Bar width as percent of top country (United States = 4283). */
export const COMMUNITY_COUNTRIES = [
  {
    id: 'us',
    nameKey: 'adminOverview.community.countries.us',
    valueKey: 'adminOverview.community.countries.usValue',
    percent: 100,
    flagClass:
      'bg-[linear-gradient(90deg,#f3f3f3_0%,#f3f3f3_35%,#dd4d52_35%,#dd4d52_65%,#354a96_65%)]',
  },
  {
    id: 'uk',
    nameKey: 'adminOverview.community.countries.uk',
    valueKey: 'adminOverview.community.countries.ukValue',
    percent: 64,
    flagClass:
      'bg-[linear-gradient(90deg,#274986_0%,#274986_33%,#fff_33%,#fff_66%,#d4464d_66%)]',
  },
  {
    id: 'id',
    nameKey: 'adminOverview.community.countries.id',
    valueKey: 'adminOverview.community.countries.idValue',
    percent: 46,
    flagClass:
      'bg-[linear-gradient(180deg,#e24b4b_0%,#e24b4b_33%,#fff_33%,#fff_66%,#45a869_66%)]',
  },
  {
    id: 'jp',
    nameKey: 'adminOverview.community.countries.jp',
    valueKey: 'adminOverview.community.countries.jpValue',
    percent: 33,
    flagClass: 'bg-[#d8574c]',
  },
];

export const CARD_SHADOW = 'shadow-[0px_4px_8px_rgba(27,39,69,0.02)]';
export const CARD_BORDER = 'border border-[#e8ebf1]';
