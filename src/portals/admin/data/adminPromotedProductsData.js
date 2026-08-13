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
  { id: 'single', labelKey: 'adminPromoted.filters.single' },
  { id: 'six', labelKey: 'adminPromoted.filters.six' },
  { id: 'zodiac', labelKey: 'adminPromoted.filters.zodiac' },
];

export const PROMOTED_TYPE_KEYS = {
  single: 'adminPromoted.types.single',
  six: 'adminPromoted.types.six',
  zodiac: 'adminPromoted.types.zodiac',
};

/**
 * Card variant "promoted" — landscape + upload date/time, views, heart, expiry.
 * Card variant "simple" — heart, views, date, price, expiry (same as gallery/premium).
 */
export const PROMOTED_CARDS = [
  {
    id: 'zodiac-1',
    type: 'zodiac',
    variant: 'promoted',
    titleKey: 'adminPromoted.cards.nordic.title',
    descriptionKey: 'adminPromoted.cards.nordic.description',
    image: `${H}/photo-zodiac.jpg`,
    categoryKey: 'adminPromoted.cards.nordic.category',
    uploadDateKey: 'adminPromoted.cards.nordic.uploadDate',
    uploadTimeKey: 'adminPromoted.cards.nordic.uploadTime',
    views: '1240',
    hearts: '1000',
    expiryKey: 'adminPromoted.cards.nordic.expiry',
    extraPhotos: 11,
  },
  {
    id: 'city-1',
    type: 'six',
    variant: 'promoted',
    titleKey: 'adminPromoted.cards.nordic.title',
    descriptionKey: 'adminPromoted.cards.nordic.description',
    image: `${H}/photo-city.jpg`,
    categoryKey: 'adminPromoted.cards.nordic.category',
    uploadDateKey: 'adminPromoted.cards.nordic.uploadDate',
    uploadTimeKey: 'adminPromoted.cards.nordic.uploadTime',
    views: '1240',
    hearts: '1000',
    expiryKey: 'adminPromoted.cards.nordic.expiry',
    extraPhotos: 5,
  },
  {
    id: 'harbor-1',
    type: 'six',
    variant: 'promoted',
    titleKey: 'adminPromoted.cards.nordic.title',
    descriptionKey: 'adminPromoted.cards.nordic.description',
    image: `${H}/photo-harbor.jpg`,
    categoryKey: 'adminPromoted.cards.nordic.category',
    uploadDateKey: 'adminPromoted.cards.nordic.uploadDate',
    uploadTimeKey: 'adminPromoted.cards.nordic.uploadTime',
    views: '1240',
    hearts: '1000',
    expiryKey: 'adminPromoted.cards.nordic.expiry',
    extraPhotos: 5,
  },
  {
    id: 'autumn-1',
    type: 'single',
    variant: 'simple',
    titleKey: 'adminPromoted.cards.autumn.title',
    image: `${H}/photo-autumn.jpg`,
    likes: '1,488',
    viewsSimple: '1,400',
    dateKey: 'adminPromoted.cards.autumn.date',
    price: '$2.00',
    expiryKey: 'adminPromoted.cards.autumn.expiry',
    extraPhotos: null,
  },
  {
    id: 'zodiac-2',
    type: 'zodiac',
    variant: 'promoted',
    titleKey: 'adminPromoted.cards.nordic.title',
    descriptionKey: 'adminPromoted.cards.nordic.description',
    image: `${H}/photo-tidal.jpg`,
    categoryKey: 'adminPromoted.cards.nordic.category',
    uploadDateKey: 'adminPromoted.cards.nordic.uploadDate',
    uploadTimeKey: 'adminPromoted.cards.nordic.uploadTime',
    views: '1240',
    hearts: '1000',
    expiryKey: 'adminPromoted.cards.nordic.expiry',
    extraPhotos: 11,
  },
  {
    id: 'city-2',
    type: 'six',
    variant: 'promoted',
    titleKey: 'adminPromoted.cards.nordic.title',
    descriptionKey: 'adminPromoted.cards.nordic.description',
    image: `${H}/photo-golden.jpg`,
    categoryKey: 'adminPromoted.cards.nordic.category',
    uploadDateKey: 'adminPromoted.cards.nordic.uploadDate',
    uploadTimeKey: 'adminPromoted.cards.nordic.uploadTime',
    views: '1240',
    hearts: '1000',
    expiryKey: 'adminPromoted.cards.nordic.expiry',
    extraPhotos: 5,
  },
  {
    id: 'harbor-2',
    type: 'six',
    variant: 'promoted',
    titleKey: 'adminPromoted.cards.nordic.title',
    descriptionKey: 'adminPromoted.cards.nordic.description',
    image: `${H}/photo-morning.jpg`,
    categoryKey: 'adminPromoted.cards.nordic.category',
    uploadDateKey: 'adminPromoted.cards.nordic.uploadDate',
    uploadTimeKey: 'adminPromoted.cards.nordic.uploadTime',
    views: '1240',
    hearts: '1000',
    expiryKey: 'adminPromoted.cards.nordic.expiry',
    extraPhotos: 5,
  },
  {
    id: 'autumn-2',
    type: 'single',
    variant: 'simple',
    titleKey: 'adminPromoted.cards.autumn.title',
    image: `${H}/photo-wings.jpg`,
    likes: '1,488',
    viewsSimple: '1,400',
    dateKey: 'adminPromoted.cards.autumn.date',
    price: '$2.00',
    expiryKey: 'adminPromoted.cards.autumn.expiry',
    extraPhotos: null,
  },
  {
    id: 'zodiac-3',
    type: 'zodiac',
    variant: 'promoted',
    titleKey: 'adminPromoted.cards.nordic.title',
    descriptionKey: 'adminPromoted.cards.nordic.description',
    image: `${H}/photo-forest.jpg`,
    categoryKey: 'adminPromoted.cards.nordic.category',
    uploadDateKey: 'adminPromoted.cards.nordic.uploadDate',
    uploadTimeKey: 'adminPromoted.cards.nordic.uploadTime',
    views: '1240',
    hearts: '1000',
    expiryKey: 'adminPromoted.cards.nordic.expiry',
    extraPhotos: 11,
  },
  {
    id: 'city-3',
    type: 'six',
    variant: 'promoted',
    titleKey: 'adminPromoted.cards.nordic.title',
    descriptionKey: 'adminPromoted.cards.nordic.description',
    image: `${H}/photo-silent.jpg`,
    categoryKey: 'adminPromoted.cards.nordic.category',
    uploadDateKey: 'adminPromoted.cards.nordic.uploadDate',
    uploadTimeKey: 'adminPromoted.cards.nordic.uploadTime',
    views: '1240',
    hearts: '1000',
    expiryKey: 'adminPromoted.cards.nordic.expiry',
    extraPhotos: 5,
  },
  {
    id: 'harbor-3',
    type: 'six',
    variant: 'promoted',
    titleKey: 'adminPromoted.cards.nordic.title',
    descriptionKey: 'adminPromoted.cards.nordic.description',
    image: `${H}/photo-city.jpg`,
    categoryKey: 'adminPromoted.cards.nordic.category',
    uploadDateKey: 'adminPromoted.cards.nordic.uploadDate',
    uploadTimeKey: 'adminPromoted.cards.nordic.uploadTime',
    views: '1240',
    hearts: '1000',
    expiryKey: 'adminPromoted.cards.nordic.expiry',
    extraPhotos: 5,
  },
  {
    id: 'autumn-3',
    type: 'single',
    variant: 'simple',
    titleKey: 'adminPromoted.cards.autumn.title',
    image: `${H}/photo-autumn.jpg`,
    likes: '1,488',
    viewsSimple: '1,400',
    dateKey: 'adminPromoted.cards.autumn.date',
    price: '$2.00',
    expiryKey: 'adminPromoted.cards.autumn.expiry',
    extraPhotos: null,
  },
];

export const PROMOTED_PAGE_SIZE = 12;
export const PROMOTED_TOTAL_PAGES = 10;
export const CARD_IMAGE_WIDTH = 370;
export const CARD_IMAGE_HEIGHT = 252;
export const METRIC_ICON_SIZE = 24;

export const getPromotedDetailPath = (id, detailRoutePattern) =>
  detailRoutePattern.replace(':id', id);

export const filterPromotedCards = (cards, filterId) => {
  if (!filterId || filterId === 'all') return cards;
  return cards.filter((card) => card.type === filterId);
};
