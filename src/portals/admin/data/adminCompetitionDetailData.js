/** Admin Competition Photo Details — Figma 339:1796 / 339:1936 / 339:2155 / 339:2375. */

const DETAIL = '/assets/admin-competition-detail';
const HOME = '/assets/home';

export const ADMIN_DETAIL_ASSETS = {
  divider: `${DETAIL}/divider.svg`,
  photographer: `${HOME}/avatar-photographer.jpg`,
  commentAvatar: `${HOME}/avatar-comment.jpg`,
  verified: `${HOME}/icon-verified.svg`,
  arrow: `${HOME}/icon-arrow-nav.svg`,
  curves: {
    red: `${DETAIL}/curve-red.svg`,
    blue: `${DETAIL}/curve-blue.svg`,
    twelve: `${DETAIL}/curve-12.svg`,
  },
};

export const ADMIN_COMPETITION_VIDEO =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export const ADMIN_COMPETITION_COMMENTS = [
  {
    id: 'comment-1',
    nameKey: 'adminCompetitionDetail.comments.darrell',
    textKey: 'adminCompetitionDetail.comments.text1',
  },
  {
    id: 'comment-2',
    nameKey: 'adminCompetitionDetail.comments.darrell',
    textKey: 'adminCompetitionDetail.comments.text2',
  },
];

export const ADMIN_COMPETITION_RANKINGS = [
  {
    id: 'alessandro',
    rank: 1,
    nameKey: 'competitionDetails.rankings.alessandro',
    wins: '14',
    votes: '12,450',
    avatar: `${HOME}/winner-klaus.jpg`,
    highlighted: false,
  },
  {
    id: 'elena',
    rank: 2,
    nameKey: 'competitionDetails.rankings.elena',
    wins: '11',
    votes: '11,820',
    avatar: `${HOME}/winner-emma.jpg`,
    highlighted: false,
  },
  {
    id: 'sarah',
    rank: 3,
    nameKey: 'competitionDetails.rankings.sarah',
    wins: '09',
    votes: '8,940',
    avatar: `${HOME}/winner-dawn.jpg`,
    highlighted: true,
  },
  {
    id: 'julian',
    rank: 4,
    nameKey: 'competitionDetails.rankings.julian',
    wins: '07',
    votes: '10,910',
    avatar: `${HOME}/winner-david.jpg`,
    highlighted: false,
  },
  {
    id: 'marcus',
    rank: 5,
    nameKey: 'competitionDetails.rankings.marcus',
    wins: '05',
    votes: '9,420',
    avatar: `${HOME}/winner-marie.jpg`,
    highlighted: false,
  },
];

export const ADMIN_COMPETITION_RANKINGS_META = {
  showingCount: 5,
  showingTotal: '24,802',
};

/** Showcase card cover used as the hero for that entry. */
const CARD_COVER = {
  autumn: `${HOME}/photo-autumn.jpg`,
  wings: `${HOME}/photo-wings.jpg`,
  city: `${HOME}/photo-city.jpg`,
  forest: `${HOME}/photo-forest.jpg`,
  morning: `${HOME}/photo-morning.jpg`,
  harbor: `${HOME}/photo-harbor.jpg`,
  silent: `${HOME}/photo-silent.jpg`,
  zodiac: `${HOME}/photo-zodiac.jpg`,
};

const RED_HERO = `${HOME}/six-hero-aries.jpg`;
const BLUE_HERO = `${HOME}/blue-hero-libra.jpg`;
const SINGLE_HERO = `${HOME}/detail-hero.jpg`;

