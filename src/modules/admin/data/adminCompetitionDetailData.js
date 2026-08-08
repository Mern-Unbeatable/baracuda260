/** Admin Competition Photo Details — Figma 339:1796 / 339:1936 / 339:2155 / 339:2375. */

const DETAIL = '/assets/admin-competition-detail';
const SHOWCASE = '/assets/admin-competitions';
const HOME = '/assets/home';
const CD = '/assets/competition-details';

export const ADMIN_DETAIL_ASSETS = {
  divider: `${DETAIL}/divider.svg`,
  photographer: `${DETAIL}/photographer.jpg`,
  curves: {
    red: `${DETAIL}/curve-red.svg`,
    blue: `${DETAIL}/curve-blue.svg`,
    twelve: `${DETAIL}/curve-12.svg`,
  },
};

/** Showcase card cover used as the hero for that entry. */
const CARD_COVER = {
  autumn: `${SHOWCASE}/autumn.jpg`,
  wings: `${SHOWCASE}/wings.jpg`,
  city: `${SHOWCASE}/city.jpg`,
  forest: `${SHOWCASE}/forest.jpg`,
  morning: `${SHOWCASE}/morning.jpg`,
  harbor: `${SHOWCASE}/harbor.jpg`,
  silent: `${SHOWCASE}/silent.jpg`,
  zodiac: `${SHOWCASE}/zodiac.jpg`,
};

const buildRedSlides = (coverHero) => [
  {
    id: 'aries',
    number: 1,
    nameKey: 'adminCompetitionDetail.signs.aries',
    icon: `${HOME}/icon-aries.svg`,
    thumb: `${DETAIL}/thumb-1.jpg`,
    hero: coverHero,
    theme: 'red',
  },
  {
    id: 'taurus',
    number: 2,
    nameKey: 'adminCompetitionDetail.signs.taurus',
    icon: `${HOME}/icon-taurus.svg`,
    thumb: `${DETAIL}/thumb-2.jpg`,
    hero: `${DETAIL}/thumb-2.jpg`,
    theme: 'red',
  },
  {
    id: 'gemini',
    number: 3,
    nameKey: 'adminCompetitionDetail.signs.gemini',
    icon: `${HOME}/icon-gemini.svg`,
    thumb: `${DETAIL}/thumb-3.jpg`,
    hero: `${DETAIL}/thumb-3.jpg`,
    theme: 'red',
  },
  {
    id: 'cancer',
    number: 4,
    nameKey: 'adminCompetitionDetail.signs.cancer',
    icon: `${HOME}/icon-cancer.svg`,
    thumb: `${DETAIL}/thumb-4.jpg`,
    hero: `${DETAIL}/thumb-4.jpg`,
    theme: 'red',
  },
  {
    id: 'leo',
    number: 5,
    nameKey: 'adminCompetitionDetail.signs.leo',
    icon: `${HOME}/icon-leo.svg`,
    thumb: `${DETAIL}/thumb-5.jpg`,
    hero: `${DETAIL}/thumb-5.jpg`,
    theme: 'red',
  },
  {
    id: 'virgo',
    number: 6,
    nameKey: 'adminCompetitionDetail.signs.virgo',
    icon: `${HOME}/icon-virgo.svg`,
    thumb: `${CD}/thumb-6.jpg`,
    hero: `${CD}/thumb-6.jpg`,
    theme: 'red',
  },
];

const buildBlueSlides = (coverHero) => [
  {
    id: 'libra',
    number: 7,
    nameKey: 'adminCompetitionDetail.signs.libra',
    icon: `${HOME}/icon-libra.svg`,
    thumb: `${DETAIL}/blue-thumb-1.jpg`,
    hero: coverHero,
    theme: 'blue',
    iconBoxed: true,
  },
  {
    id: 'scorpio',
    number: 8,
    nameKey: 'adminCompetitionDetail.signs.scorpio',
    icon: `${HOME}/icon-scorpio.svg`,
    thumb: `${DETAIL}/blue-thumb-2.jpg`,
    hero: `${DETAIL}/blue-thumb-2.jpg`,
    theme: 'blue',
    iconBoxed: true,
  },
  {
    id: 'sagittarius',
    number: 9,
    nameKey: 'adminCompetitionDetail.signs.sagittarius',
    icon: `${HOME}/icon-sagittarius.svg`,
    thumb: `${DETAIL}/blue-thumb-3.jpg`,
    hero: `${DETAIL}/blue-thumb-3.jpg`,
    theme: 'blue',
  },
  {
    id: 'capricorn',
    number: 10,
    nameKey: 'adminCompetitionDetail.signs.capricorn',
    icon: `${HOME}/icon-capricorn.svg`,
    thumb: `${DETAIL}/blue-thumb-4.jpg`,
    hero: `${DETAIL}/blue-thumb-4.jpg`,
    theme: 'blue',
  },
  {
    id: 'aquarius',
    number: 11,
    nameKey: 'adminCompetitionDetail.signs.aquarius',
    icon: `${HOME}/icon-aquarius.svg`,
    thumb: `${DETAIL}/blue-thumb-5.jpg`,
    hero: `${DETAIL}/blue-thumb-5.jpg`,
    theme: 'blue',
    iconBoxed: true,
  },
  {
    id: 'pisces',
    number: 12,
    nameKey: 'adminCompetitionDetail.signs.pisces',
    icon: `${HOME}/icon-pisces.svg`,
    thumb: `${DETAIL}/blue-thumb-6.jpg`,
    hero: `${DETAIL}/blue-thumb-6.jpg`,
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
  typeKey: 'adminCompetitions.types.single',
  titleKey,
  hero: CARD_COVER[id],
  sign: {
    id: 'aries',
    number: 1,
    nameKey: 'adminCompetitionDetail.signs.aries',
    icon: `${HOME}/icon-aries.svg`,
    theme: 'red',
  },
  slides: [],
  curve: null,
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
    typeKey: 'adminCompetitions.types.six',
    titleKey: 'adminCompetitionDetail.entries.autumn.title',
    hero: null,
    sign: null,
    slides: buildRedSlides(CARD_COVER.autumn),
    curve: ADMIN_DETAIL_ASSETS.curves.red,
    ...SHARED_COPY,
    votes: '1488',
    views: '9240',
    photographerKey: 'adminCompetitionDetail.photographerKasia',
  },
  city: {
    id: 'city',
    variant: 'six-blue',
    typeKey: 'adminCompetitions.types.six',
    titleKey: 'adminCompetitionDetail.entries.city.title',
    hero: null,
    sign: null,
    slides: buildBlueSlides(CARD_COVER.city),
    curve: ADMIN_DETAIL_ASSETS.curves.blue,
    ...SHARED_COPY,
  },
  zodiac: {
    id: 'zodiac',
    variant: 'twelve',
    typeKey: 'adminCompetitions.types.zodiac',
    titleKey: 'adminCompetitionDetail.entries.zodiac.title',
    hero: null,
    sign: null,
    slides: [
      ...buildRedSlides(CARD_COVER.zodiac),
      ...buildBlueSlides(`${DETAIL}/hero-six-blue.jpg`),
    ],
    curve: ADMIN_DETAIL_ASSETS.curves.twelve,
    ...SHARED_COPY,
  },
};

export const getAdminCompetitionDetailById = (id) =>
  ADMIN_COMPETITION_DETAILS[id] || ADMIN_COMPETITION_DETAILS.wings;
