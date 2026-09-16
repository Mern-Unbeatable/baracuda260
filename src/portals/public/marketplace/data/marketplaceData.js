/** Public Marketplace — aggregated creator store products. */

const H = '/assets/home';

export const MARKETPLACE_PAGE_SIZE = 8;

export const MARKETPLACE_CATEGORIES = [
  { id: 'all', value: 'all', labelKey: 'marketplace.filters.all' },
  { id: 'art-prints', value: 'art-prints', labelKey: 'marketplace.filters.artPrints' },
  { id: 'handmade', value: 'handmade', labelKey: 'marketplace.filters.handmade' },
  { id: 'apparel', value: 'apparel', labelKey: 'marketplace.filters.apparel' },
  { id: 'photobooks', value: 'photobooks', labelKey: 'marketplace.filters.photobooks' },
  { id: 'digital-preset', value: 'digital-preset', labelKey: 'marketplace.filters.digitalPreset' },
  { id: 'other', value: 'other', labelKey: 'marketplace.filters.other' },
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
    image: `${H}/photo-golden.jpg`,
    promoted: true,
  },
  {
    id: 'mp-02',
    title: 'Silent Harbor Canvas Edition',
    description: 'Limited canvas edition capturing quiet harbor reflections in cool evening tones.',
    price: '$54.00',
    category: 'art-prints',
    badgeKey: 'marketplace.filters.artPrints',
    store: 'Harbor Light Atelier',
    image: `${H}/photo-harbor.jpg`,
    promoted: false,
  },
  {
    id: 'mp-03',
    title: 'Forest Cathedral Handmade Frame',
    description: 'Handcrafted wood frame paired with a misty forest print for gallery-wall presence.',
    price: '$92.00',
    category: 'handmade',
    badgeKey: 'marketplace.filters.handmade',
    store: 'Elena Vance Studio',
    image: `${H}/photo-forest.jpg`,
    promoted: true,
  },
  {
    id: 'mp-04',
    title: 'Zodiac Journey Photobook',
    description: 'A 12-sign visual journey bound as a premium photobook with matte archival pages.',
    price: '$78.00',
    category: 'photobooks',
    badgeKey: 'marketplace.filters.photobooks',
    store: 'Zodiac Press',
    image: `${H}/photo-zodiac.jpg`,
    promoted: false,
  },
  {
    id: 'mp-05',
    title: 'Tidal Memory Apparel Tee',
    description: 'Soft cotton tee featuring a shoreline motif from the Tidal Memory collection.',
    price: '$36.00',
    category: 'apparel',
    badgeKey: 'marketplace.filters.apparel',
    store: 'Coastal Thread Co.',
    image: `${H}/photo-tidal.jpg`,
    promoted: false,
  },
  {
    id: 'mp-06',
    title: 'Morning Fields Lightroom Preset',
    description: 'Warm countryside grading pack tuned for soft sunrise landscapes and golden haze.',
    price: '$18.00',
    category: 'digital-preset',
    badgeKey: 'marketplace.filters.digitalPreset',
    store: 'Field Grade Labs',
    image: `${H}/photo-morning.jpg`,
    promoted: true,
  },
  {
    id: 'mp-07',
    title: 'City After Midnight Print',
    description: 'High-contrast city skyline print with cool dusk blues and architectural detail.',
    price: '$62.00',
    category: 'art-prints',
    badgeKey: 'marketplace.filters.artPrints',
    store: 'Nightline Studio',
    image: `${H}/photo-city.jpg`,
    promoted: false,
  },
  {
    id: 'mp-08',
    title: 'Autumn Sequence Mini Book',
    description: 'Compact seasonal storybook with six connected autumn frames and essay notes.',
    price: '$44.00',
    category: 'photobooks',
    badgeKey: 'marketplace.filters.photobooks',
    store: 'Zodiac Press',
    image: `${H}/photo-autumn.jpg`,
    promoted: false,
  },
  {
    id: 'mp-09',
    title: 'Wings Over the Marsh Print',
    description: 'Wildlife fine-art print with shallow depth and crisp feather detail.',
    price: '$58.00',
    category: 'art-prints',
    badgeKey: 'marketplace.filters.artPrints',
    store: 'Marsh & Feather',
    image: `${H}/photo-wings.jpg`,
    promoted: false,
  },
  {
    id: 'mp-10',
    title: 'Silent Streets Hoodie',
    description: 'Premium fleece hoodie with a subtle night-street graphic from the Silent collection.',
    price: '$72.00',
    category: 'apparel',
    badgeKey: 'marketplace.filters.apparel',
    store: 'Coastal Thread Co.',
    image: `${H}/photo-silent.jpg`,
    promoted: false,
  },
  {
    id: 'mp-11',
    title: 'Celestial Craft Bookmark Set',
    description: 'Handmade paper bookmarks with zodiac motifs and gold-foil accents.',
    price: '$24.00',
    category: 'handmade',
    badgeKey: 'marketplace.filters.handmade',
    store: 'Paper Orbit',
    image: `${H}/photo-zodiac.jpg`,
    promoted: false,
  },
  {
    id: 'mp-12',
    title: 'Studio Gift Card Bundle',
    description: 'Flexible gift card pack for prints, apparel, and custom studio commissions.',
    price: '$50.00',
    category: 'other',
    badgeKey: 'marketplace.filters.other',
    store: 'Elena Vance Studio',
    image: `${H}/photo-morning.jpg`,
    promoted: false,
  },
];

/**
 * @param {typeof MARKETPLACE_PRODUCTS} products
 * @param {{ category?: string, query?: string, promotedOnly?: boolean }} filters
 */
export const filterMarketplaceProducts = (products, { category = 'all', query = '', promotedOnly = false } = {}) => {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const categoryOk = !category || category === 'all' || product.category === category;
    const promotedOk = !promotedOnly || product.promoted;
    const searchOk =
      !normalizedQuery ||
      [product.title, product.description, product.store, product.category, product.price].some((field) =>
        String(field ?? '')
          .toLowerCase()
          .includes(normalizedQuery),
      );
    return categoryOk && promotedOk && searchOk;
  });

  return [...filtered].sort((a, b) => Number(Boolean(b.promoted)) - Number(Boolean(a.promoted)));
};