const buildRedSlides = (coverHero) => [
  {
    id: 'aries',
    number: 1,
    nameKey: 'adminCompetitionDetail.signs.aries',
    icon: `${HOME}/icon-aries.svg`,
    thumb: `${HOME}/six-thumb-1.jpg`,
    hero: coverHero,
    theme: 'red',
  },
  {
    id: 'taurus',
    number: 2,
    nameKey: 'adminCompetitionDetail.signs.taurus',
    icon: `${HOME}/icon-taurus.svg`,
    thumb: `${HOME}/six-thumb-2.jpg`,
    hero: `${HOME}/six-thumb-2.jpg`,
    theme: 'red',
  },
  {
    id: 'gemini',
    number: 3,
    nameKey: 'adminCompetitionDetail.signs.gemini',
    icon: `${HOME}/icon-gemini.svg`,
    thumb: `${HOME}/six-thumb-3.jpg`,
    hero: `${HOME}/six-thumb-3.jpg`,
    theme: 'red',
  },
  {
    id: 'cancer',
    number: 4,
    nameKey: 'adminCompetitionDetail.signs.cancer',
    icon: `${HOME}/icon-cancer.svg`,
    thumb: `${HOME}/six-thumb-4.jpg`,
    hero: `${HOME}/six-thumb-4.jpg`,
    theme: 'red',
  },
  {
    id: 'leo',
    number: 5,
    nameKey: 'adminCompetitionDetail.signs.leo',
    icon: `${HOME}/icon-leo.svg`,
    thumb: `${HOME}/six-thumb-5.jpg`,
    hero: `${HOME}/six-thumb-5.jpg`,
    theme: 'red',
  },
  {
    id: 'virgo',
    number: 6,
    nameKey: 'adminCompetitionDetail.signs.virgo',
    icon: `${HOME}/icon-virgo.svg`,
    thumb: `${HOME}/photo-morning.jpg`,
    hero: `${HOME}/photo-morning.jpg`,
    theme: 'red',
  },
];

const buildBlueSlides = (coverHero) => [
  {
    id: 'libra',
    number: 7,
    nameKey: 'adminCompetitionDetail.signs.libra',
    icon: `${HOME}/icon-libra.svg`,
    thumb: `${HOME}/blue-thumb-1.jpg`,
    hero: coverHero,
    theme: 'blue',
    iconBoxed: true,
  },
  {
    id: 'scorpio',
    number: 8,
    nameKey: 'adminCompetitionDetail.signs.scorpio',
    icon: `${HOME}/icon-scorpio.svg`,
    thumb: `${HOME}/blue-thumb-2.jpg`,
    hero: `${HOME}/blue-thumb-2.jpg`,
    theme: 'blue',
    iconBoxed: true,
  },
  {
    id: 'sagittarius',
    number: 9,
    nameKey: 'adminCompetitionDetail.signs.sagittarius',
    icon: `${HOME}/icon-sagittarius.svg`,
    thumb: `${HOME}/blue-thumb-3.jpg`,
    hero: `${HOME}/blue-thumb-3.jpg`,
    theme: 'blue',
  },
  {
    id: 'capricorn',
    number: 10,
    nameKey: 'adminCompetitionDetail.signs.capricorn',
    icon: `${HOME}/icon-capricorn.svg`,
    thumb: `${HOME}/blue-thumb-4.jpg`,
    hero: `${HOME}/blue-thumb-4.jpg`,
    theme: 'blue',
  },
  {
    id: 'aquarius',
    number: 11,
    nameKey: 'adminCompetitionDetail.signs.aquarius',
    icon: `${HOME}/icon-aquarius.svg`,
    thumb: `${HOME}/blue-thumb-5.jpg`,
    hero: `${HOME}/blue-thumb-5.jpg`,
    theme: 'blue',
    iconBoxed: true,
  },
  {
    id: 'pisces',
    number: 12,
    nameKey: 'adminCompetitionDetail.signs.pisces',
    icon: `${HOME}/icon-pisces.svg`,
    thumb: `${HOME}/photo-tidal.jpg`,
    hero: `${HOME}/photo-tidal.jpg`,
    theme: 'blue',
  },
];

const SHARED_COPY = {
  descriptionKey: 'adminCompetitionDetail.description',
  votes: '2150',
  views: '12400',
  photographerKey: 'adminCompetitionDetail.photographerName',
  photographerAvatar: ADMIN_DETAIL_ASSETS.photographer,
  categoryKey: 'adminCompetitionDetail.categories.nature',
};

