/** Public Marketplace — aggregated creator store products. */

const H = '/assets/home';

export const MARKETPLACE_PAGE_SIZE = 8;

export const MARKETPLACE_CATEGORIES = [
  { id: 'all', value: 'all', labelKey: 'marketplace.filters.all' },
  {
    id: 'art-prints',
    value: 'art-prints',
    labelKey: 'marketplace.filters.artPrints',
  },
  {
    id: 'handmade',
    value: 'handmade',
    labelKey: 'marketplace.filters.handmade',
  },
  { id: 'apparel', value: 'apparel', labelKey: 'marketplace.filters.apparel' },
  {
    id: 'photobooks',
    value: 'photobooks',
    labelKey: 'marketplace.filters.photobooks',
  },
  {
    id: 'digital-preset',
    value: 'digital-preset',
    labelKey: 'marketplace.filters.digitalPreset',
  },
  { id: 'other', value: 'other', labelKey: 'marketplace.filters.other' },
];

export const MARKETPLACE_STORES = [
  {
    id: 'st-01',
    storeName: 'Elena Vance Studio',
    authorImage: '/assets/home/avatar-anna.webp',
    description:
      'Fine art prints, handcrafted frames, and premium studio commissions.',
    image: `${H}/photo-golden.webp`,
    promoted: true,
    scores: { gold: 24, silver: 17, bronze: 10 },
  },
  {
    id: 'st-02',
    storeName: 'Zodiac Press',
    authorImage: '/assets/home/avatar-piotr.webp',
    description: 'Premium photobooks and celestial craft goods.',
    image: `${H}/photo-zodiac.webp`,
    promoted: true,
    scores: { gold: 12, silver: 5, bronze: 3 },
  },
  {
    id: 'st-03',
    storeName: 'Harbor Light Atelier',
    authorImage: '/assets/home/avatar-marta.webp',
    description: 'Quiet harbor reflections and canvas editions.',
    image: `${H}/photo-harbor.webp`,
    promoted: false,
    scores: { gold: 8, silver: 2, bronze: 1 },
  },
  {
    id: 'st-04',
    storeName: 'Coastal Thread Co.',
    authorImage: '/assets/home/avatar-photographer.webp',
    description: 'Soft cotton tees and premium fleece with shoreline motifs.',
    image: `${H}/photo-tidal.webp`,
    promoted: false,
    scores: { gold: 45, silver: 20, bronze: 5 },
  },
  {
    id: 'st-05',
    storeName: 'Field Grade Labs',
    authorImage: '/assets/home/avatar-anna.webp',
    description: 'Digital grading packs and Lightroom presets for landscapes.',
    image: `${H}/photo-morning.webp`,
    promoted: false,
    scores: { gold: 2, silver: 1, bronze: 0 },
  },
  {
    id: 'st-06',
    storeName: 'Nightline Studio',
    authorImage: '/assets/home/avatar-piotr.webp',
    description: 'High-contrast city skylines and dusk architectural prints.',
    image: `${H}/photo-city.webp`,
    promoted: false,
    scores: { gold: 15, silver: 8, bronze: 4 },
  },
];

