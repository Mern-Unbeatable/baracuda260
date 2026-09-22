/** Member My Store — product listings + upload. */

const H = '/assets/home';

export const MY_STORE_PAGE_SIZE = 8;

export const MY_STORE_CATEGORIES = [
  { id: 'all', value: 'all', labelKey: 'myStore.filters.all' },
  {
    id: 'art-prints',
    value: 'art-prints',
    labelKey: 'myStore.filters.artPrints',
  },
  { id: 'handmade', value: 'handmade', labelKey: 'myStore.filters.handmade' },
  { id: 'apparel', value: 'apparel', labelKey: 'myStore.filters.apparel' },
  {
    id: 'photobooks',
    value: 'photobooks',
    labelKey: 'myStore.filters.photobooks',
  },
  {
    id: 'digital-preset',
    value: 'digital-preset',
    labelKey: 'myStore.filters.digitalPreset',
  },
  { id: 'other', value: 'other', labelKey: 'myStore.filters.other' },
];

export const MY_STORE_CATEGORY_OPTIONS = [
  {
    id: 'astrophotography',
    labelKey: 'myStore.upload.categories.astrophotography',
  },
  { id: 'art-prints', labelKey: 'myStore.upload.categories.artPrints' },
  { id: 'handmade', labelKey: 'myStore.upload.categories.handmade' },
  { id: 'apparel', labelKey: 'myStore.upload.categories.apparel' },
  { id: 'photobooks', labelKey: 'myStore.upload.categories.photobooks' },
  { id: 'digital-preset', labelKey: 'myStore.upload.categories.digitalPreset' },
  { id: 'other', labelKey: 'myStore.upload.categories.other' },
];

export const MY_STORE_PRODUCTS = [
  {
    id: 'store-01',
    title: 'Dolomites Dawn - Archival Fine Art Print',
    description:
      'Museum-grade archival print with rich alpine color and soft dawn light across the Dolomites ridgeline.',
    price: '$68.00',
    category: 'art-prints',
    badgeKey: 'myStore.badges.artPrints',
    image: `${H}/photo-golden.webp`,
    promoted: true,
  },
  {
    id: 'store-02',
    title: 'Silent Harbor Canvas Edition',
    description:
      'Limited canvas edition capturing quiet harbor reflections in cool evening tones.',
    price: '$54.00',
    category: 'art-prints',
    badgeKey: 'myStore.badges.digitalArtPrint',
    image: `${H}/photo-harbor.webp`,
  },
  {
    id: 'store-03',
    title: 'Forest Cathedral Handmade Frame',
    description:
      'Handcrafted wood frame paired with a misty forest print for gallery-wall presence.',
    price: '$92.00',
    category: 'handmade',
    badgeKey: 'myStore.badges.handmadeCrafts',
    image: `${H}/photo-forest.webp`,
    promoted: true,
  },
  {
    id: 'store-04',
    title: 'Zodiac Journey Photobook',
    description:
      'A 12-sign visual journey bound as a premium photobook with matte archival pages.',
    price: '$78.00',
    category: 'photobooks',
    badgeKey: 'myStore.badges.photobooks',
    image: `${H}/photo-zodiac.webp`,
  },
  {
    id: 'store-05',
    title: 'Tidal Memory Apparel Tee',
    description:
      'Soft cotton tee featuring a shoreline motif from the Tidal Memory collection.',
    price: '$36.00',
    category: 'apparel',
    badgeKey: 'myStore.badges.apparel',
    image: `${H}/photo-tidal.webp`,
  },
  {
    id: 'store-06',
    title: 'Morning Fields Lightroom Preset',
    description:
      'Warm countryside grading pack tuned for soft sunrise landscapes and golden haze.',
    price: '$18.00',
    category: 'digital-preset',
    badgeKey: 'myStore.badges.digitalPreset',
    image: `${H}/photo-morning.webp`,
  },
  {
    id: 'store-07',
    title: 'City After Midnight Print',
    description:
      'High-contrast city skyline print with cool dusk blues and architectural detail.',
    price: '$62.00',
    category: 'art-prints',
    badgeKey: 'myStore.badges.artPrints',
    image: `${H}/photo-city.webp`,
  },
  {
    id: 'store-08',
    title: 'Autumn Sequence Mini Book',
    description:
      'Compact seasonal storybook with six connected autumn frames and essay notes.',
    price: '$44.00',
    category: 'photobooks',
    badgeKey: 'myStore.badges.photobooks',
    image: `${H}/photo-autumn.webp`,
  },
  {
    id: 'store-09',
    title: 'Wings Over the Marsh Print',
    description:
      'Wildlife fine-art print with shallow depth and crisp feather detail.',
    price: '$58.00',
    category: 'art-prints',
    badgeKey: 'myStore.badges.digitalArtPrint',
    image: `${H}/photo-wings.webp`,
  },
  {
    id: 'store-10',
    title: 'Silent Streets Hoodie',
    description:
      'Premium fleece hoodie with a subtle night-street graphic from the Silent collection.',
    price: '$72.00',
    category: 'apparel',
    badgeKey: 'myStore.badges.apparel',
    image: `${H}/photo-silent.webp`,
  },
  {
    id: 'store-11',
    title: 'Celestial Craft Bookmark Set',
    description:
      'Handmade paper bookmarks with zodiac motifs and gold-foil accents.',
    price: '$24.00',
    category: 'handmade',
    badgeKey: 'myStore.badges.handmadeCrafts',
    image: `${H}/photo-zodiac.webp`,
  },
  {
    id: 'store-12',
    title: 'Golden Hour Cinematic Preset',
    description:
      'Digital preset pack for warm cinematic portraits and landscape glow.',
    price: '$22.00',
    category: 'digital-preset',
    badgeKey: 'myStore.badges.digitalPreset',
    image: `${H}/photo-golden.webp`,
  },
  {
    id: 'store-13',
    title: 'Studio Gift Card Bundle',
    description:
      'Flexible gift card pack for prints, apparel, and custom studio commissions.',
    price: '$50.00',
    category: 'other',
    badgeKey: 'myStore.badges.other',
    image: `${H}/photo-morning.webp`,
  },
];

export const filterStoreProducts = (products, category) => {
  if (!category || category === 'all') return products;
  return products.filter((product) => product.category === category);
};

export const EMPTY_STORE_UPLOAD_FORM = {
  title: '',
  category: 'astrophotography',
  price: '',
  edition: '',
  description: '',
};

export const getStoreProductById = (productId) =>
  MY_STORE_PRODUCTS.find((product) => product.id === productId) || null;

export const buildStoreFormFromProduct = (product) => {
  if (!product) return { ...EMPTY_STORE_UPLOAD_FORM };

  return {
    title: product.title || '',
    category: product.category || 'astrophotography',
    price: product.price || '',
    edition: product.edition || '',
    description: product.description || '',
  };
};
