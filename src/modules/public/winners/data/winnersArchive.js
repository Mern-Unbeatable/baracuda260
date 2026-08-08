const A = '/assets/home';

export const WINNER_BADGE_KEYS = {
  '1st PLACE': 'common.badges.firstPlace',
  '2nd PLACE': 'common.badges.secondPlace',
  '3rd PLACE': 'common.badges.thirdPlace',
  'Popular Vote': 'common.badges.popularVote',
  'Top Rated': 'common.badges.topRated',
  "Editor's Choice": 'common.badges.editorsChoice',
};

export const WINNERS_ARCHIVE = [
  {
    id: 'golden-horizons',
    title: 'Golden Horizons',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,612 Votes',
    date: 'Jan 2026',
    month: 'January',
    badge: '1st PLACE',
    badgeIcon: 'trophy',
    album: 'Single Photo',
    image: `${A}/winner-golden.jpg`,
  },
  {
    id: 'into-the-wild',
    title: 'Into the Wild',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '4,028 Votes',
    date: 'July 2026',
    month: 'July',
    badge: '2nd PLACE',
    badgeIcon: 'trophy',
    album: 'Single Photo',
    image: `${A}/winner-wild.jpg`,
  },
  {
    id: 'natures-whisper',
    title: "Nature's Whisper",
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,891 Votes',
    date: 'March 2026',
    month: 'March',
    badge: '3rd PLACE',
    badgeIcon: 'trophy',
    album: 'Single Photo',
    image: `${A}/winner-nature.jpg`,
  },
  {
    id: 'frozen-moments',
    title: 'Frozen Moments',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,745 Votes',
    date: 'Oct 2026',
    month: 'October',
    badge: 'Popular Vote',
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-frozen.jpg`,
  },
  {
    id: 'urban-reflections',
    title: 'Urban Reflections',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '4,156 Votes',
    date: 'Feb 2026',
    month: 'February',
    badge: 'Top Rated',
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-urban.jpg`,
  },
  {
    id: 'beyond-the-forest',
    title: 'Beyond the Forest',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,967 Votes',
    date: 'Apr 2026',
    month: 'April',
    badge: 'Popular Vote',
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-forest.jpg`,
  },
  {
    id: 'colors-of-dawn',
    title: 'Colors of Dawn',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '4,221 Votes',
    date: 'Aug 2026',
    month: 'August',
    badge: "Editor's Choice",
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-dawn.jpg`,
  },
  {
    id: 'klaus-fischer',
    title: 'Klaus Fischer',
    theme: 'THEME: SILENT STREETS',
    category: 'Cat : Single Short',
    votes: '3,840 Votes',
    date: 'May 2026',
    month: 'May',
    badge: 'Top Rated',
    badgeIcon: 'badge',
    album: 'Single Photo',
    image: `${A}/winner-klaus.jpg`,
  },
];

import { ALBUM_TYPE_LABEL_KEYS } from '@/shared/data/albumTypes';

export const getWinnerById = (id) =>
  WINNERS_ARCHIVE.find((entry) => entry.id === id) ?? null;

export const winnerDetailPath = (id) => `/winners/${id}`;

/** Shape expected by GalleryDetailView (single variant). */
export function toWinnerDetailEntry(winner, t) {
  const badgeLabel = t(WINNER_BADGE_KEYS[winner.badge] || winner.badge, {
    defaultValue: winner.badge,
  });
  const albumLabel = t(ALBUM_TYPE_LABEL_KEYS[winner.album] ?? 'common.singlePhoto');
  const votesDigits = winner.votes.replace(/\D/g, '');

  return {
    id: winner.id,
    title: winner.title,
    image: winner.image,
    badge: badgeLabel,
    category: albumLabel,
    votes: votesDigits,
    views: winner.views ?? '12,400',
    description: t('winnersDetail.summary', { title: winner.title }),
    photographer: winner.photographer ?? 'Kasia L.',
  };
}

export const WINNER_DETAIL_ASSETS = {
  trophy: `${A}/icon-trophy-cup.svg`,
  badge: `${A}/icon-badge.svg`,
};
