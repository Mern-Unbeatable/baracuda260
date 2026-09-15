import { GALLERY_PHOTOS } from '@/shared/data/galleryPhotos';

const A = '/assets/home';

export const PHOTOGRAPHER_ASSETS = {
  avatar: `${A}/avatar-marta.jpg`,
  featuredHero: `${A}/photo-morning.jpg`,
  featuredVideo: `${A}/photo-morning.jpg`,
  messageHero: `${A}/photo-golden.jpg`,
  messageMushroom: `${A}/photo-forest.jpg`,
  profileCover: `${A}/photo-silent.jpg`,
};

export const PHOTOGRAPHER_PROFILE = {
  name: 'Elena Vance',
  handle: '@elenavance',
  tagline: 'Nature & Landscape Photographer',
  location: 'Poland',
  avatar: PHOTOGRAPHER_ASSETS.avatar,
  coverImage: PHOTOGRAPHER_ASSETS.profileCover,
  website: 'https://www.elenavancephotography.com',
  websiteLabel: 'www.elenavancephotography.com',
  instagram: '@elenavance_photo',
  twitter: '@elenavance',
  youtube: '@elenavance_photo',
  tiktok: '@elenavance',
  bio: [
    "I'm a passionate photographer who loves turning real moments into timeless visual stories. With a strong eye for detail, composition, and natural emotions, I focus on creating photographs that feel authentic, beautiful, and meaningful. From portraits and weddings to lifestyle and special events, I enjoy capturing the moments that people want to remember forever.",
    'My goal is not just to take a photograph, but to tell a story through every frame — light, place, and feeling woven into a lasting memory.',
  ],
  stats: {
    followers: 1260,
    following: 120,
    profileVisitors: 2560,
    totalArtwork: 24,
    competitionEntries: 2,
    totalHearts: 4320,
  },
};

export const PHOTOGRAPHER_FEATURED_VIDEO = {
  image: PHOTOGRAPHER_ASSETS.featuredVideo,
  title: 'Polish countryside sunrise',
};

export const PHOTOGRAPHER_FEATURED = {
  badge: 'CURRENTLY IN COMPETITION',
  uploaded: 'Aug 05, 2026',
  title: 'August International Photography Competition 2026',
  subtitle: 'Summer Sunset in Tatra',
  votes: 342,
  rank: 12,
  votingEnds: 'Aug 31, 2026',
  image: PHOTOGRAPHER_ASSETS.featuredHero,
  detailHref: '/gallery/golden-hour-silence',
};

export const PHOTOGRAPHER_TALENT_APPRECIATION = {
  resetDays: 6,
  weekly: { gold: 1, silver: 0, bronze: 1 },
  tiers: [
    { id: 'gold', count: 24, awardedThisWeek: false },
    { id: 'silver', count: 17, awardedThisWeek: true },
    { id: 'bronze', count: 10, awardedThisWeek: false },
  ],
};

const ARTWORK_META = {
  'golden-hour-silence': { inCompetition: false, premium: false },
  'autumn-sequence': { inCompetition: true, premium: false, extraPhotoCount: 5 },
  'wings-over-the-marsh': { inCompetition: false, premium: false },
  'city-after-midnight': { inCompetition: true, premium: false, extraPhotoCount: 5 },
  'tidal-memory': { inCompetition: false, premium: true, price: '$5.00', extraPhotoCount: 11 },
  'forest-cathedral': { inCompetition: false, premium: true, price: '$2.00' },
  'morning-fields': { inCompetition: false, premium: true, price: '$2.00' },
  'zodiac-journey': { inCompetition: false, premium: true, price: '$5.00', extraPhotoCount: 11 },
};

const galleryById = Object.fromEntries(GALLERY_PHOTOS.map((photo) => [photo.id, photo]));

export const PHOTOGRAPHER_ARTWORK = Object.entries(ARTWORK_META)
  .map(([id, meta]) => {
    const photo = galleryById[id];
    if (!photo) return null;
    return { ...photo, ...meta };
  })
  .filter(Boolean);

export const PHOTOGRAPHER_PREMIUM = PHOTOGRAPHER_ARTWORK.filter((photo) => photo.premium);

