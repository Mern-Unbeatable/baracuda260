import { matchesAlbumType } from '@/shared/data/albumTypes';

const A = '/assets/home';

export const MY_ARTWORK_PAGE_SIZE = 4;

export const MY_ARTWORK_STATS = [
  {
    id: 'total',
    labelKey: 'myArtwork.stats.total',
    value: '8',
    icon: 'images',
    iconBg: 'bg-[#ede9fe]',
    iconColor: 'text-[#7c3aed]',
  },
  {
    id: 'single',
    labelKey: 'myArtwork.stats.single',
    value: '3',
    icon: 'camera',
    iconBg: 'bg-[#dbeafe]',
    iconColor: 'text-[#2563eb]',
  },
  {
    id: 'six',
    labelKey: 'myArtwork.stats.six',
    value: '3',
    icon: 'layers',
    iconBg: 'bg-[#f3e8ff]',
    iconColor: 'text-[#9333ea]',
  },
  {
    id: 'twelve',
    labelKey: 'myArtwork.stats.twelve',
    value: '2',
    icon: 'book',
    iconBg: 'bg-[#ecedfa]',
    iconColor: 'text-[#4048cd]',
  },
  {
    id: 'entries',
    labelKey: 'myArtwork.stats.entries',
    value: '3',
    icon: 'trophy',
    iconBg: 'bg-[#fef3c7]',
    iconColor: 'text-[#b45309]',
  },
];

export const MY_ARTWORK_FILTER_TABS = [
  { value: 'All', labelKey: 'myArtwork.filters.all' },
  { value: 'Single Photo', labelKey: 'common.singlePhoto' },
  { value: '6 Photo Story', labelKey: 'common.sixPhotosStory' },
  { value: '12 photos - Full Zodiac Story', labelKey: 'common.twelveZodiac' },
  { value: 'Promoted', labelKey: 'myArtwork.filters.promoted' },
];

export const MY_ARTWORK_STATUS_FILTERS = ['all', 'profileOnly', 'inCompetition', 'ended'];

export const MY_ARTWORK_SORT_OPTIONS = ['newest', 'oldest'];

export const MY_ARTWORK_PROMOTE_TIERS = [
  { id: '7d', price: '$40', days: 7 },
  { id: '15d', price: '$60', days: 15 },
  { id: '30d', price: '$100', days: 30 },
];

const DESCRIPTION =
  'A 6-photo album exploring serene snowscapes, quiet fjord reflections, and remote cabin life in Northern..';

