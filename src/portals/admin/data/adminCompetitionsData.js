/** Admin Competitions — Figma node 339:1447. */

const A = '/assets/admin-competitions';
const H = '/assets/home';

export const ADMIN_COMPETITIONS_ASSETS = {
  eye: `${A}/icon-eye.svg`,
  heart: `${A}/icon-heart.svg`,
  calendar: `${H}/icon-calendar.svg`,
};

/** Album-type filter chip ids shown in the showcase header. */
export const COMPETITION_FILTERS = [
  { id: 'all', labelKey: 'adminCompetitions.filters.all' },
  { id: 'single', labelKey: 'adminCompetitions.filters.single' },
  { id: 'six', labelKey: 'adminCompetitions.filters.six' },
  { id: 'zodiac', labelKey: 'adminCompetitions.filters.zodiac' },
];

export const COMPETITION_TYPE_KEYS = {
  single: 'adminCompetitions.types.single',
  six: 'adminCompetitions.types.six',
  zodiac: 'adminCompetitions.types.zodiac',
  SINGLE: 'adminCompetitions.types.single',
  SIX: 'adminCompetitions.types.six',
  TWELVE: 'adminCompetitions.types.zodiac',
};

export const COMPETITION_CARDS = [];

/** Desktop / tablet page size (4-col / 3-col grids). */
export const COMPETITIONS_PAGE_SIZE = 8;
/** Mobile page size (2-col grid). */
export const COMPETITIONS_PAGE_SIZE_MOBILE = 10;
export const COMPETITIONS_TOTAL_PAGES = 1;
/** Leading page numbers shown before the ellipsis in Figma pagination. */
export const PAGINATION_LEADING_PAGES = [1, 2, 3];
export const PAGINATION_ICON_SIZE = 16;
export const CARD_IMAGE_WIDTH = 370;
export const CARD_IMAGE_HEIGHT = 252;
export const METRIC_ICON_SIZE = 24;

/**
 * @param {string} id
 * @param {string} detailRoutePattern e.g. `/admin/my-competitions/:id`
 */
export const getCompetitionDetailPath = (id, detailRoutePattern) =>
  detailRoutePattern.replace(':id', id);

/**
 * @param {typeof COMPETITION_CARDS} cards
 * @param {string | null} filterId
 */
export const filterCompetitionCards = (cards, filterId) => {
  if (!filterId || !Array.isArray(cards)) return cards || [];
  const normalized = filterId.toLowerCase();
  return cards.filter((card) => {
    const type = (card.type || '').toLowerCase();
    const kind = (card.kind || '').toLowerCase();
    if (normalized === 'single') return type === 'single' || kind === 'single';
    if (normalized === 'six') return type === 'six' || kind === 'six';
    if (normalized === 'zodiac') return type === 'zodiac' || kind === 'twelve';
    return type === normalized || kind === normalized;
  });
};

/**
 * @param {typeof COMPETITION_CARDS} cards
 * @param {number} page 1-based
 * @param {number} pageSize
 */
export const paginateCompetitionCards = (cards, page, pageSize) => {
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * pageSize;
  return cards.slice(startIndex, startIndex + pageSize);
};

/**
 * Select album-type filter. `all` (or re-clicking active) clears to show everything.
 * @param {string | null} currentFilter
 * @param {string} nextFilterId
 */
export const toggleCompetitionFilter = (currentFilter, nextFilterId) => {
  if (!nextFilterId || nextFilterId === 'all') return null;
  return currentFilter === nextFilterId ? null : nextFilterId;
};
