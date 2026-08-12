/** 6 Photo Story upload assets — Figma 190:237 (red) / 190:612 (blue). */
const A = '/assets/six-photo';

export const SIX_PHOTO_ASSETS = {
  fire: `${A}/fire.svg`,
  moon: `${A}/moon-blue.svg`,
  selectedDotRed: `${A}/selected-dot.svg`,
  selectedDotBlue: `${A}/selected-dot-blue.svg`,
  waveRed: `${A}/wave.svg`,
  waveBlue: `${A}/wave-blue.svg`,
  uploadRed: `${A}/upload.svg`,
  uploadBlue: `${A}/upload-blue.svg`,
  signs: {
    aries: `${A}/aries.svg`,
    taurus: `${A}/taurus.svg`,
    gemini: `${A}/gemini.svg`,
    cancer: `${A}/cancer.svg`,
    leo: `${A}/leo.svg`,
    virgo: `${A}/virgo.svg`,
    blueBg: `${A}/icon-bg-blue.svg`,
    libra: `${A}/libra.svg`,
    scorpio: `${A}/scorpio.svg`,
    sagittarius: `${A}/sagittarius.svg`,
    capricorn: `${A}/capricorn.svg`,
    aquarius: `${A}/aquarius.svg`,
    pisces: `${A}/pisces.svg`,
  },
  sparkles: `${A}/sparkles.svg`,
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
  selectedDot: SIX_PHOTO_ASSETS.selectedDotRed,
  wave: SIX_PHOTO_ASSETS.waveRed,
  waveClassName: 'h-[52px]',
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
    upload: SIX_PHOTO_ASSETS.uploadRed,
  },
};

/** Autumn / Winter — Blue Photo Story (Figma node 190:612). */
const AUTUMN_THEME = {
  id: THEME_IDS.AUTUMN,
  titleKey: 'sixPhoto.themes.autumn.title',
  descriptionKey: 'sixPhoto.themes.autumn.description',
  icon: SIX_PHOTO_ASSETS.moon,
  selectedDot: SIX_PHOTO_ASSETS.selectedDotBlue,
  wave: SIX_PHOTO_ASSETS.waveBlue,
  waveClassName: 'h-[46px]',
  selected: {
    card: 'border-[#4048cd] bg-[#ecedfa]',
    title: 'text-[#4048cd]',
    body: 'text-[#40437e]',
  },
  idle: {
    card: 'border-[rgba(0,0,0,0.21)] bg-white',
    title: 'text-[#494453]',
    body: 'text-[#707070]',
  },
  slot: {
    cardBorder: 'border-[#c4c6f0]',
    number: 'text-[#3a42bb]',
    name: 'text-[#1b1e56]',
    range: 'text-[#666dd7]',
    buttonBorder: 'border-[#c4c6f0]',
    buttonText: 'text-[#666dd7]',
    upload: SIX_PHOTO_ASSETS.uploadBlue,
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
  },
  {
    id: 'taurus',
    number: 2,
    elementKey: 'sixPhoto.elements.earth',
    nameKey: 'sixPhoto.signs.taurus.name',
    rangeKey: 'sixPhoto.signs.taurus.range',
    icon: SIX_PHOTO_ASSETS.signs.taurus,
  },
  {
    id: 'gemini',
    number: 3,
    elementKey: 'sixPhoto.elements.air',
    nameKey: 'sixPhoto.signs.gemini.name',
    rangeKey: 'sixPhoto.signs.gemini.range',
    icon: SIX_PHOTO_ASSETS.signs.gemini,
  },
  {
    id: 'cancer',
    number: 4,
    elementKey: 'sixPhoto.elements.water',
    nameKey: 'sixPhoto.signs.cancer.name',
    rangeKey: 'sixPhoto.signs.cancer.range',
    icon: SIX_PHOTO_ASSETS.signs.cancer,
  },
  {
    id: 'leo',
    number: 5,
    elementKey: 'sixPhoto.elements.fire',
    nameKey: 'sixPhoto.signs.leo.name',
    rangeKey: 'sixPhoto.signs.leo.range',
    icon: SIX_PHOTO_ASSETS.signs.leo,
  },
  {
    id: 'virgo',
    number: 6,
    elementKey: 'sixPhoto.elements.earth',
    nameKey: 'sixPhoto.signs.virgo.name',
    rangeKey: 'sixPhoto.signs.virgo.range',
    icon: SIX_PHOTO_ASSETS.signs.virgo,
  },
];

export const AUTUMN_SLOTS = [
  {
    id: 'libra',
    number: 7,
    elementKey: 'sixPhoto.elements.air',
    nameKey: 'sixPhoto.signs.libra.name',
    rangeKey: 'sixPhoto.signs.libra.range',
    iconBg: SIX_PHOTO_ASSETS.signs.blueBg,
    iconOverlay: SIX_PHOTO_ASSETS.signs.libra,
  },
  {
    id: 'scorpio',
    number: 8,
    elementKey: 'sixPhoto.elements.water',
    nameKey: 'sixPhoto.signs.scorpio.name',
    rangeKey: 'sixPhoto.signs.scorpio.range',
    iconBg: SIX_PHOTO_ASSETS.signs.blueBg,
    iconOverlay: SIX_PHOTO_ASSETS.signs.scorpio,
  },
  {
    id: 'sagittarius',
    number: 9,
    elementKey: 'sixPhoto.elements.fire',
    nameKey: 'sixPhoto.signs.sagittarius.name',
    rangeKey: 'sixPhoto.signs.sagittarius.range',
    icon: SIX_PHOTO_ASSETS.signs.sagittarius,
  },
  {
    id: 'capricorn',
    number: 10,
    elementKey: 'sixPhoto.elements.earth',
    nameKey: 'sixPhoto.signs.capricorn.name',
    rangeKey: 'sixPhoto.signs.capricorn.range',
    icon: SIX_PHOTO_ASSETS.signs.capricorn,
  },
  {
    id: 'aquarius',
    number: 11,
    elementKey: 'sixPhoto.elements.air',
    nameKey: 'sixPhoto.signs.aquarius.name',
    rangeKey: 'sixPhoto.signs.aquarius.range',
    iconBg: SIX_PHOTO_ASSETS.signs.blueBg,
    iconOverlay: SIX_PHOTO_ASSETS.signs.aquarius,
  },
  {
    id: 'pisces',
    number: 12,
    elementKey: 'sixPhoto.elements.water',
    nameKey: 'sixPhoto.signs.pisces.name',
    rangeKey: 'sixPhoto.signs.pisces.range',
    icon: SIX_PHOTO_ASSETS.signs.pisces,
  },
];

export const getThemeById = (themeId) =>
  THEMES.find((theme) => theme.id === themeId) ?? SPRING_THEME;

export const getSlotsForTheme = (themeId) =>
  themeId === THEME_IDS.AUTUMN ? AUTUMN_SLOTS : SPRING_SLOTS;
