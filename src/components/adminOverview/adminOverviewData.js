/** Admin Overview — Figma node 339:1136. */
const A = '/assets/admin-overview';

export const ADMIN_OVERVIEW_ASSETS = {
  chartArea: `${A}/chart-area.png`,
  chartLine: `${A}/chart-line.png`,
  chartMarkerLine: `${A}/chart-marker-line.png`,
  chartMarkerDot: `${A}/chart-marker-dot.png`,
  thumbRiver: `${A}/thumb-river.jpg`,
  thumbGarden: `${A}/thumb-garden.jpg`,
  thumbCeiling: `${A}/thumb-ceiling.jpg`,
  avatar: `${A}/avatar.jpg`,
};

export const OVERVIEW_STATS = [
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
    id: 'pending',
    labelKey: 'adminOverview.stats.pendingApproval',
    valueKey: 'adminOverview.stats.pendingApprovalValue',
  },
  {
    id: 'votes',
    labelKey: 'adminOverview.stats.votesCast',
    valueKey: 'adminOverview.stats.votesCastValue',
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

export const CHART_Y_LABELS = ['12k', '8k', '4k', '0'];

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
