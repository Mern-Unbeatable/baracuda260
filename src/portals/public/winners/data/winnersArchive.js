import { ALBUM_TYPE_LABEL_KEYS, matchesAlbumType } from '@/shared/data/albumTypes';

const A = '/assets/home';

export const WINNER_BADGE_KEYS = {
  '1st PLACE': 'common.badges.firstPlace',
  '2nd PLACE': 'common.badges.secondPlace',
  '3rd PLACE': 'common.badges.thirdPlace',
  'Popular Vote': 'common.badges.popularVote',
  'Top Rated': 'common.badges.topRated',
  "Editor's Choice": 'common.badges.editorsChoice',
};

const WINNER_DESCRIPTION =
  "I'm excited to share my new Summer Collection from the Polish countryside — misty forests, golden light, and quiet seasonal detail.";

export const WINNERS_ARCHIVE = [
  {
    id: 'winner-autumn-sequence',
    title: 'Autumn Sequence',
    description: WINNER_DESCRIPTION,
    votes: '1,488',
    views: '1,400',
    date: 'August 9, 2026',
    month: 'July',
    rank: '1st PLACE',
    album: 'Single Photo',
    albumBadge: 'Single Photo',
    image: `${A}/photo-forest.jpg`,
  },
  {
    id: 'winner-zodiac-journey',
    title: 'Autumn Sequence',
    description: WINNER_DESCRIPTION,
    votes: '1,488',
    views: '1,400',
    date: 'August 9, 2026',
    month: 'July',
    rank: '2nd PLACE',
    album: '12 photos - full Zodiac Story',
    albumBadge: '12 photos - full Zodiac Story',
    extraPhotoCount: 11,
    image: `${A}/photo-zodiac.jpg`,
  },
  {
    id: 'winner-wings-marsh',
    title: 'Autumn Sequence',
    description: WINNER_DESCRIPTION,
    votes: '1,488',
    views: '1,400',
    date: 'August 9, 2026',
    month: 'July',
    rank: '3rd PLACE',
    album: 'Single Photo',
    albumBadge: 'Single Photo',
    image: `${A}/photo-wings.jpg`,
  },
  {
    id: 'winner-six-story',
    title: 'Autumn Sequence',
    description: WINNER_DESCRIPTION,
    votes: '1,488',
    views: '1,400',
    date: 'August 9, 2026',
    month: 'July',
    rank: '1st PLACE',
    album: '6 Photos',
    albumBadge: '6 Photos Story',
    extraPhotoCount: 5,
    image: `${A}/photo-autumn.jpg`,
  },
  {
    id: 'winner-morning-fields',
    title: 'Autumn Sequence',
    description: WINNER_DESCRIPTION,
    votes: '1,488',
    views: '1,400',
    date: 'August 9, 2026',
    month: 'July',
    rank: '2nd PLACE',
    album: 'Single Photo',
    albumBadge: 'Single Photo',
    image: `${A}/photo-morning.jpg`,
  },
  {
    id: 'winner-tidal-memory',
    title: 'Autumn Sequence',
    description: WINNER_DESCRIPTION,
    votes: '1,488',
    views: '1,400',
    date: 'August 9, 2026',
    month: 'July',
    rank: '3rd PLACE',
    album: '12 photos - full Zodiac Story',
    albumBadge: '12 photos - full Zodiac Story',
    extraPhotoCount: 11,
    image: `${A}/photo-tidal.jpg`,
  },
  {
    id: 'winner-city-midnight',
    title: 'Autumn Sequence',
    description: WINNER_DESCRIPTION,
    votes: '1,488',
    views: '1,400',
    date: 'August 9, 2026',
    month: 'July',
    rank: '1st PLACE',
    album: '6 Photos',
    albumBadge: '6 Photos Story',
    extraPhotoCount: 5,
    image: `${A}/photo-city.jpg`,
  },
  {
    id: 'winner-golden-hour',
    title: 'Golden Horizons',
    description: WINNER_DESCRIPTION,
    votes: '3,612',
    views: '8,420',
    date: 'January 15, 2026',
    month: 'January',
    rank: '1st PLACE',
    album: 'Single Photo',
    albumBadge: 'Single Photo',
    image: `${A}/winner-golden.jpg`,
  },
];

export const WINNER_FILTER_TABS = [
  { value: 'All Entries', labelKey: 'common.allEntries' },
  { value: 'Single Photo', labelKey: 'common.singlePhoto' },
  { value: '6 Photos', labelKey: 'common.sixPhotos' },
  { value: '12 photos - full Zodiac Story', labelKey: 'common.twelveZodiac' },
];

export const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

export const matchesWinnerAlbumFilter = (item, filterTab) => {
  if (filterTab === 'All Entries') return true;
  return item.album === filterTab || matchesAlbumType(item.albumBadge, filterTab);
};

export const getWinnerById = (id) => WINNERS_ARCHIVE.find((entry) => entry.id === id) ?? null;

export const winnerDetailPath = (id) => `/winners/${id}`;

/** Shape expected by GalleryDetailView (single variant). */
export function toWinnerDetailEntry(winner, t) {
  const badgeLabel = t(SHOWCASE_BADGE_KEYS[winner.albumBadge] || winner.albumBadge, {
    defaultValue: winner.albumBadge,
  });
  const albumLabel = t(ALBUM_TYPE_LABEL_KEYS[winner.album] ?? 'common.singlePhoto');
  const votesDigits = String(winner.votes ?? '').replace(/\D/g, '');

  return {
    id: winner.id,
    title: winner.title,
    image: winner.image,
    badge: badgeLabel,
    category: albumLabel,
    votes: votesDigits,
    views: winner.views ?? '12,400',
    description: winner.description ?? t('winnersDetail.summary', { title: winner.title }),
    photographer: winner.photographer ?? 'Kasia L.',
  };
}

export const WINNER_DETAIL_ASSETS = {
  trophy: `${A}/icon-trophy-cup.svg`,
  badge: `${A}/icon-badge.svg`,
};