export const PHOTOGRAPHER_MESSAGES = [
  {
    id: 'msg-1',
    author: 'Elena Vance',
    avatar: PHOTOGRAPHER_ASSETS.avatar,
    date: 'Aug 07, 2026',
    time: '09:45 AM',
    badge: 'PHOTOGRAPHER NOTE',
    text: "I'm excited to share my new Summer Collection from the Polish countryside featuring early sunrise mists over the Tatra valleys. The light conditions at 4:30 AM were truly magical!",
    image: PHOTOGRAPHER_ASSETS.messageHero,
    likes: 124,
  },
  {
    id: 'msg-2',
    author: 'Elena Vance',
    avatar: PHOTOGRAPHER_ASSETS.avatar,
    date: 'Aug 03, 2026',
    time: '06:20 PM',
    badge: 'PHOTOGRAPHER NOTE',
    text: 'Forest details tell a quieter story than wide landscapes. I spent an afternoon documenting texture, moss, and the soft geometry of mushrooms after rain.',
    image: PHOTOGRAPHER_ASSETS.messageMushroom,
    likes: 98,
  },
  {
    id: 'msg-3',
    author: 'Elena Vance',
    avatar: PHOTOGRAPHER_ASSETS.avatar,
    date: 'Jul 28, 2026',
    time: '11:10 AM',
    badge: 'PHOTOGRAPHER NOTE',
    text: 'Thank you for the support on my latest competition entry. Every vote and share helps this work reach more people in the community.',
    image: null,
    likes: 76,
  },
];

export const PHOTOGRAPHER_STORE_PAGE_SIZE = 8;

export const PHOTOGRAPHER_STORE_CATEGORIES = [
  { id: 'all', labelKey: 'photographerProfile.store.filters.all' },
  { id: 'art-prints', labelKey: 'photographerProfile.store.filters.artPrints' },
  { id: 'handmade', labelKey: 'photographerProfile.store.filters.handmade' },
  { id: 'apparel', labelKey: 'photographerProfile.store.filters.apparel' },
  { id: 'photobooks', labelKey: 'photographerProfile.store.filters.photobooks' },
  { id: 'digital-preset', labelKey: 'photographerProfile.store.filters.digitalPreset' },
];

