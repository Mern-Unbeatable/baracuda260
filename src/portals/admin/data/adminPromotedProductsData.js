/** Admin Promoted Products — Figma promoted products list. */

const A = '/assets/admin-competitions';
const H = '/assets/home';

export const ADMIN_PROMOTED_ASSETS = {
  eye: `${A}/icon-eye.svg`,
  heart: `${A}/icon-heart.svg`,
  calendar: `${H}/icon-calendar.svg`,
};

export const PROMOTED_FILTERS = [
  { id: 'all', labelKey: 'adminPromoted.filters.all' },
  { id: 'artwork', labelKey: 'adminPromoted.filters.artwork' },
  { id: 'product', labelKey: 'adminPromoted.filters.product' },
  { id: 'sell_photo', labelKey: 'adminPromoted.filters.sellPhoto' },
  { id: 'single', labelKey: 'adminPromoted.filters.single' },
  { id: 'six', labelKey: 'adminPromoted.filters.six' },
  { id: 'zodiac', labelKey: 'adminPromoted.filters.zodiac' },
];

export const PROMOTED_STATUS_FILTERS = [
  { id: 'ALL', labelKey: 'adminPromoted.status.all' },
  { id: 'ACTIVE', labelKey: 'adminPromoted.status.active' },
  { id: 'EXPIRED', labelKey: 'adminPromoted.status.expired' },
];

export const PROMOTED_TYPE_KEYS = {
  single: 'adminPromoted.types.single',
  six: 'adminPromoted.types.six',
  zodiac: 'adminPromoted.types.zodiac',
  product: 'adminPromoted.types.product',
  sell_photo: 'adminPromoted.types.sell_photo',
};

export const PROMOTED_STAT_CARDS = [
  {
    id: 'totalPromotions',
    labelKey: 'adminPromoted.stats.totalPromotions',
    icon: 'Megaphone',
    iconBg: 'bg-[#eef2ff] text-[#4048cd]',
  },
  {
    id: 'activePromotions',
    labelKey: 'adminPromoted.stats.activePromotions',
    icon: 'CheckCircle2',
    iconBg: 'bg-[#eaf8f1] text-[#059669]',
  },
  {
    id: 'expiredPromotions',
    labelKey: 'adminPromoted.stats.expiredPromotions',
    icon: 'Clock',
    iconBg: 'bg-[#fff7ed] text-[#d97706]',
  },
  {
    id: 'totalRevenue',
    labelKey: 'adminPromoted.stats.totalRevenue',
    icon: 'DollarSign',
    iconBg: 'bg-[#fdf4ff] text-[#a855f7]',
    isCurrency: true,
  },
];

export const PROMOTED_PAGE_SIZE = 12;
export const CARD_IMAGE_WIDTH = 370;
export const CARD_IMAGE_HEIGHT = 252;
export const METRIC_ICON_SIZE = 24;

export const getPromotedDetailPath = (id, detailRoutePattern) =>
  detailRoutePattern.replace(':id', id);

/**
 * Filter promoted items on the client as a secondary layer if needed.
 * @param {Array} cards
 * @param {string} filterId
 */
export const filterPromotedCards = (cards, filterId) => {
  if (!filterId || filterId.toLowerCase() === 'all') return cards;

  const normalized = filterId.toLowerCase();
  return cards.filter((card) => {
    if (card.type && card.type.toLowerCase() === normalized) return true;
    if (card.kind) {
      if (normalized === 'single' && card.kind.toUpperCase() === 'SINGLE') return true;
      if (normalized === 'six' && card.kind.toUpperCase() === 'SIX') return true;
      if (normalized === 'zodiac' && card.kind.toUpperCase() === 'TWELVE') return true;
    }
    return false;
  });
};
