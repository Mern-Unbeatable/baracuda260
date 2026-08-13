import { matchesAlbumType } from '@/shared/data/albumTypes';
import { formatBuyPhotoPrice } from '@/shared/data/buyPhotos';

const A = '/assets/home';

export const SELL_PHOTOS_PAGE_SIZE = 8;

export const SELL_PHOTOS_FILTER_TABS = [
  { value: 'All', labelKey: 'sellPhotos.filters.all' },
  { value: 'Single Photo', labelKey: 'common.singlePhoto' },
  { value: '6 Photo Story', labelKey: 'common.sixPhotosStory' },
  { value: '12 photos - Full Zodiac Story', labelKey: 'common.twelveZodiac' },
  { value: 'Promoted', labelKey: 'sellPhotos.filters.promoted' },
];

export const SELL_PHOTO_DEFAULT_PRICE = {
  'Single Photo': '$2.00',
  '6 Photos Story': '$5.00',
  '12 photos - full Zodiac Story': '$5.00',
};

export const SELL_PHOTOS_ITEMS = [
  {
    id: 'sell-autumn-1',
    title: 'Autumn Sequence',
    image: `${A}/photo-autumn.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'August 9, 2026',
    views: '1,400',
    hearts: '1,488',
    price: SELL_PHOTO_DEFAULT_PRICE['Single Photo'],
    promoted: false,
    extraPhotoCount: null,
    createdAt: 12,
  },
  {
    id: 'sell-autumn-6',
    title: 'Chasing the Neon Stream',
    image: `${A}/photo-autumn.jpg`,
    albumBadge: '6 Photos Story',
    category: 'Nature',
    uploadedDate: 'August 9, 2026',
    views: '12,400',
    hearts: '2,150',
    price: SELL_PHOTO_DEFAULT_PRICE['6 Photos Story'],
    detailPrice: '$25.00',
    totalSell: '120',
    promoted: true,
    expiryDate: '8/12/2026',
    extraPhotoCount: 5,
    storyTheme: 'red',
    createdAt: 11,
  },
  {
    id: 'sell-autumn-12',
    title: 'Autumn Sequence',
    image: `${A}/photo-zodiac.jpg`,
    albumBadge: '12 photos - full Zodiac Story',
    uploadedDate: 'August 9, 2026',
    views: '1,400',
    hearts: '1,488',
    price: SELL_PHOTO_DEFAULT_PRICE['12 photos - full Zodiac Story'],
    promoted: false,
    extraPhotoCount: 11,
    createdAt: 10,
  },
  {
    id: 'sell-neon-single',
    title: 'Chasing the Neon Stream',
    image: `${A}/photo-city.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'August 8, 2026',
    views: '2,150',
    hearts: '1,920',
    price: SELL_PHOTO_DEFAULT_PRICE['Single Photo'],
    promoted: true,
    expiryDate: '8/15/2026',
    extraPhotoCount: null,
    createdAt: 9,
  },
  {
    id: 'sell-nordic-six',
    title: 'Chasing the Neon Stream',
    image: `${A}/photo-autumn.jpg`,
    albumBadge: '6 Photos Story',
    category: 'Nature',
    uploadedDate: 'August 7, 2026',
    views: '12,400',
    hearts: '2,150',
    price: SELL_PHOTO_DEFAULT_PRICE['6 Photos Story'],
    detailPrice: '$25.00',
    totalSell: '120',
    promoted: false,
    extraPhotoCount: 5,
    storyTheme: 'blue',
    createdAt: 8,
  },
  {
    id: 'sell-golden-single',
    title: 'Golden Hour Silence',
    image: `${A}/photo-golden.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'August 6, 2026',
    views: '1,580',
    hearts: '1,200',
    price: SELL_PHOTO_DEFAULT_PRICE['Single Photo'],
    promoted: false,
    extraPhotoCount: null,
    createdAt: 7,
  },
  {
    id: 'sell-tidal-twelve',
    title: 'Chasing the Neon Stream',
    image: `${A}/photo-autumn.jpg`,
    albumBadge: '12 photos - full Zodiac Story',
    category: 'Nature',
    uploadedDate: 'August 5, 2026',
    views: '12,400',
    hearts: '2,150',
    price: SELL_PHOTO_DEFAULT_PRICE['12 photos - full Zodiac Story'],
    detailPrice: '$25.00',
    totalSell: '120',
    promoted: true,
    expiryDate: '8/20/2026',
    extraPhotoCount: 11,
    createdAt: 6,
  },
  {
    id: 'sell-morning-single',
    title: 'Morning Fields',
    image: `${A}/photo-morning.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'August 4, 2026',
    views: '720',
    hearts: '600',
    price: SELL_PHOTO_DEFAULT_PRICE['Single Photo'],
    promoted: false,
    extraPhotoCount: null,
    createdAt: 5,
  },
  {
    id: 'sell-wings-six',
    title: 'Wings Over the Marsh',
    image: `${A}/photo-wings.jpg`,
    albumBadge: '6 Photos Story',
    uploadedDate: 'August 3, 2026',
    views: '890',
    hearts: '740',
    price: SELL_PHOTO_DEFAULT_PRICE['6 Photos Story'],
    promoted: false,
    extraPhotoCount: 5,
    storyTheme: 'red',
    createdAt: 4,
  },
  {
    id: 'sell-city-twelve',
    title: 'City After Midnight',
    image: `${A}/photo-city.jpg`,
    albumBadge: '12 photos - full Zodiac Story',
    uploadedDate: 'August 2, 2026',
    views: '1,320',
    hearts: '1,050',
    price: SELL_PHOTO_DEFAULT_PRICE['12 photos - full Zodiac Story'],
    promoted: false,
    extraPhotoCount: 11,
    createdAt: 3,
  },
  {
    id: 'sell-autumn-2',
    title: 'Autumn Sequence',
    image: `${A}/photo-autumn.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'August 1, 2026',
    views: '1,400',
    hearts: '1,488',
    price: SELL_PHOTO_DEFAULT_PRICE['Single Photo'],
    promoted: false,
    extraPhotoCount: null,
    createdAt: 2,
  },
  {
    id: 'sell-autumn-3',
    title: 'Autumn Sequence',
    image: `${A}/photo-autumn.jpg`,
    albumBadge: '6 Photos Story',
    uploadedDate: 'July 31, 2026',
    views: '1,400',
    hearts: '1,488',
    price: SELL_PHOTO_DEFAULT_PRICE['6 Photos Story'],
    promoted: false,
    extraPhotoCount: 5,
    createdAt: 1,
  },
];

export const getSellPhotoDefaultPrice = (albumBadge) =>
  SELL_PHOTO_DEFAULT_PRICE[albumBadge] ?? formatBuyPhotoPrice(2);

export const matchesSellPhotosFilter = (item, filterTab) => {
  if (filterTab === 'All') return true;
  if (filterTab === 'Promoted') return item.promoted;
  return matchesAlbumType(item.albumBadge, filterTab);
};

export const sortSellPhotosItems = (items, sort = 'newest') => {
  const list = [...items];
  if (sort === 'oldest') list.sort((a, b) => a.createdAt - b.createdAt);
  else list.sort((a, b) => b.createdAt - a.createdAt);
  return list;
};
