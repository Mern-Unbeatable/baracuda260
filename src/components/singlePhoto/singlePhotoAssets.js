/** Single Photo upload assets — Figma node 190:142. */
const A = '/assets/single-photo';

export const SINGLE_PHOTO_ASSETS = {
  wave: `${A}/wave.svg`,
  icons: {
    virgo: `${A}/virgo.svg`,
    slot: `${A}/aries.svg`,
  },
  modal: {
    close: `${A}/modal-close.svg`,
    check: `${A}/modal-check.svg`,
  },
};

export const ARTISTIC_CATEGORIES = [
  'astrophotography',
  'portrait',
  'landscape',
  'street',
  'abstract',
];

/** Zodiac signs for single-photo slot selection (Figma defaults to Virgo #6). */
export const ZODIAC_SIGNS = [
  {
    id: 'aries',
    number: 1,
    elementKey: 'singlePhoto.elements.fire',
    nameKey: 'singlePhoto.signs.aries.name',
    rangeKey: 'singlePhoto.signs.aries.range',
    symbol: '♈',
  },
  {
    id: 'taurus',
    number: 2,
    elementKey: 'singlePhoto.elements.earth',
    nameKey: 'singlePhoto.signs.taurus.name',
    rangeKey: 'singlePhoto.signs.taurus.range',
    symbol: '♉',
  },
  {
    id: 'gemini',
    number: 3,
    elementKey: 'singlePhoto.elements.air',
    nameKey: 'singlePhoto.signs.gemini.name',
    rangeKey: 'singlePhoto.signs.gemini.range',
    symbol: '♊',
  },
  {
    id: 'cancer',
    number: 4,
    elementKey: 'singlePhoto.elements.water',
    nameKey: 'singlePhoto.signs.cancer.name',
    rangeKey: 'singlePhoto.signs.cancer.range',
    symbol: '♋',
  },
  {
    id: 'leo',
    number: 5,
    elementKey: 'singlePhoto.elements.fire',
    nameKey: 'singlePhoto.signs.leo.name',
    rangeKey: 'singlePhoto.signs.leo.range',
    symbol: '♌',
  },
  {
    id: 'virgo',
    number: 6,
    elementKey: 'singlePhoto.elements.earth',
    nameKey: 'singlePhoto.signs.virgo.name',
    rangeKey: 'singlePhoto.signs.virgo.range',
    symbol: '♍',
    icon: SINGLE_PHOTO_ASSETS.icons.virgo,
    slotIcon: SINGLE_PHOTO_ASSETS.icons.slot,
  },
  {
    id: 'libra',
    number: 7,
    elementKey: 'singlePhoto.elements.air',
    nameKey: 'singlePhoto.signs.libra.name',
    rangeKey: 'singlePhoto.signs.libra.range',
    symbol: '♎',
  },
  {
    id: 'scorpio',
    number: 8,
    elementKey: 'singlePhoto.elements.water',
    nameKey: 'singlePhoto.signs.scorpio.name',
    rangeKey: 'singlePhoto.signs.scorpio.range',
    symbol: '♏',
  },
  {
    id: 'sagittarius',
    number: 9,
    elementKey: 'singlePhoto.elements.fire',
    nameKey: 'singlePhoto.signs.sagittarius.name',
    rangeKey: 'singlePhoto.signs.sagittarius.range',
    symbol: '♐',
  },
  {
    id: 'capricorn',
    number: 10,
    elementKey: 'singlePhoto.elements.earth',
    nameKey: 'singlePhoto.signs.capricorn.name',
    rangeKey: 'singlePhoto.signs.capricorn.range',
    symbol: '♑',
  },
  {
    id: 'aquarius',
    number: 11,
    elementKey: 'singlePhoto.elements.air',
    nameKey: 'singlePhoto.signs.aquarius.name',
    rangeKey: 'singlePhoto.signs.aquarius.range',
    symbol: '♒',
  },
  {
    id: 'pisces',
    number: 12,
    elementKey: 'singlePhoto.elements.water',
    nameKey: 'singlePhoto.signs.pisces.name',
    rangeKey: 'singlePhoto.signs.pisces.range',
    symbol: '♓',
  },
];

export const DEFAULT_SIGN_ID = 'virgo';
export const DEFAULT_CATEGORY = 'astrophotography';