export const MARKETPLACE_PRODUCTS = [
  {
    id: 'mp-01',
    title: 'Dolomites Dawn - Archival Fine Art Print',
    description:
      'Museum-grade archival print with rich alpine color and soft dawn light across the Dolomites ridgeline.',
    price: '$68.00',
    category: 'art-prints',
    badgeKey: 'marketplace.filters.artPrints',
    store: 'Elena Vance Studio',
    image: `${H}/photo-golden.webp`,
    promoted: true,
  },
  {
    id: 'mp-02',
    title: 'Silent Harbor Canvas Edition',
    description:
      'Limited canvas edition capturing quiet harbor reflections in cool evening tones.',
    price: '$54.00',
    category: 'art-prints',
    badgeKey: 'marketplace.filters.artPrints',
    store: 'Harbor Light Atelier',
    image: `${H}/photo-harbor.webp`,
    promoted: false,
  },
  {
    id: 'mp-03',
    title: 'Forest Cathedral Handmade Frame',
    description:
      'Handcrafted wood frame paired with a misty forest print for gallery-wall presence.',
    price: '$92.00',
    category: 'handmade',
    badgeKey: 'marketplace.filters.handmade',
    store: 'Elena Vance Studio',
    image: `${H}/photo-forest.webp`,
    promoted: true,
  },
  {
    id: 'mp-04',
    title: 'Zodiac Journey Photobook',
    description:
      'A 12-sign visual journey bound as a premium photobook with matte archival pages.',
    price: '$78.00',
    category: 'photobooks',
    badgeKey: 'marketplace.filters.photobooks',
    store: 'Zodiac Press',
    image: `${H}/photo-zodiac.webp`,
    promoted: false,
  },
  {
    id: 'mp-05',
    title: 'Tidal Memory Apparel Tee',
    description:
      'Soft cotton tee featuring a shoreline motif from the Tidal Memory collection.',
    price: '$36.00',
    category: 'apparel',
    badgeKey: 'marketplace.filters.apparel',
    store: 'Coastal Thread Co.',
    image: `${H}/photo-tidal.webp`,
    promoted: false,
  },
  {
    id: 'mp-06',
    title: 'Morning Fields Lightroom Preset',
    description:
      'Warm countryside grading pack tuned for soft sunrise landscapes and golden haze.',
    price: '$18.00',
    category: 'digital-preset',
    badgeKey: 'marketplace.filters.digitalPreset',
    store: 'Field Grade Labs',
    image: `${H}/photo-morning.webp`,
    promoted: true,
  },
  {
    id: 'mp-07',
    title: 'City After Midnight Print',
    description:
      'High-contrast city skyline print with cool dusk blues and architectural detail.',
    price: '$62.00',
    category: 'art-prints',
    badgeKey: 'marketplace.filters.artPrints',
    store: 'Nightline Studio',
    image: `${H}/photo-city.webp`,
    promoted: false,
  },
  {
    id: 'mp-08',
    title: 'Autumn Sequence Mini Book',
    description:
      'Compact seasonal storybook with six connected autumn frames and essay notes.',
    price: '$44.00',
    category: 'photobooks',
    badgeKey: 'marketplace.filters.photobooks',
    store: 'Zodiac Press',
    image: `${H}/photo-autumn.webp`,
    promoted: false,
  },
  {
    id: 'mp-09',
    title: 'Wings Over the Marsh Print',
    description:
      'Wildlife fine-art print with shallow depth and crisp feather detail.',
    price: '$58.00',
    category: 'art-prints',
    badgeKey: 'marketplace.filters.artPrints',
    store: 'Marsh & Feather',
    image: `${H}/photo-wings.webp`,
    promoted: false,
  },
  {
    id: 'mp-10',
    title: 'Silent Streets Hoodie',
    description:
      'Premium fleece hoodie with a subtle night-street graphic from the Silent collection.',
    price: '$72.00',
    category: 'apparel',
    badgeKey: 'marketplace.filters.apparel',
    store: 'Coastal Thread Co.',
    image: `${H}/photo-silent.webp`,
    promoted: false,
  },
  {
    id: 'mp-11',
    title: 'Celestial Craft Bookmark Set',
    description:
      'Handmade paper bookmarks with zodiac motifs and gold-foil accents.',
    price: '$24.00',
    category: 'handmade',
    badgeKey: 'marketplace.filters.handmade',
    store: 'Paper Orbit',
    image: `${H}/photo-zodiac.webp`,
    promoted: false,
  },
  {
    id: 'mp-12',
    title: 'Studio Gift Card Bundle',
    description:
      'Flexible gift card pack for prints, apparel, and custom studio commissions.',
    price: '$50.00',
    category: 'other',
    badgeKey: 'marketplace.filters.other',
    store: 'Elena Vance Studio',
    image: `${H}/photo-morning.webp`,
    promoted: false,
  },
];

/**
 * @param {typeof MARKETPLACE_PRODUCTS} products
 * @param {{ category?: string, query?: string, promotedOnly?: boolean }} filters
 */
export const filterMarketplaceProducts = (
  products,
  { category = 'all', query = '', promotedOnly = false } = {},
) => {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = products
    .map((product) => {
      const store = MARKETPLACE_STORES.find(
        (s) => s.storeName === product.store,
      );
      const isPromoted = product.promoted || (store?.promoted ?? false);
      return {
        ...product,
        promoted: isPromoted,
        storePromoted: store?.promoted ?? false,
      };
    })
    .filter((product) => {
      const categoryOk =
        !category || category === 'all' || product.category === category;
      const promotedOk = !promotedOnly || product.promoted;
      const searchOk =
        !normalizedQuery ||
        [
          product.title,
          product.description,
          product.store,
          product.category,
          product.price,
        ].some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(normalizedQuery),
        );
      return categoryOk && promotedOk && searchOk;
    });

  return [...filtered].sort(
    (a, b) => Number(Boolean(b.promoted)) - Number(Boolean(a.promoted)),
  );
};
