/** 6 Photo Story upload assets — Figma node 190:237. */
const A = '/assets/six-photo';

export const SIX_PHOTO_ASSETS = {
  fire: `${A}/fire.svg`,
  moon: `${A}/moon.svg`,
  selectedDot: `${A}/selected-dot.svg`,
  wave: `${A}/wave.svg`,
  upload: `${A}/upload.svg`,
  sparkles: `${A}/sparkles.svg`,
  signs: {
    aries: `${A}/aries.svg`,
    taurus: `${A}/taurus.svg`,
    gemini: `${A}/gemini.svg`,
    cancer: `${A}/cancer.svg`,
    leo: `${A}/leo.svg`,
    virgo: `${A}/virgo.svg`,
  },
};

export const ARTISTIC_CATEGORIES = [
  'astrophotography',
  'portrait',
  'landscape',
  'street',
  'abstract',
];

export const THEME_IDS = {
  SPRING: 'spring',
  AUTUMN: 'autumn',
};

export const DEFAULT_THEME_ID = THEME_IDS.SPRING;
export const DEFAULT_CATEGORY = 'astrophotography';

const SPRING_THEME = {
  id: THEME_IDS.SPRING,
  titleKey: 'sixPhoto.themes.spring.title',
  descriptionKey: 'sixPhoto.themes.spring.description',
  icon: SIX_PHOTO_ASSETS.fire,
  selected: {
    card: 'border-[#ee1c25] bg-[#fde8e9]',
    title: 'text-[#ee1c25]',
    body: 'text-[#964044]',
  },
  idle: {
    card: 'border-[rgba(0,0,0,0.2)] bg-white',
    title: 'text-[#494453]',
    body: 'text-[#707070]',
  },
  slot: {
    cardBorder: 'border-[#fab9bb]',
    number: 'text-[#e53935]',
    name: 'text-[#640c10]',
    range: 'text-[#f4676d]',
    buttonBorder: 'border-[#f7979b]',
    buttonText: 'text-[#f14951]',
  },
};

const AUTUMN_THEME = {
  id: THEME_IDS.AUTUMN,
  titleKey: 'sixPhoto.themes.autumn.title',
  descriptionKey: 'sixPhoto.themes.autumn.description',
  icon: SIX_PHOTO_ASSETS.moon,
  selected: {
    card: 'border-[#4048cd] bg-[#ecedfa]',
    title: 'text-[#4048cd]',
    body: 'text-[#3a42bb]',
  },
  idle: {
    card: 'border-[rgba(0,0,0,0.2)] bg-white',
    title: 'text-[#494453]',
    body: 'text-[#707070]',
  },
  slot: {
    cardBorder: 'border-[#c4c6f0]',
    number: 'text-[#4048cd]',
    name: 'text-[#1b1e56]',
    range: 'text-[#666dd7]',
    buttonBorder: 'border-[#4048cd]',
    buttonText: 'text-[#4048cd]',
  },
};

export const THEMES = [SPRING_THEME, AUTUMN_THEME];

export const SPRING_SLOTS = [
  {
    id: 'aries',
    number: 1,
    elementKey: 'sixPhoto.elements.fire',
    nameKey: 'sixPhoto.signs.aries.name',
    rangeKey: 'sixPhoto.signs.aries.range',
    icon: SIX_PHOTO_ASSETS.signs.aries,
    symbol: '♈',
  },
  {
    id: 'taurus',
    number: 2,
    elementKey: 'sixPhoto.elements.earth',
    nameKey: 'sixPhoto.signs.taurus.name',
    rangeKey: 'sixPhoto.signs.taurus.range',
    icon: SIX_PHOTO_ASSETS.signs.taurus,
    symbol: '♉',
  },
  {
    id: 'gemini',
    number: 3,
    elementKey: 'sixPhoto.elements.air',
    nameKey: 'sixPhoto.signs.gemini.name',
    rangeKey: 'sixPhoto.signs.gemini.range',
    icon: SIX_PHOTO_ASSETS.signs.gemini,
    symbol: '♊',
  },
  {
    id: 'cancer',
    number: 4,
    elementKey: 'sixPhoto.elements.water',
    nameKey: 'sixPhoto.signs.cancer.name',
    rangeKey: 'sixPhoto.signs.cancer.range',
    icon: SIX_PHOTO_ASSETS.signs.cancer,
    symbol: '♋',
  },
  {
    id: 'leo',
    number: 5,
    elementKey: 'sixPhoto.elements.fire',
    nameKey: 'sixPhoto.signs.leo.name',
    rangeKey: 'sixPhoto.signs.leo.range',
    icon: SIX_PHOTO_ASSETS.signs.leo,
    symbol: '♌',
  },
  {
    id: 'virgo',
    number: 6,
    elementKey: 'sixPhoto.elements.earth',
    nameKey: 'sixPhoto.signs.virgo.name',
    rangeKey: 'sixPhoto.signs.virgo.range',
    icon: SIX_PHOTO_ASSETS.signs.virgo,
    symbol: '♍',
  },
];

export const AUTUMN_SLOTS = [
  {
    id: 'libra',
    number: 7,
    elementKey: 'sixPhoto.elements.air',
    nameKey: 'sixPhoto.signs.libra.name',
    rangeKey: 'sixPhoto.signs.libra.range',
    symbol: '♎',
  },
  {
    id: 'scorpio',
    number: 8,
    elementKey: 'sixPhoto.elements.water',
    nameKey: 'sixPhoto.signs.scorpio.name',
    rangeKey: 'sixPhoto.signs.scorpio.range',
    symbol: '♏',
  },
  {
    id: 'sagittarius',
    number: 9,
    elementKey: 'sixPhoto.elements.fire',
    nameKey: 'sixPhoto.signs.sagittarius.name',
    rangeKey: 'sixPhoto.signs.sagittarius.range',
    symbol: '♐',
  },
  {
    id: 'capricorn',
    number: 10,
    elementKey: 'sixPhoto.elements.earth',
    nameKey: 'sixPhoto.signs.capricorn.name',
    rangeKey: 'sixPhoto.signs.capricorn.range',
    symbol: '♑',
  },
  {
    id: 'aquarius',
    number: 11,
    elementKey: 'sixPhoto.elements.air',
    nameKey: 'sixPhoto.signs.aquarius.name',
    rangeKey: 'sixPhoto.signs.aquarius.range',
    symbol: '♒',
  },
  {
    id: 'pisces',
    number: 12,
    elementKey: 'sixPhoto.elements.water',
    nameKey: 'sixPhoto.signs.pisces.name',
    rangeKey: 'sixPhoto.signs.pisces.range',
    symbol: '♓',
  },
];

export const getThemeById = (themeId) =>
  THEMES.find((theme) => theme.id === themeId) ?? SPRING_THEME;

export const getSlotsForTheme = (themeId) =>
  themeId === THEME_IDS.AUTUMN ? AUTUMN_SLOTS : SPRING_SLOTS;
