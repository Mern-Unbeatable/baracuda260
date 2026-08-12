/** 12 Photo Zodiac Album — Figma node 190:1054. */
const Z = '/assets/zodiac12';
const S = '/assets/six-photo';

export const ZODIAC12_ASSETS = {
  dualWave: `${Z}/dual-wave.svg`,
  sun: `${Z}/sun.svg`,
  moon: `${Z}/moon.svg`,
  sparkles: `${Z}/sparkles.svg`,
  uploadRed: `${S}/upload.svg`,
  uploadBlue: `${S}/upload-blue.svg`,
  signs: {
    aries: `${S}/aries.svg`,
    taurus: `${S}/taurus.svg`,
    gemini: `${S}/gemini.svg`,
    cancer: `${S}/cancer.svg`,
    leo: `${S}/leo.svg`,
    virgo: `${S}/virgo.svg`,
    blueBg: `${S}/icon-bg-blue.svg`,
    libra: `${S}/libra.svg`,
    scorpio: `${S}/scorpio.svg`,
    sagittarius: `${S}/sagittarius.svg`,
    capricorn: `${S}/capricorn.svg`,
    aquarius: `${S}/aquarius.svg`,
    pisces: `${S}/pisces.svg`,
  },
};

export const ARTISTIC_CATEGORIES = [
  'astrophotography',
  'portrait',
  'landscape',
  'street',
  'abstract',
];

export const DEFAULT_CATEGORY = 'astrophotography';

export const RED_THEME = {
  cardBorder: 'border-[#fab9bb]',
  number: 'text-[#e53935]',
  name: 'text-[#640c10]',
  range: 'text-[#f4676d]',
  buttonBorder: 'border-[#f7979b]',
  buttonText: 'text-[#f14951]',
  upload: ZODIAC12_ASSETS.uploadRed,
};

export const BLUE_THEME = {
  cardBorder: 'border-[#c4c6f0]',
  number: 'text-[#3a42bb]',
  name: 'text-[#1b1e56]',
  range: 'text-[#666dd7]',
  buttonBorder: 'border-[#c4c6f0]',
  buttonText: 'text-[#666dd7]',
  upload: ZODIAC12_ASSETS.uploadBlue,
};

/** Signs 1–6 (Spring/Summer — Red). */
export const RED_SLOTS = [
  {
    id: 'aries',
    number: 1,
    elementKey: 'zodiac12.elements.fire',
    nameKey: 'zodiac12.signs.aries.name',
    rangeKey: 'zodiac12.signs.aries.range',
    icon: ZODIAC12_ASSETS.signs.aries,
    theme: RED_THEME,
  },
  {
    id: 'taurus',
    number: 2,
    elementKey: 'zodiac12.elements.earth',
    nameKey: 'zodiac12.signs.taurus.name',
    rangeKey: 'zodiac12.signs.taurus.range',
    icon: ZODIAC12_ASSETS.signs.taurus,
    theme: RED_THEME,
  },
  {
    id: 'gemini',
    number: 3,
    elementKey: 'zodiac12.elements.air',
    nameKey: 'zodiac12.signs.gemini.name',
    rangeKey: 'zodiac12.signs.gemini.range',
    icon: ZODIAC12_ASSETS.signs.gemini,
    theme: RED_THEME,
  },
  {
    id: 'cancer',
    number: 4,
    elementKey: 'zodiac12.elements.water',
    nameKey: 'zodiac12.signs.cancer.name',
    rangeKey: 'zodiac12.signs.cancer.range',
    icon: ZODIAC12_ASSETS.signs.cancer,
    theme: RED_THEME,
  },
  {
    id: 'leo',
    number: 5,
    elementKey: 'zodiac12.elements.fire',
    nameKey: 'zodiac12.signs.leo.name',
    rangeKey: 'zodiac12.signs.leo.range',
    icon: ZODIAC12_ASSETS.signs.leo,
    theme: RED_THEME,
  },
  {
    id: 'virgo',
    number: 6,
    elementKey: 'zodiac12.elements.earth',
    nameKey: 'zodiac12.signs.virgo.name',
    rangeKey: 'zodiac12.signs.virgo.range',
    icon: ZODIAC12_ASSETS.signs.virgo,
    theme: RED_THEME,
  },
];

/** Signs 7–12 (Autumn/Winter — Blue). */
export const BLUE_SLOTS = [
  {
    id: 'libra',
    number: 7,
    elementKey: 'zodiac12.elements.air',
    nameKey: 'zodiac12.signs.libra.name',
    rangeKey: 'zodiac12.signs.libra.range',
    iconBg: ZODIAC12_ASSETS.signs.blueBg,
    iconOverlay: ZODIAC12_ASSETS.signs.libra,
    theme: BLUE_THEME,
  },
  {
    id: 'scorpio',
    number: 8,
    elementKey: 'zodiac12.elements.water',
    nameKey: 'zodiac12.signs.scorpio.name',
    rangeKey: 'zodiac12.signs.scorpio.range',
    iconBg: ZODIAC12_ASSETS.signs.blueBg,
    iconOverlay: ZODIAC12_ASSETS.signs.scorpio,
    theme: BLUE_THEME,
  },
  {
    id: 'sagittarius',
    number: 9,
    elementKey: 'zodiac12.elements.fire',
    nameKey: 'zodiac12.signs.sagittarius.name',
    rangeKey: 'zodiac12.signs.sagittarius.range',
    icon: ZODIAC12_ASSETS.signs.sagittarius,
    theme: BLUE_THEME,
  },
  {
    id: 'capricorn',
    number: 10,
    elementKey: 'zodiac12.elements.earth',
    nameKey: 'zodiac12.signs.capricorn.name',
    rangeKey: 'zodiac12.signs.capricorn.range',
    icon: ZODIAC12_ASSETS.signs.capricorn,
    theme: BLUE_THEME,
  },
  {
    id: 'aquarius',
    number: 11,
    elementKey: 'zodiac12.elements.air',
    nameKey: 'zodiac12.signs.aquarius.name',
    rangeKey: 'zodiac12.signs.aquarius.range',
    iconBg: ZODIAC12_ASSETS.signs.blueBg,
    iconOverlay: ZODIAC12_ASSETS.signs.aquarius,
    theme: BLUE_THEME,
  },
  {
    id: 'pisces',
    number: 12,
    elementKey: 'zodiac12.elements.water',
    nameKey: 'zodiac12.signs.pisces.name',
    rangeKey: 'zodiac12.signs.pisces.range',
    icon: ZODIAC12_ASSETS.signs.pisces,
    theme: BLUE_THEME,
  },
];

export const ALL_SLOTS = [...RED_SLOTS, ...BLUE_SLOTS];
