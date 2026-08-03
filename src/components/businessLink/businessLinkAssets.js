/** Business Link Photos — Figma node 195:271. */
const A = '/assets/business-link';

export const BUSINESS_LINK_ASSETS = {
  bag: `${A}/bag.svg`,
  dualWave: `${A}/dual-wave.svg`,
  uploadRed: `${A}/upload-red.svg`,
  uploadBlue: `${A}/upload-blue.svg`,
  submit: `${A}/submit.svg`,
  signs: {
    aries: `${A}/aries.svg`,
    taurus: `${A}/taurus.svg`,
    gemini: `${A}/gemini.svg`,
    cancer: `${A}/cancer.svg`,
    leo: `${A}/leo.svg`,
    virgo: `${A}/virgo.svg`,
    /** Blue signs use bg + white glyph (same pattern as Zodiac12 / Six Photo). */
    blueBg: `${A}/icon-bg-blue.svg`,
    libra: `${A}/libra.svg`,
    scorpio: `${A}/scorpio.svg`,
    sagittarius: `${A}/sagittarius.svg`,
    capricorn: `${A}/capricorn.svg`,
    aquarius: `${A}/aquarius.svg`,
    pisces: `${A}/pisces.svg`,
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
  upload: BUSINESS_LINK_ASSETS.uploadRed,
};

export const BLUE_THEME = {
  cardBorder: 'border-[#c4c6f0]',
  number: 'text-[#3a42bb]',
  name: 'text-[#1b1e56]',
  range: 'text-[#666dd7]',
  buttonBorder: 'border-[#c4c6f0]',
  buttonText: 'text-[#666dd7]',
  upload: BUSINESS_LINK_ASSETS.uploadBlue,
};

export const RED_SLOTS = [
  {
    id: 'aries',
    number: 1,
    elementKey: 'businessLink.elements.fire',
    nameKey: 'businessLink.signs.aries.name',
    rangeKey: 'businessLink.signs.aries.range',
    icon: BUSINESS_LINK_ASSETS.signs.aries,
    theme: RED_THEME,
  },
  {
    id: 'taurus',
    number: 2,
    elementKey: 'businessLink.elements.earth',
    nameKey: 'businessLink.signs.taurus.name',
    rangeKey: 'businessLink.signs.taurus.range',
    icon: BUSINESS_LINK_ASSETS.signs.taurus,
    theme: RED_THEME,
  },
  {
    id: 'gemini',
    number: 3,
    elementKey: 'businessLink.elements.air',
    nameKey: 'businessLink.signs.gemini.name',
    rangeKey: 'businessLink.signs.gemini.range',
    icon: BUSINESS_LINK_ASSETS.signs.gemini,
    theme: RED_THEME,
  },
  {
    id: 'cancer',
    number: 4,
    elementKey: 'businessLink.elements.water',
    nameKey: 'businessLink.signs.cancer.name',
    rangeKey: 'businessLink.signs.cancer.range',
    icon: BUSINESS_LINK_ASSETS.signs.cancer,
    theme: RED_THEME,
  },
  {
    id: 'leo',
    number: 5,
    elementKey: 'businessLink.elements.fire',
    nameKey: 'businessLink.signs.leo.name',
    rangeKey: 'businessLink.signs.leo.range',
    icon: BUSINESS_LINK_ASSETS.signs.leo,
    theme: RED_THEME,
  },
  {
    id: 'virgo',
    number: 6,
    elementKey: 'businessLink.elements.earth',
    nameKey: 'businessLink.signs.virgo.name',
    rangeKey: 'businessLink.signs.virgo.range',
    icon: BUSINESS_LINK_ASSETS.signs.virgo,
    theme: RED_THEME,
  },
];

export const BLUE_SLOTS = [
  {
    id: 'libra',
    number: 7,
    elementKey: 'businessLink.elements.air',
    nameKey: 'businessLink.signs.libra.name',
    rangeKey: 'businessLink.signs.libra.range',
    iconBg: BUSINESS_LINK_ASSETS.signs.blueBg,
    iconOverlay: BUSINESS_LINK_ASSETS.signs.libra,
    theme: BLUE_THEME,
  },
  {
    id: 'scorpio',
    number: 8,
    elementKey: 'businessLink.elements.water',
    nameKey: 'businessLink.signs.scorpio.name',
    rangeKey: 'businessLink.signs.scorpio.range',
    iconBg: BUSINESS_LINK_ASSETS.signs.blueBg,
    iconOverlay: BUSINESS_LINK_ASSETS.signs.scorpio,
    theme: BLUE_THEME,
  },
  {
    id: 'sagittarius',
    number: 9,
    elementKey: 'businessLink.elements.fire',
    nameKey: 'businessLink.signs.sagittarius.name',
    rangeKey: 'businessLink.signs.sagittarius.range',
    icon: BUSINESS_LINK_ASSETS.signs.sagittarius,
    theme: BLUE_THEME,
  },
  {
    id: 'capricorn',
    number: 10,
    elementKey: 'businessLink.elements.earth',
    nameKey: 'businessLink.signs.capricorn.name',
    rangeKey: 'businessLink.signs.capricorn.range',
    icon: BUSINESS_LINK_ASSETS.signs.capricorn,
    theme: BLUE_THEME,
  },
  {
    id: 'aquarius',
    number: 11,
    elementKey: 'businessLink.elements.air',
    nameKey: 'businessLink.signs.aquarius.name',
    rangeKey: 'businessLink.signs.aquarius.range',
    iconBg: BUSINESS_LINK_ASSETS.signs.blueBg,
    iconOverlay: BUSINESS_LINK_ASSETS.signs.aquarius,
    theme: BLUE_THEME,
  },
  {
    id: 'pisces',
    number: 12,
    elementKey: 'businessLink.elements.water',
    nameKey: 'businessLink.signs.pisces.name',
    rangeKey: 'businessLink.signs.pisces.range',
    icon: BUSINESS_LINK_ASSETS.signs.pisces,
    theme: BLUE_THEME,
  },
];

export const ALL_SLOTS = [...RED_SLOTS, ...BLUE_SLOTS];
