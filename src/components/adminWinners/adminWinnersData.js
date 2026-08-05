/** Admin Winners — Figma nodes 339:4188 / podium 2066:504. */

const A = '/assets/admin-winners';

export const ADMIN_WINNERS_ASSETS = {
  anna: `${A}/avatar-anna.jpg`,
  piotr: `${A}/avatar-piotr.jpg`,
  marta: `${A}/avatar-marta.jpg`,
  eye: `${A}/icon-eye.svg`,
  calendar: `${A}/icon-calendar.svg`,
  chevronDown: `${A}/icon-chevron-down.svg`,
  medalGold: `${A}/medal-gold.png`,
  medalSilver: `${A}/medal-silver.png`,
  medalBronze: `${A}/medal-bronze.png`,
};

export const EYE_ICON_SIZE = 24;
export const CALENDAR_ICON_SIZE = 12;
export const CHEVRON_ICON_SIZE = 24;
export const TABLE_AVATAR_SIZE = 36;
/** Podium medal display size — Figma 2066:504. */
export const PODIUM_MEDAL_SIZE = { width: 28, height: 28 };
export const TABLE_MEDAL_SIZE = { width: 20, height: 20 };

export const PODIUM_SIZES = {
  first: 80,
  second: 56,
  third: 56,
};

export const RANK_MEDAL_ASSETS = {
  1: `${A}/medal-gold.png`,
  2: `${A}/medal-silver.png`,
  3: `${A}/medal-bronze.png`,
};

export const ALBUM_FORMATS = [
  { id: 'single', labelKey: 'adminWinners.formats.single' },
  { id: 'six', labelKey: 'adminWinners.formats.six' },
  { id: 'zodiac', labelKey: 'adminWinners.formats.zodiac' },
];

export const DEFAULT_ALBUM_FORMAT = 'six';

export const MONTH_OPTIONS = [
  { id: '2026-01', monthKey: 'adminWinners.months.january', year: 2026 },
  { id: '2026-02', monthKey: 'adminWinners.months.february', year: 2026 },
  { id: '2026-03', monthKey: 'adminWinners.months.march', year: 2026 },
  { id: '2026-04', monthKey: 'adminWinners.months.april', year: 2026 },
  { id: '2026-05', monthKey: 'adminWinners.months.may', year: 2026 },
  { id: '2026-06', monthKey: 'adminWinners.months.june', year: 2026 },
  { id: '2026-07', monthKey: 'adminWinners.months.july', year: 2026 },
  { id: '2026-08', monthKey: 'adminWinners.months.august', year: 2026 },
  { id: '2026-09', monthKey: 'adminWinners.months.september', year: 2026 },
  { id: '2026-10', monthKey: 'adminWinners.months.october', year: 2026 },
  { id: '2026-11', monthKey: 'adminWinners.months.november', year: 2026 },
  { id: '2026-12', monthKey: 'adminWinners.months.december', year: 2026 },
];

export const DEFAULT_MONTH_ID = '2026-07';

/** Shared photographer rows for July 2026 (Figma 339:4188). */
const JULY_SIX_WINNERS = [
  {
    id: 'anna-kowalska',
    rank: 1,
    firstNameKey: 'adminWinners.people.anna.firstName',
    nameKey: 'adminWinners.people.anna.name',
    cityKey: 'adminWinners.cities.krakow',
    votes: 4821,
    points: 9640,
    avatarKey: 'anna',
  },
  {
    id: 'piotr-mazur',
    rank: 2,
    firstNameKey: 'adminWinners.people.piotr.firstName',
    nameKey: 'adminWinners.people.piotr.name',
    cityKey: 'adminWinners.cities.warsaw',
    votes: 4203,
    points: 8406,
    avatarKey: 'piotr',
  },
  {
    id: 'marta-wisniewska',
    rank: 3,
    firstNameKey: 'adminWinners.people.marta.firstName',
    nameKey: 'adminWinners.people.marta.name',
    cityKey: 'adminWinners.cities.wroclaw',
    votes: 3981,
    points: 7962,
    avatarKey: 'marta',
  },
  {
    id: 'kamil-zajac',
    rank: 4,
    firstNameKey: 'adminWinners.people.kamil.firstName',
    nameKey: 'adminWinners.people.kamil.name',
    cityKey: 'adminWinners.cities.poznan',
    votes: 3542,
    points: 7084,
    initial: 'K',
  },
  {
    id: 'ewa-krawczyk',
    rank: 5,
    firstNameKey: 'adminWinners.people.ewa.firstName',
    nameKey: 'adminWinners.people.ewa.name',
    cityKey: 'adminWinners.cities.gdansk',
    votes: 3218,
    points: 6436,
    initial: 'E',
  },
  {
    id: 'tomasz-nowak',
    rank: 6,
    firstNameKey: 'adminWinners.people.tomasz.firstName',
    nameKey: 'adminWinners.people.tomasz.name',
    cityKey: 'adminWinners.cities.lodz',
    votes: 2967,
    points: 5934,
    initial: 'T',
  },
];

/**
 * Slightly shifted standings for other formats (demo data).
 * @param {typeof JULY_SIX_WINNERS} rows
 * @param {number} voteOffset
 */
const shiftVotes = (rows, voteOffset) =>
  rows.map((row, index) => ({
    ...row,
    votes: Math.max(100, row.votes + voteOffset - index * 40),
    points: Math.max(200, row.points + voteOffset * 2 - index * 80),
  }));

export const WINNERS_BY_FORMAT = {
  single: shiftVotes(JULY_SIX_WINNERS, -180),
  six: JULY_SIX_WINNERS,
  zodiac: shiftVotes(JULY_SIX_WINNERS, 220),
};

/**
 * @param {number} value
 * @param {string} [locale]
 */
export const formatCount = (value, locale = 'en') =>
  Number(value || 0).toLocaleString(locale === 'pl' ? 'pl-PL' : 'en-US');

/**
 * @param {string} formatId
 */
export const getWinnersForFormat = (formatId) =>
  WINNERS_BY_FORMAT[formatId] || WINNERS_BY_FORMAT[DEFAULT_ALBUM_FORMAT];

/**
 * @param {typeof JULY_SIX_WINNERS} winners
 */
export const getPodiumWinners = (winners) => {
  const byRank = (rank) => winners.find((winner) => winner.rank === rank) || null;
  return {
    second: byRank(2),
    first: byRank(1),
    third: byRank(3),
  };
};

/**
 * @param {string} monthId
 */
export const getMonthOption = (monthId) =>
  MONTH_OPTIONS.find((month) => month.id === monthId) || MONTH_OPTIONS.find((month) => month.id === DEFAULT_MONTH_ID);

/**
 * @param {number} rank
 */
export const getRankMedalSrc = (rank) => RANK_MEDAL_ASSETS[rank] || null;

/**
 * @param {number} rank
 */
export const getRankDisplay = (rank) => {
  if (RANK_MEDAL_ASSETS[rank]) return String(rank);
  return String(rank);
};

/**
 * @param {number} rank
 */
export const isMedalRank = (rank) => Boolean(RANK_MEDAL_ASSETS[rank]);
