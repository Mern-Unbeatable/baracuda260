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
  SINGLE: 'adminGallery.types.single',
  SIX: 'adminGallery.types.six',
  TWELVE: 'adminGallery.types.zodiac',
};

export const GALLERY_CARDS = [];

export const GALLERY_PAGE_SIZE = 10;
export const GALLERY_TOTAL_PAGES = 1;
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
  if (!filterId || filterId === 'all' || !Array.isArray(cards)) return cards || [];
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
 * @param {typeof GALLERY_CARDS} cards
 * @param {number} page 1-based
 * @param {number} pageSize
 */
export const paginateGalleryCards = (cards, page, pageSize) => {
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * pageSize;
  return cards.slice(startIndex, startIndex + pageSize);
};