const singleEntry = (id, titleKey) => ({
  id,
  variant: 'single',
  typeKey: 'adminCompetitionDetail.typeBadges.single',
  titleKey,
  hero: id === 'wings' ? SINGLE_HERO : CARD_COVER[id],
  videoPoster: id === 'wings' ? SINGLE_HERO : CARD_COVER[id],
  videoSrc: ADMIN_COMPETITION_VIDEO,
  sign: {
    id: 'aries',
    number: 1,
    nameKey: 'adminCompetitionDetail.signs.aries',
    icon: `${HOME}/icon-aries.svg`,
    theme: 'red',
  },
  slides: [],
  curve: null,
  rankings: ADMIN_COMPETITION_RANKINGS,
  ...ADMIN_COMPETITION_RANKINGS_META,
  comments: ADMIN_COMPETITION_COMMENTS,
  ...SHARED_COPY,
});

/** Map showcase card id → admin photo detail variant (each card keeps its own cover photo). */
export const ADMIN_COMPETITION_DETAILS = {
  wings: singleEntry('wings', 'adminCompetitionDetail.entries.wings.title'),
  forest: singleEntry('forest', 'adminCompetitionDetail.entries.forest.title'),
  morning: singleEntry('morning', 'adminCompetitionDetail.entries.morning.title'),
  harbor: singleEntry('harbor', 'adminCompetitionDetail.entries.harbor.title'),
  silent: singleEntry('silent', 'adminCompetitionDetail.entries.silent.title'),
  autumn: {
    id: 'autumn',
    variant: 'six-red',
    typeKey: 'adminCompetitionDetail.typeBadges.six',
    titleKey: 'adminCompetitionDetail.entries.autumn.title',
    hero: null,
    videoPoster: CARD_COVER.autumn,
    videoSrc: ADMIN_COMPETITION_VIDEO,
    sign: null,
    slides: buildRedSlides(RED_HERO),
    curve: ADMIN_DETAIL_ASSETS.curves.red,
    rankings: ADMIN_COMPETITION_RANKINGS,
    ...ADMIN_COMPETITION_RANKINGS_META,
    comments: ADMIN_COMPETITION_COMMENTS,
    ...SHARED_COPY,
    votes: '2150',
    views: '12400',
    photographerKey: 'adminCompetitionDetail.photographerKasia',
  },
  city: {
    id: 'city',
    variant: 'six-blue',
    typeKey: 'adminCompetitionDetail.typeBadges.six',
    titleKey: 'adminCompetitionDetail.entries.city.title',
    hero: null,
    videoPoster: CARD_COVER.city,
    videoSrc: ADMIN_COMPETITION_VIDEO,
    sign: null,
    slides: buildBlueSlides(BLUE_HERO),
    curve: ADMIN_DETAIL_ASSETS.curves.blue,
    rankings: ADMIN_COMPETITION_RANKINGS,
    ...ADMIN_COMPETITION_RANKINGS_META,
    comments: ADMIN_COMPETITION_COMMENTS,
    ...SHARED_COPY,
  },
  zodiac: {
    id: 'zodiac',
    variant: 'twelve',
    typeKey: 'adminCompetitionDetail.typeBadges.zodiac',
    titleKey: 'adminCompetitionDetail.entries.zodiac.title',
    hero: null,
    videoPoster: CARD_COVER.zodiac,
    videoSrc: ADMIN_COMPETITION_VIDEO,
    sign: null,
    slides: [
      ...buildRedSlides(RED_HERO),
      ...buildBlueSlides(BLUE_HERO),
    ],
    curve: ADMIN_DETAIL_ASSETS.curves.twelve,
    rankings: ADMIN_COMPETITION_RANKINGS,
    ...ADMIN_COMPETITION_RANKINGS_META,
    comments: ADMIN_COMPETITION_COMMENTS,
    ...SHARED_COPY,
  },
};

export const getAdminCompetitionDetailById = (id) =>
  ADMIN_COMPETITION_DETAILS[id] || ADMIN_COMPETITION_DETAILS.wings;
