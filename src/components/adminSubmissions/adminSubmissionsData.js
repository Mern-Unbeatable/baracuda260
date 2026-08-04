/** Admin Submissions (Submission review) — Figma node 339:2677. */

const A = '/assets/admin-submissions';

export const ADMIN_SUBMISSIONS_ASSETS = {
  check: `${A}/icon-check.svg`,
  reject: `${A}/icon-x.svg`,
};

export const SUBMISSION_FILTERS = [
  { id: 'all', labelKey: 'adminSubmissions.filters.all' },
  { id: 'single', labelKey: 'adminSubmissions.filters.single' },
  { id: 'six', labelKey: 'adminSubmissions.filters.six' },
  { id: 'zodiac', labelKey: 'adminSubmissions.filters.zodiac' },
];

export const SUBMISSION_TYPE_KEYS = {
  single: 'adminSubmissions.types.single',
  six: 'adminSubmissions.types.six',
  zodiac: 'adminSubmissions.types.zodiac',
};

export const SUBMISSION_CARDS = [
  {
    id: 'golden',
    type: 'single',
    titleKey: 'adminSubmissions.cards.golden.title',
    metaKey: 'adminSubmissions.cards.golden.meta',
    image: `${A}/golden.jpg`,
  },
  {
    id: 'autumn',
    type: 'six',
    titleKey: 'adminSubmissions.cards.autumn.title',
    metaKey: 'adminSubmissions.cards.autumn.meta',
    image: `${A}/autumn.jpg`,
  },
  {
    id: 'wings',
    type: 'single',
    titleKey: 'adminSubmissions.cards.wings.title',
    metaKey: 'adminSubmissions.cards.wings.meta',
    image: `${A}/wings.jpg`,
  },
  {
    id: 'city',
    type: 'six',
    titleKey: 'adminSubmissions.cards.city.title',
    metaKey: 'adminSubmissions.cards.city.meta',
    image: `${A}/city.jpg`,
  },
  {
    id: 'tidal',
    type: 'zodiac',
    titleKey: 'adminSubmissions.cards.tidal.title',
    metaKey: 'adminSubmissions.cards.tidal.meta',
    image: `${A}/tidal.jpg`,
  },
  {
    id: 'forest',
    type: 'single',
    titleKey: 'adminSubmissions.cards.forest.title',
    metaKey: 'adminSubmissions.cards.forest.meta',
    image: `${A}/forest.jpg`,
  },
  {
    id: 'morning',
    type: 'single',
    titleKey: 'adminSubmissions.cards.morning.title',
    metaKey: 'adminSubmissions.cards.morning.meta',
    image: `${A}/morning.jpg`,
  },
  {
    id: 'zodiac',
    type: 'zodiac',
    titleKey: 'adminSubmissions.cards.zodiac.title',
    metaKey: 'adminSubmissions.cards.zodiac.meta',
    image: `${A}/zodiac.jpg`,
  },
];

export const SUBMISSIONS_PAGE_SIZE = 8;
export const SUBMISSIONS_TOTAL_PAGES = 10;
export const PAGINATION_LEADING_PAGES = [1, 2, 3];
export const PAGINATION_ICON_SIZE = 16;
export const CARD_IMAGE_WIDTH = 370;
export const CARD_IMAGE_HEIGHT = 252;
export const ACTION_ICON_SIZE = 20;

/**
 * @param {typeof SUBMISSION_CARDS} cards
 * @param {string} filterId
 */
export const filterSubmissionCards = (cards, filterId) => {
  if (!filterId || filterId === 'all') return cards;
  return cards.filter((card) => card.type === filterId);
};

/**
 * @param {string} currentFilter
 * @param {string} nextFilterId
 */
export const selectSubmissionFilter = (currentFilter, nextFilterId) =>
  nextFilterId || currentFilter || 'all';
