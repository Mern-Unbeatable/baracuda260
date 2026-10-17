/** Admin Premium Photos — Configuration & Type Filters. */

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
  SINGLE: 'adminPremiumPhotos.types.single',
  SIX: 'adminPremiumPhotos.types.six',
  TWELVE: 'adminPremiumPhotos.types.zodiac',
};

/**
 * Initial empty cards array — live data is fetched directly from backend API.
 * Strict zero-mock rule.
 */
export const PREMIUM_PHOTOS_CARDS = [];

export const PREMIUM_PHOTOS_PAGE_SIZE = 10;
export const PREMIUM_PHOTOS_TOTAL_PAGES = 1;
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
 * @param {Array<any>} cards
 * @param {string} filterId
 */
export const filterPremiumPhotosCards = (cards = [], filterId = 'all') => {
  if (!filterId || filterId === 'all') return cards;
  const normalizedFilter = filterId.toLowerCase();

  return cards.filter((card) => {
    const type = String(card.type || '').toLowerCase();
    const kind = String(card.kind || '').toLowerCase();

    if (normalizedFilter === 'single') {
      return type === 'single' || kind === 'single';
    }
    if (normalizedFilter === 'six') {
      return type === 'six' || kind === 'six';
    }
    if (normalizedFilter === 'zodiac') {
      return type === 'zodiac' || kind === 'twelve';
    }

    return type === normalizedFilter || kind === normalizedFilter;
  });
};

/**
 * @param {Array<any>} cards
 * @param {number} page 1-based
 * @param {number} pageSize
 */
export const paginatePremiumPhotosCards = (cards, page, pageSize) => {
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * pageSize;
  return cards.slice(startIndex, startIndex + pageSize);
};
