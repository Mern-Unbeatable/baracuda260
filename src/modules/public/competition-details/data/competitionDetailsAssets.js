/** My Competition Details — Figma node 111:1507. */

const A = '/assets/competition-details';

export const COMPETITION_DETAILS_ASSETS = {
  hero: `${A}/hero.jpg`,
  wave: `${A}/wave.svg`,
  votes: `${A}/icon-votes.svg`,
  position: `${A}/icon-position.svg`,
  chevronLeft: `${A}/chevron-left.svg`,
  chevronRight: `${A}/chevron-right.svg`,
  signs: {
    aries: `${A}/aries.svg`,
    taurus: `${A}/taurus.svg`,
    gemini: `${A}/gemini.svg`,
    cancer: `${A}/cancer.svg`,
    leo: `${A}/leo.svg`,
    virgo: `${A}/virgo.svg`,
  },
  thumbs: {
    1: `${A}/thumb-1.jpg`,
    2: `${A}/thumb-2.jpg`,
    3: `${A}/thumb-3.jpg`,
    4: `${A}/thumb-4.jpg`,
    5: `${A}/thumb-5.jpg`,
    6: `${A}/thumb-6.jpg`,
  },
  avatars: {
    1: `${A}/avatar-1.jpg`,
    2: `${A}/avatar-2.jpg`,
    3: `${A}/avatar-3.jpg`,
    4: `${A}/avatar-4.jpg`,
    5: `${A}/avatar-5.jpg`,
  },
};

export const RANK_BADGE_STYLES = {
  1: 'bg-[linear-gradient(135deg,#ffd700_0%,#fea619_100%)] text-white shadow-md',
  2: 'bg-[linear-gradient(135deg,#c0c0c0_0%,#a0a0a0_100%)] text-white shadow-md',
  3: 'bg-[#532aa8] text-white shadow-[0_0_0_4px_rgba(83,42,168,0.2)]',
  4: 'bg-[linear-gradient(135deg,#cd7f32_0%,#8b4513_100%)] text-white shadow-md',
  5: 'bg-[#e3e8f9] text-[#494453]',
};

/** Demo competition detail keyed by submission id. */
export const COMPETITION_DETAILS = {
  monochrome: {
    id: 'monochrome',
    status: 'pending',
    type: 'story6',
    category: 'nature',
    titleKey: 'competitionDetails.title',
    descriptionKey: 'competitionDetails.description',
    votes: '1,284',
    position: '15 th',
    slides: [
      {
        id: 'aries',
        number: 1,
        nameKey: 'competitionDetails.signs.aries',
        icon: COMPETITION_DETAILS_ASSETS.signs.aries,
        image: COMPETITION_DETAILS_ASSETS.thumbs[1],
        hero: COMPETITION_DETAILS_ASSETS.hero,
      },
      {
        id: 'taurus',
        number: 2,
        nameKey: 'competitionDetails.signs.taurus',
        icon: COMPETITION_DETAILS_ASSETS.signs.taurus,
        image: COMPETITION_DETAILS_ASSETS.thumbs[2],
        hero: COMPETITION_DETAILS_ASSETS.thumbs[2],
      },
      {
        id: 'gemini',
        number: 3,
        nameKey: 'competitionDetails.signs.gemini',
        icon: COMPETITION_DETAILS_ASSETS.signs.gemini,
        image: COMPETITION_DETAILS_ASSETS.thumbs[3],
        hero: COMPETITION_DETAILS_ASSETS.thumbs[3],
      },
      {
        id: 'cancer',
        number: 4,
        nameKey: 'competitionDetails.signs.cancer',
        icon: COMPETITION_DETAILS_ASSETS.signs.cancer,
        image: COMPETITION_DETAILS_ASSETS.thumbs[4],
        hero: COMPETITION_DETAILS_ASSETS.thumbs[4],
      },
      {
        id: 'leo',
        number: 5,
        nameKey: 'competitionDetails.signs.leo',
        icon: COMPETITION_DETAILS_ASSETS.signs.leo,
        image: COMPETITION_DETAILS_ASSETS.thumbs[5],
        hero: COMPETITION_DETAILS_ASSETS.thumbs[5],
      },
      {
        id: 'virgo',
        number: 6,
        nameKey: 'competitionDetails.signs.virgo',
        icon: COMPETITION_DETAILS_ASSETS.signs.virgo,
        image: COMPETITION_DETAILS_ASSETS.thumbs[6],
        hero: COMPETITION_DETAILS_ASSETS.thumbs[6],
      },
    ],
    rankings: [
      {
        id: 'alessandro',
        rank: 1,
        nameKey: 'competitionDetails.rankings.alessandro',
        wins: '14',
        votes: '12,450',
        avatar: COMPETITION_DETAILS_ASSETS.avatars[1],
        highlighted: false,
      },
      {
        id: 'elena',
        rank: 2,
        nameKey: 'competitionDetails.rankings.elena',
        wins: '11',
        votes: '11,820',
        avatar: COMPETITION_DETAILS_ASSETS.avatars[2],
        highlighted: false,
      },
      {
        id: 'sarah',
        rank: 3,
        nameKey: 'competitionDetails.rankings.sarah',
        wins: '09',
        votes: '8,940',
        avatar: COMPETITION_DETAILS_ASSETS.avatars[3],
        highlighted: true,
      },
      {
        id: 'julian',
        rank: 4,
        nameKey: 'competitionDetails.rankings.julian',
        wins: '07',
        votes: '10,910',
        avatar: COMPETITION_DETAILS_ASSETS.avatars[4],
        highlighted: false,
      },
      {
        id: 'marcus',
        rank: 5,
        nameKey: 'competitionDetails.rankings.marcus',
        wins: '05',
        votes: '9,420',
        avatar: COMPETITION_DETAILS_ASSETS.avatars[5],
        highlighted: false,
      },
    ],
    showingCount: 5,
    showingTotal: '24,802',
  },
};

export const DEFAULT_COMPETITION_DETAIL_ID = 'monochrome';

export function getCompetitionDetailById(id) {
  return COMPETITION_DETAILS[id] || COMPETITION_DETAILS[DEFAULT_COMPETITION_DETAIL_ID];
}
