/** Admin Gallery — Figma gallery list. */

const A = '/assets/admin-competitions';
const H = '/assets/home';

export const ADMIN_GALLERY_ASSETS = {
  eye: `${A}/icon-eye.svg`,
  heart: `${A}/icon-heart.svg`,
  calendar: `${H}/icon-calendar.svg`,
};

/** Album-type filter chip ids shown in the gallery header. */
export const GALLERY_FILTERS = [
  { id: 'all', labelKey: 'adminGallery.filters.all' },
  { id: 'single', labelKey: 'adminGallery.filters.single' },
  { id: 'six', labelKey: 'adminGallery.filters.six' },
  { id: 'zodiac', labelKey: 'adminGallery.filters.zodiac' },
];

export const GALLERY_TYPE_KEYS = {
  single: 'adminGallery.types.single',
  six: 'adminGallery.types.six',
  zodiac: 'adminGallery.types.zodiac',
};

const BASE_CARDS = [
  {
    id: 'autumn',
    type: 'six',
    titleKey: 'adminGallery.cards.autumn.title',
    descriptionKey: 'adminGallery.cards.autumn.description',
    image: `${H}/photo-autumn.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.autumn.date',
    extraPhotos: 5,
  },
  {
    id: 'wings',
    type: 'single',
    titleKey: 'adminGallery.cards.wings.title',
    descriptionKey: 'adminGallery.cards.wings.description',
    image: `${H}/photo-wings.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.wings.date',
    extraPhotos: null,
  },
  {
    id: 'city',
    type: 'six',
    titleKey: 'adminGallery.cards.city.title',
    descriptionKey: 'adminGallery.cards.city.description',
    image: `${H}/photo-city.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.city.date',
    extraPhotos: 5,
  },
  {
    id: 'forest',
    type: 'single',
    titleKey: 'adminGallery.cards.forest.title',
    descriptionKey: 'adminGallery.cards.forest.description',
    image: `${H}/photo-forest.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.forest.date',
    extraPhotos: null,
  },
  {
    id: 'morning',
    type: 'single',
    titleKey: 'adminGallery.cards.morning.title',
    descriptionKey: 'adminGallery.cards.morning.description',
    image: `${H}/photo-morning.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.morning.date',
    extraPhotos: null,
  },
  {
    id: 'harbor',
    type: 'single',
    titleKey: 'adminGallery.cards.harbor.title',
    descriptionKey: 'adminGallery.cards.harbor.description',
    image: `${H}/photo-harbor.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.harbor.date',
    extraPhotos: null,
  },
  {
    id: 'silent',
    type: 'single',
    titleKey: 'adminGallery.cards.silent.title',
    descriptionKey: 'adminGallery.cards.silent.description',
    image: `${H}/photo-silent.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.silent.date',
    extraPhotos: null,
  },
  {
    id: 'zodiac',
    type: 'zodiac',
    titleKey: 'adminGallery.cards.zodiac.title',
    descriptionKey: 'adminGallery.cards.zodiac.description',
    image: `${H}/photo-zodiac.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.zodiac.date',
    extraPhotos: 11,
  },
];

export const GALLERY_CARDS = [
  ...BASE_CARDS,
  {
    id: 'golden',
    type: 'single',
    titleKey: 'adminGallery.cards.golden.title',
    descriptionKey: 'adminGallery.cards.golden.description',
    image: `${H}/photo-golden.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.golden.date',
    extraPhotos: null,
  },
  {
    id: 'tidal',
    type: 'six',
    titleKey: 'adminGallery.cards.tidal.title',
    descriptionKey: 'adminGallery.cards.tidal.description',
    image: `${H}/photo-tidal.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.tidal.date',
    extraPhotos: 5,
  },
  {
    id: 'autumn-2',
    type: 'zodiac',
    titleKey: 'adminGallery.cards.autumn.title',
    descriptionKey: 'adminGallery.cards.autumn.description',
    image: `${H}/photo-zodiac.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.autumn.date',
    extraPhotos: 11,
  },
  {
    id: 'wings-2',
    type: 'single',
    titleKey: 'adminGallery.cards.wings.title',
    descriptionKey: 'adminGallery.cards.wings.description',
    image: `${H}/photo-wings.jpg`,
    likes: '1,488',
    views: '1,400',
    dateKey: 'adminGallery.cards.wings.date',
    extraPhotos: null,
  },
];

export const GALLERY_PAGE_SIZE = 12;
export const GALLERY_TOTAL_PAGES = 10;
export const PAGINATION_LEADING_PAGES = [1, 2, 3];
export const PAGINATION_ICON_SIZE = 16;
export const CARD_IMAGE_WIDTH = 370;
export const CARD_IMAGE_HEIGHT = 252;
export const METRIC_ICON_SIZE = 24;

/**
 * @param {string} id
 * @param {string} detailRoutePattern e.g. `/admin/gallery/:id`
 */
export const getGalleryDetailPath = (id, detailRoutePattern) =>
  detailRoutePattern.replace(':id', id);

/**
 * @param {typeof GALLERY_CARDS} cards
 * @param {string} filterId
 */
export const filterGalleryCards = (cards, filterId) => {
  if (!filterId || filterId === 'all') return cards;
  return cards.filter((card) => card.type === filterId);
};

/**
 * @param {typeof GALLERY_CARDS} cards
 * @param {number} page 1-based
 * @param {number} pageSize
 */
export const paginateGalleryCards = (cards, page, pageSize) => {
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * pageSize;
  return cards.slice(startIndex, startIndex + pageSize);
};
