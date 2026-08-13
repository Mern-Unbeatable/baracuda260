/** Admin Premium Photos — Figma premium photos list. */

const A = '/assets/admin-competitions';
const H = '/assets/home';

export const ADMIN_PREMIUM_PHOTOS_ASSETS = {
  eye: `${A}/icon-eye.svg`,
  heart: `${A}/icon-heart.svg`,
  calendar: `${H}/icon-calendar.svg`,
};

/** Album-type filter chip ids shown in the premium photos header. */
export const PREMIUM_PHOTOS_FILTERS = [
  { id: 'all', labelKey: 'adminPremiumPhotos.filters.all' },
  { id: 'single', labelKey: 'adminPremiumPhotos.filters.single' },
  { id: 'six', labelKey: 'adminPremiumPhotos.filters.six' },
  { id: 'zodiac', labelKey: 'adminPremiumPhotos.filters.zodiac' },
];

export const PREMIUM_PHOTOS_TYPE_KEYS = {
  single: 'adminPremiumPhotos.types.single',
  six: 'adminPremiumPhotos.types.six',
  zodiac: 'adminPremiumPhotos.types.zodiac',
};

const BASE_CARDS = [
  {
    id: 'autumn',
    type: 'six',
    titleKey: 'adminPremiumPhotos.cards.autumn.title',
    descriptionKey: 'adminPremiumPhotos.cards.autumn.description',
    image: `${H}/photo-autumn.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.autumn.date',
    extraPhotos: 5,
  },
  {
    id: 'wings',
    type: 'single',
    titleKey: 'adminPremiumPhotos.cards.wings.title',
    descriptionKey: 'adminPremiumPhotos.cards.wings.description',
    image: `${H}/photo-wings.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.wings.date',
    extraPhotos: null,
  },
  {
    id: 'city',
    type: 'six',
    titleKey: 'adminPremiumPhotos.cards.city.title',
    descriptionKey: 'adminPremiumPhotos.cards.city.description',
    image: `${H}/photo-city.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.city.date',
    extraPhotos: 5,
  },
  {
    id: 'forest',
    type: 'single',
    titleKey: 'adminPremiumPhotos.cards.forest.title',
    descriptionKey: 'adminPremiumPhotos.cards.forest.description',
    image: `${H}/photo-forest.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.forest.date',
    extraPhotos: null,
  },
  {
    id: 'morning',
    type: 'single',
    titleKey: 'adminPremiumPhotos.cards.morning.title',
    descriptionKey: 'adminPremiumPhotos.cards.morning.description',
    image: `${H}/photo-morning.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.morning.date',
    extraPhotos: null,
  },
  {
    id: 'harbor',
    type: 'single',
    titleKey: 'adminPremiumPhotos.cards.harbor.title',
    descriptionKey: 'adminPremiumPhotos.cards.harbor.description',
    image: `${H}/photo-harbor.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.harbor.date',
    extraPhotos: null,
  },
  {
    id: 'silent',
    type: 'single',
    titleKey: 'adminPremiumPhotos.cards.silent.title',
    descriptionKey: 'adminPremiumPhotos.cards.silent.description',
    image: `${H}/photo-silent.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.silent.date',
    extraPhotos: null,
  },
  {
    id: 'zodiac',
    type: 'zodiac',
    titleKey: 'adminPremiumPhotos.cards.zodiac.title',
    descriptionKey: 'adminPremiumPhotos.cards.zodiac.description',
    image: `${H}/photo-zodiac.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.zodiac.date',
    extraPhotos: 11,
  },
];

export const PREMIUM_PHOTOS_CARDS = [
  ...BASE_CARDS,
  {
    id: 'golden',
    type: 'single',
    titleKey: 'adminPremiumPhotos.cards.golden.title',
    descriptionKey: 'adminPremiumPhotos.cards.golden.description',
    image: `${H}/photo-golden.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.golden.date',
    extraPhotos: null,
  },
  {
    id: 'tidal',
    type: 'six',
    titleKey: 'adminPremiumPhotos.cards.tidal.title',
    descriptionKey: 'adminPremiumPhotos.cards.tidal.description',
    image: `${H}/photo-tidal.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.tidal.date',
    extraPhotos: 5,
  },
  {
    id: 'autumn-2',
    type: 'zodiac',
    titleKey: 'adminPremiumPhotos.cards.autumn.title',
    descriptionKey: 'adminPremiumPhotos.cards.autumn.description',
    image: `${H}/photo-zodiac.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.autumn.date',
    extraPhotos: 11,
  },
  {
    id: 'wings-2',
    type: 'single',
    titleKey: 'adminPremiumPhotos.cards.wings.title',
    descriptionKey: 'adminPremiumPhotos.cards.wings.description',
    image: `${H}/photo-wings.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminPremiumPhotos.cards.wings.date',
    extraPhotos: null,
  },
];

export const PREMIUM_PHOTOS_PAGE_SIZE = 12;
export const PREMIUM_PHOTOS_TOTAL_PAGES = 10;
export const PAGINATION_LEADING_PAGES = [1, 2, 3];
export const PAGINATION_ICON_SIZE = 16;
export const CARD_IMAGE_WIDTH = 370;
export const CARD_IMAGE_HEIGHT = 252;
export const METRIC_ICON_SIZE = 24;

/**
 * @param {string} id
 * @param {string} detailRoutePattern e.g. `/admin/premium-photos/:id`
 */
export const getPremiumPhotoDetailPath = (id, detailRoutePattern) =>
  detailRoutePattern.replace(':id', id);

/**
 * @param {typeof PREMIUM_PHOTOS_CARDS} cards
 * @param {string} filterId
 */
export const filterPremiumPhotosCards = (cards, filterId) => {
  if (!filterId || filterId === 'all') return cards;
  return cards.filter((card) => card.type === filterId);
};

/**
 * @param {typeof PREMIUM_PHOTOS_CARDS} cards
 * @param {number} page 1-based
 * @param {number} pageSize
 */
export const paginatePremiumPhotosCards = (cards, page, pageSize) => {
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * pageSize;
  return cards.slice(startIndex, startIndex + pageSize);
};
