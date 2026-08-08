/** Shared top-photographer standings for Home + Leaderboard page. */

const A = '/assets/home';

export const LEADERBOARD_STANDINGS_YEAR = 2026;

export const LEADERBOARD_ALBUM_TABS = [
  'Single Photo',
  '6 Photos',
  '12 photos - full Zodiac Story',
];

export const LEADERBOARD_ALBUM_TAB_LABEL_KEYS = {
  'Single Photo': 'common.singlePhoto',
  '6 Photos': 'common.sixPhotos',
  '12 photos - full Zodiac Story': 'common.twelveZodiac',
};

export const LEADERBOARD_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const LEADERBOARD_PODIUM = [
  {
    emoji: '🥈',
    name: 'Piotr',
    cityKey: 'warsaw',
    votesCount: '4,203',
    avatar: `${A}/avatar-piotr.jpg`,
    size: 64,
    border: 'border-[#e5e7eb]',
  },
  {
    emoji: '🥇',
    name: 'Anna',
    cityKey: 'krakow',
    votesCount: '4,821',
    avatar: `${A}/avatar-anna.jpg`,
    size: 80,
    border: 'border-[#fdc700]',
    lift: true,
  },
  {
    emoji: '🥉',
    name: 'Marta',
    cityKey: 'wroclaw',
    votesCount: '3,981',
    avatar: `${A}/avatar-marta.jpg`,
    size: 64,
    border: 'border-[#fee685]',
  },
];

export const LEADERBOARD_ROWS = [
  {
    rank: '🥇',
    name: 'Anna Kowalska',
    cityKey: 'krakow',
    votes: '4,821',
    points: '9,640',
    avatar: `${A}/avatar-anna.jpg`,
  },
  {
    rank: '🥈',
    name: 'Piotr Mazur',
    cityKey: 'warsaw',
    votes: '4,203',
    points: '8,406',
    avatar: `${A}/avatar-piotr.jpg`,
  },
  {
    rank: '🥉',
    name: 'Marta Wiśniewska',
    cityKey: 'wroclaw',
    votes: '3,981',
    points: '7,962',
    avatar: `${A}/avatar-marta.jpg`,
  },
  {
    rank: '4',
    name: 'Kamil Zając',
    cityKey: 'poznan',
    votes: '3,542',
    points: '7,084',
    initial: 'K',
  },
  {
    rank: '5',
    name: 'Ewa Krawczyk',
    cityKey: 'gdansk',
    votes: '3,218',
    points: '6,436',
    initial: 'E',
  },
  {
    rank: '6',
    name: 'Tomasz Nowak',
    cityKey: 'lodz',
    votes: '2,967',
    points: '5,934',
    initial: 'T',
  },
];
