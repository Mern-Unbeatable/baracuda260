/** Admin Competitions (Photo Showcase) — Figma node 339:1447. */

const A = '/assets/admin-competitions';

export const ADMIN_COMPETITIONS_ASSETS = {
  eye: `${A}/icon-eye.svg`,
  heart: `${A}/icon-heart.svg`,
};

/** Album-type filter chip ids shown in the showcase header. */
export const COMPETITION_FILTERS = [
  { id: 'single', labelKey: 'adminCompetitions.filters.single' },
  { id: 'six', labelKey: 'adminCompetitions.filters.six' },
  { id: 'zodiac', labelKey: 'adminCompetitions.filters.zodiac' },
];

export const COMPETITION_TYPE_KEYS = {
  single: 'adminCompetitions.types.single',
  six: 'adminCompetitions.types.six',
  zodiac: 'adminCompetitions.types.zodiac',
};

export const COMPETITION_CARDS = [
  {
    id: 'autumn',
    type: 'six',
    titleKey: 'adminCompetitions.cards.autumn.title',
    metaKey: 'adminCompetitions.cards.autumn.meta',
    image: `${A}/autumn.jpg`,
    views: '2,223',
    likes: '1,488',
  },
  {
    id: 'wings',
    type: 'single',
    titleKey: 'adminCompetitions.cards.wings.title',
    metaKey: 'adminCompetitions.cards.wings.meta',
    image: `${A}/wings.jpg`,
    views: '2,223',
    likes: '1,488',
  },
  {
    id: 'city',
    type: 'six',
    titleKey: 'adminCompetitions.cards.city.title',
    metaKey: 'adminCompetitions.cards.city.meta',
    image: `${A}/city.jpg`,
    views: '2,223',
    likes: '1,488',
  },
  {
    id: 'forest',
    type: 'single',
    titleKey: 'adminCompetitions.cards.forest.title',
    metaKey: 'adminCompetitions.cards.forest.meta',
    image: `${A}/forest.jpg`,
    views: '2,223',
    likes: '1,488',
  },
  {
    id: 'morning',
    type: 'single',
    titleKey: 'adminCompetitions.cards.morning.title',
    metaKey: 'adminCompetitions.cards.morning.meta',
    image: `${A}/morning.jpg`,
    views: '2,223',
    likes: '1,488',
  },
  {
    id: 'harbor',
    type: 'single',
    titleKey: 'adminCompetitions.cards.harbor.title',
    metaKey: 'adminCompetitions.cards.harbor.meta',
    image: `${A}/harbor.jpg`,
    views: '2,223',
    likes: '1,488',
  },
  {
    id: 'silent',
    type: 'single',
    titleKey: 'adminCompetitions.cards.silent.title',
    metaKey: 'adminCompetitions.cards.silent.meta',
    image: `${A}/silent.jpg`,
    views: '2,223',
    likes: '1,488',
  },
  {
    id: 'zodiac',
    type: 'zodiac',
    titleKey: 'adminCompetitions.cards.zodiac.title',
    metaKey: 'adminCompetitions.cards.zodiac.meta',
    image: `${A}/zodiac.jpg`,
    views: '2,223',
    likes: '1,488',
  },
];

export const COMPETITIONS_PAGE_SIZE = 8;
export const COMPETITIONS_TOTAL_PAGES = 10;
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
  if (!filterId) return cards;
  return cards.filter((card) => card.type === filterId);
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
 * Toggle album-type filter: same id clears the filter.
 * @param {string | null} currentFilter
 * @param {string} nextFilterId
 */
export const toggleCompetitionFilter = (currentFilter, nextFilterId) =>
  currentFilter === nextFilterId ? null : nextFilterId;