export const MY_ARTWORK_ITEMS = [
  {
    id: 'artwork-beetle',
    title: 'Nordic Solitude - 6 Chapter Journey',
    description: DESCRIPTION,
    category: 'Landscape',
    image: `${A}/photo-wings.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'Aug 9, 2026',
    uploadedTime: '12:03 PM',
    views: '1240',
    hearts: '1000',
    promoted: false,
    extraPhotoCount: null,
    footerState: 'active',
    competitionName: 'August Photography Competition',
    votes: '342',
    rank: '#12',
    votingEnds: '2026-08-31',
    progress: 75,
    createdAt: 8,
  },
  {
    id: 'artwork-six-profile',
    title: 'Chasing the Neon Stream',
    description: DESCRIPTION,
    category: 'Nature',
    image: `${A}/photo-autumn.jpg`,
    albumBadge: '6 Photos Story',
    uploadedDate: 'Aug 9, 2026',
    uploadedTime: '11:45 AM',
    views: '12400',
    hearts: '2150',
    promoted: false,
    extraPhotoCount: 5,
    footerState: 'profileOnly',
    storyTheme: 'red',
    createdAt: 7,
  },
  {
    id: 'artwork-six-ended',
    title: 'Nordic Solitude - 6 Chapter Journey',
    description: DESCRIPTION,
    category: 'Landscape',
    image: `${A}/photo-city.jpg`,
    albumBadge: '6 Photos Story',
    uploadedDate: 'Aug 9, 2026',
    uploadedTime: '10:20 AM',
    views: '1240',
    hearts: '1000',
    expiryDate: '8/12/2026',
    promoted: true,
    extraPhotoCount: 5,
    footerState: 'ended',
    storyTheme: 'blue',
    endedVotes: '410',
    createdAt: 6,
  },
  {
    id: 'artwork-zodiac-active',
    title: 'Chasing the Neon Stream',
    description: DESCRIPTION,
    category: 'Nature',
    image: `${A}/photo-zodiac.jpg`,
    albumBadge: '12 photos - full Zodiac Story',
    uploadedDate: 'Aug 8, 2026',
    uploadedTime: '4:15 PM',
    views: '12400',
    hearts: '2150',
    promoted: false,
    extraPhotoCount: 11,
    footerState: 'active',
    competitionName: 'August Photography Competition',
    votes: '2150',
    rank: '#8',
    votingEnds: '2026-08-31',
    progress: 62,
    createdAt: 5,
  },
  {
    id: 'artwork-forest-profile',
    title: 'Forest Cathedral',
    description: DESCRIPTION,
    category: 'Nature',
    image: `${A}/photo-forest.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'Aug 7, 2026',
    uploadedTime: '9:00 AM',
    views: '640',
    hearts: '510',
    promoted: false,
    extraPhotoCount: null,
    footerState: 'profileOnly',
    createdAt: 4,
  },
  {
    id: 'artwork-tidal-ended',
    title: 'Chasing the Neon Stream',
    description: DESCRIPTION,
    category: 'Nature',
    image: `${A}/photo-tidal.jpg`,
    albumBadge: '12 photos - full Zodiac Story',
    uploadedDate: 'Aug 6, 2026',
    uploadedTime: '2:30 PM',
    views: '12400',
    hearts: '2150',
    expiryDate: '8/10/2026',
    promoted: true,
    extraPhotoCount: 11,
    footerState: 'ended',
    endedVotes: '520',
    createdAt: 3,
  },
  {
    id: 'artwork-golden-active',
    title: 'Golden Hour Silence',
    description: DESCRIPTION,
    category: 'Landscape',
    image: `${A}/photo-golden.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'Aug 5, 2026',
    uploadedTime: '6:45 PM',
    views: '1580',
    hearts: '1200',
    promoted: false,
    extraPhotoCount: null,
    footerState: 'active',
    competitionName: 'August Photography Competition',
    votes: '410',
    rank: '#5',
    votingEnds: '2026-08-31',
    progress: 88,
    createdAt: 2,
  },
  {
    id: 'artwork-morning-ended',
    title: 'Morning Fields',
    description: DESCRIPTION,
    category: 'Landscape',
    image: `${A}/photo-morning.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'Aug 4, 2026',
    uploadedTime: '7:10 AM',
    views: '720',
    hearts: '600',
    promoted: false,
    extraPhotoCount: null,
    footerState: 'ended',
    endedVotes: '290',
    createdAt: 1,
  },
  {
    id: 'artwork-wings-profile',
    title: 'Wings Over the Marsh',
    description: DESCRIPTION,
    category: 'Wildlife',
    image: `${A}/photo-wings.jpg`,
    albumBadge: 'Single Photo',
    uploadedDate: 'Aug 3, 2026',
    uploadedTime: '1:22 PM',
    views: '890',
    hearts: '740',
    promoted: false,
    extraPhotoCount: null,
    footerState: 'profileOnly',
    createdAt: 0,
  },
  {
    id: 'artwork-city-promoted',
    title: 'City After Midnight',
    description: DESCRIPTION,
    category: 'Street Photography',
    image: `${A}/photo-city.jpg`,
    albumBadge: '6 Photos Story',
    uploadedDate: 'Aug 2, 2026',
    uploadedTime: '11:00 PM',
    views: '1320',
    hearts: '1050',
    expiryDate: '8/15/2026',
    promoted: true,
    extraPhotoCount: 5,
    footerState: 'profileOnly',
    storyTheme: 'blue',
    createdAt: -1,
  },
];

export const matchesMyArtworkFilter = (item, filterTab) => {
  if (filterTab === 'All') return true;
  if (filterTab === 'Promoted') return item.promoted;
  return matchesAlbumType(item.albumBadge, filterTab);
};

export const matchesMyArtworkStatus = (item, statusFilter) => {
  if (statusFilter === 'all') return true;
  if (statusFilter === 'inCompetition') return item.footerState === 'active';
  return item.footerState === statusFilter;
};

export const sortMyArtworkItems = (items, sort) => {
  const list = [...items];
  if (sort === 'oldest') list.sort((a, b) => a.createdAt - b.createdAt);
  else list.sort((a, b) => b.createdAt - a.createdAt);
  return list;
};
