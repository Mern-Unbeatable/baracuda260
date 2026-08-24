import { GALLERY_PHOTOS } from '@/shared/data/galleryPhotos';

const A = '/assets/home';

export const PHOTOGRAPHER_ASSETS = {
  avatar: `${A}/avatar-marta.jpg`,
  featuredHero: `${A}/photo-morning.jpg`,
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
  bio: [
    "I'm a passionate photographer who loves turning real moments into timeless visual stories. With a strong eye for detail, composition, and natural emotions, I focus on creating photographs that feel authentic, beautiful, and meaningful. From portraits and weddings to lifestyle and special events, I enjoy capturing the moments that people want to remember forever. My goal is not just to take a photograph, but to tell a story through every frame.",
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

export const PHOTOGRAPHER_ARTWORK = Object.entries(ARTWORK_META).map(([id, meta]) => {
  const photo = galleryById[id];
  if (!photo) return null;
  return { ...photo, ...meta };
}).filter(Boolean);

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

export const PROFILE_SORT_OPTIONS = ['newest', 'oldest', 'mostLiked', 'mostViewed'];

export const PROFILE_ALBUM_FILTERS = [
  { id: 'all', value: 'All', shortLabelKey: 'common.filtersShort.all' },
  { id: 'single', value: 'Single Photo', shortLabelKey: 'common.filtersShort.single' },
  { id: 'six', value: '6 Photo Story', shortLabelKey: 'common.filtersShort.six' },
  { id: 'zodiac', value: '12 photos - Full Zodiac Story', shortLabelKey: 'common.filtersShort.zodiac' },
];
