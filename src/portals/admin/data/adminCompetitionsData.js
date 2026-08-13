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
    descriptionKey: 'adminCompetitions.cards.autumn.description',
    image: `${H}/photo-autumn.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminCompetitions.cards.autumn.date',
    extraPhotos: 5,
  },
  {
    id: 'wings',
    type: 'single',
    titleKey: 'adminCompetitions.cards.wings.title',
    descriptionKey: 'adminCompetitions.cards.wings.description',
    image: `${H}/photo-wings.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminCompetitions.cards.wings.date',
    extraPhotos: null,
  },
  {
    id: 'city',
    type: 'six',
    titleKey: 'adminCompetitions.cards.city.title',
    descriptionKey: 'adminCompetitions.cards.city.description',
    image: `${H}/photo-city.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminCompetitions.cards.city.date',
    extraPhotos: 5,
  },
  {
    id: 'forest',
    type: 'single',
    titleKey: 'adminCompetitions.cards.forest.title',
    descriptionKey: 'adminCompetitions.cards.forest.description',
    image: `${H}/photo-forest.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminCompetitions.cards.forest.date',
    extraPhotos: null,
  },
  {
    id: 'morning',
    type: 'single',
    titleKey: 'adminCompetitions.cards.morning.title',
    descriptionKey: 'adminCompetitions.cards.morning.description',
    image: `${H}/photo-morning.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminCompetitions.cards.morning.date',
    extraPhotos: null,
  },
  {
    id: 'harbor',
    type: 'single',
    titleKey: 'adminCompetitions.cards.harbor.title',
    descriptionKey: 'adminCompetitions.cards.harbor.description',
    image: `${H}/photo-harbor.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminCompetitions.cards.harbor.date',
    extraPhotos: null,
  },
  {
    id: 'silent',
    type: 'single',
    titleKey: 'adminCompetitions.cards.silent.title',
    descriptionKey: 'adminCompetitions.cards.silent.description',
    image: `${H}/photo-silent.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminCompetitions.cards.silent.date',
    extraPhotos: null,
  },
  {
    id: 'zodiac',
    type: 'zodiac',
    titleKey: 'adminCompetitions.cards.zodiac.title',
    descriptionKey: 'adminCompetitions.cards.zodiac.description',
    image: `${H}/photo-zodiac.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminCompetitions.cards.zodiac.date',
    extraPhotos: 11,
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