export const PHOTOGRAPHER_STORE_PRODUCTS = [
  {
    id: 'store-01',
    title: 'Dolomites Dawn - Archival Fine Art Print',
    description:
      'Museum-grade 308gsm Hahnemühle Photo Rag, hand-signed with embossed studio seal.',
    detailParagraphs: [
      'Captured at 5:14 AM above Tre Cime di Lavaredo, Italy, this print preserves the first warm light along the alpine ridge after a night of clear, cold air.',
      'Printed on 100% cotton acid-free paper with archival pigment inks for lasting color and exhibition-ready presentation.',
    ],
    price: '$68.00',
    category: 'art-prints',
    badgeKey: 'photographerProfile.store.badges.artPrints',
    image: `${A}/photo-golden.jpg`,
    gallery: [
      `${A}/photo-golden.jpg`,
      `${A}/photo-morning.jpg`,
      `${A}/photo-silent.jpg`,
      `${A}/photo-harbor.jpg`,
    ],
    sizes: [
      { id: '12x36', label: '12 x 36 in ( Gallery Exhibition )' },
      { id: '16x24', label: '16 x 24 in ( A2 )' },
      { id: '24x36', label: '24 x 36 in ( Gallery Exhibition )' },
    ],
  },
  {
    id: 'store-02',
    title: 'Silent Harbor Canvas Edition',
    description: 'Limited canvas edition capturing quiet harbor reflections in cool evening tones.',
    detailParagraphs: [
      'A calm harbor scene printed on gallery-wrapped canvas with muted blues and soft night glow.',
    ],
    price: '$54.00',
    category: 'art-prints',
    badgeKey: 'photographerProfile.store.badges.digitalArtPrint',
    image: `${A}/photo-harbor.jpg`,
    gallery: [
      `${A}/photo-harbor.jpg`,
      `${A}/photo-tidal.jpg`,
      `${A}/photo-city.jpg`,
      `${A}/photo-silent.jpg`,
    ],
    sizes: [
      { id: '16x24', label: '16 x 24 in ( A2 )' },
      { id: '24x36', label: '24 x 36 in ( Gallery Exhibition )' },
    ],
  },
  {
    id: 'store-03',
    title: 'Forest Cathedral Handmade Frame',
    description: 'Handcrafted wood frame paired with a misty forest print for gallery-wall presence.',
    detailParagraphs: ['Handmade walnut frame with museum glass and archival backing.'],
    price: '$92.00',
    category: 'handmade',
    badgeKey: 'photographerProfile.store.badges.handmadeCrafts',
    image: `${A}/photo-forest.jpg`,
    gallery: [
      `${A}/photo-forest.jpg`,
      `${A}/photo-autumn.jpg`,
      `${A}/photo-morning.jpg`,
      `${A}/photo-wings.jpg`,
    ],
    sizes: [{ id: 'standard', label: 'Standard framed print' }],
  },
  {
    id: 'store-04',
    title: 'Zodiac Journey Photobook',
    description: 'A 12-sign visual journey bound as a premium photobook with matte archival pages.',
    detailParagraphs: [
      'Hardcover photobook spanning a full zodiac narrative across twelve chapters.',
    ],
    price: '$78.00',
    category: 'photobooks',
    badgeKey: 'photographerProfile.store.badges.photobooks',
    image: `${A}/photo-zodiac.jpg`,
    gallery: [
      `${A}/photo-zodiac.jpg`,
      `${A}/photo-golden.jpg`,
      `${A}/photo-forest.jpg`,
      `${A}/photo-city.jpg`,
    ],
    sizes: [{ id: 'hardcover', label: 'Hardcover · 120 pages' }],
  },
  {
    id: 'store-05',
    title: 'Tidal Memory Apparel Tee',
    description: 'Soft cotton tee featuring a shoreline motif from the Tidal Memory collection.',
    detailParagraphs: ['Soft unisex cotton tee with a tonal shoreline print.'],
    price: '$36.00',
    category: 'apparel',
    badgeKey: 'photographerProfile.store.badges.apparel',
    image: `${A}/photo-tidal.jpg`,
    gallery: [
      `${A}/photo-tidal.jpg`,
      `${A}/photo-harbor.jpg`,
      `${A}/photo-wings.jpg`,
      `${A}/photo-silent.jpg`,
    ],
    sizes: [
      { id: 's', label: 'S' },
      { id: 'm', label: 'M' },
      { id: 'l', label: 'L' },
      { id: 'xl', label: 'XL' },
    ],
  },
  {
    id: 'store-06',
    title: 'Morning Fields Lightroom Preset',
    description: 'Warm countryside grading pack tuned for soft sunrise landscapes and golden haze.',
    detailParagraphs: ['Digital Lightroom preset pack for warm countryside sunrise grading.'],
    price: '$18.00',
    category: 'digital-preset',
    badgeKey: 'photographerProfile.store.badges.digitalPreset',
    image: `${A}/photo-morning.jpg`,
    gallery: [
      `${A}/photo-morning.jpg`,
      `${A}/photo-golden.jpg`,
      `${A}/photo-autumn.jpg`,
      `${A}/photo-forest.jpg`,
    ],
    sizes: [{ id: 'digital', label: 'Digital download' }],
  },
  {
    id: 'store-07',
    title: 'City Lights Metal Print',
    description: 'High-gloss aluminum print of midnight city glow with crisp specular highlights.',
    detailParagraphs: ['Metal print with high-gloss finish for urban night scenes.'],
    price: '$72.00',
    category: 'art-prints',
    badgeKey: 'photographerProfile.store.badges.artPrints',
    image: `${A}/photo-city.jpg`,
    gallery: [
      `${A}/photo-city.jpg`,
      `${A}/photo-harbor.jpg`,
      `${A}/photo-silent.jpg`,
      `${A}/photo-tidal.jpg`,
    ],
    sizes: [
      { id: '16x24', label: '16 x 24 in ( A2 )' },
      { id: '20x30', label: '20 x 30 in' },
    ],
  },
  {
    id: 'store-08',
    title: 'Wings Over Water Art Print',
    description: 'Archival ink print of birds in flight across open water at dusk.',
    detailParagraphs: ['Archival paper print celebrating movement across open water.'],
    price: '$39.00',
    category: 'art-prints',
    badgeKey: 'photographerProfile.store.badges.artPrints',
    image: `${A}/photo-wings.jpg`,
    gallery: [
      `${A}/photo-wings.jpg`,
      `${A}/photo-tidal.jpg`,
      `${A}/photo-harbor.jpg`,
      `${A}/photo-morning.jpg`,
    ],
    sizes: [
      { id: '12x16', label: '12 x 16 in' },
      { id: '16x20', label: '16 x 20 in' },
    ],
  },
];

export const getPhotographerStoreProduct = (productId) =>
  PHOTOGRAPHER_STORE_PRODUCTS.find((product) => product.id === productId) || null;

export const PROFILE_SORT_OPTIONS = ['newest', 'oldest', 'mostLiked', 'mostViewed'];

export const PROFILE_ALBUM_FILTERS = [
  { id: 'all', value: 'All', shortLabelKey: 'common.filtersShort.all' },
  { id: 'single', value: 'Single Photo', shortLabelKey: 'common.filtersShort.single' },
  { id: 'six', value: '6 Photo Story', shortLabelKey: 'common.filtersShort.six' },
  {
    id: 'zodiac',
    value: '12 photos',
    shortLabelKey: 'common.filtersShort.zodiac',
  },
];
