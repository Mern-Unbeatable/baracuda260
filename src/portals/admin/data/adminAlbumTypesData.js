/** Admin Album types — Figma 339:3417 / Edit 339:3630 / New 339:3909. */

const A = '/assets/admin-album-types';

export const ADMIN_ALBUM_TYPES_ASSETS = {
  camera: `${A}/icon-camera.svg`,
  book: `${A}/icon-book.svg`,
  zodiac: `${A}/icon-zodiac.svg`,
  check: `${A}/icon-check.svg`,
  edit: `${A}/icon-edit.svg`,
  close: `${A}/icon-close.svg`,
};

export const ICON_BOX_SIZE = { width: 56, height: 57 };
export const TYPE_ICON_SIZE = 32;
export const CHECK_ICON_SIZE = 13;
export const EDIT_ICON_SIZE = 20;
export const CLOSE_ICON_SIZE = 18;

export const ALBUM_TYPE_ICON_KEYS = ['camera', 'book', 'zodiac'];

export const ADMIN_ALBUM_TYPE_ITEMS = [
  {
    id: 'single-photo',
    iconKey: 'camera',
    nameKey: 'adminAlbumTypes.items.single.name',
    descriptionKey: 'adminAlbumTypes.items.single.description',
    featureKeys: [
      'adminAlbumTypes.items.single.features.monthly',
      'adminAlbumTypes.items.single.features.voting',
      'adminAlbumTypes.items.single.features.prizes',
    ],
    prizeMoney: 1500,
  },
  {
    id: 'six-photos',
    iconKey: 'book',
    nameKey: 'adminAlbumTypes.items.six.name',
    descriptionKey: 'adminAlbumTypes.items.six.description',
    featureKeys: [
      'adminAlbumTypes.items.six.features.storytelling',
      'adminAlbumTypes.items.six.features.votes',
      'adminAlbumTypes.items.six.features.wins',
    ],
    prizeMoney: 2500,
  },
  {
    id: 'zodiac-twelve',
    iconKey: 'zodiac',
    nameKey: 'adminAlbumTypes.items.zodiac.name',
    descriptionKey: 'adminAlbumTypes.items.zodiac.description',
    featureKeys: [
      'adminAlbumTypes.items.zodiac.features.arc',
      'adminAlbumTypes.items.zodiac.features.order',
      'adminAlbumTypes.items.zodiac.features.grand',
    ],
    prizeMoney: 3500,
  },
];

export const MODAL_MODE = {
  CREATE: 'create',
  EDIT: 'edit',
};

/**
 * @param {number | string} amount
 */
export const formatPrizeMoney = (amount) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return '$0.00';
  return `$${value.toFixed(2)}`;
};

/**
 * @param {string} value
 */
export const isRequiredTextValid = (value) => Boolean(String(value || '').trim());

/**
 * @param {string} value
 */
export const parsePrizeMoney = (value) => {
  const normalized = String(value || '')
    .replace(/[^0-9.]/g, '')
    .trim();
  if (!normalized) return NaN;
  return Number(normalized);
};

/**
 * @param {string} value
 */
export const isPrizeMoneyValid = (value) => {
  const amount = parsePrizeMoney(value);
  return Number.isFinite(amount) && amount >= 0;
};

/**
 * @param {string} featuredText
 * @returns {string[]}
 */
export const parseFeaturedLines = (featuredText) =>
  String(featuredText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * @param {string[]} lines
 */
export const isFeaturedValid = (lines) => lines.length > 0;

/**
 * @param {{
 *   name: string,
 *   prizeMoney: string,
 *   description: string,
 *   featured: string,
 * }} values
 */
export const isAlbumTypeFormValid = (values) =>
  isRequiredTextValid(values.name) &&
  isPrizeMoneyValid(values.prizeMoney) &&
  isRequiredTextValid(values.description) &&
  isFeaturedValid(parseFeaturedLines(values.featured));

/**
 * @param {typeof ADMIN_ALBUM_TYPE_ITEMS} albumTypes
 * @param {string} albumTypeId
 * @param {{
 *   name: string,
 *   prizeMoney: number,
 *   description: string,
 *   features: string[],
 * }} updates
 */
export const updateAlbumTypeById = (albumTypes, albumTypeId, updates) =>
  albumTypes.map((albumType) => {
    if (albumType.id !== albumTypeId) return albumType;
    return {
      ...albumType,
      name: updates.name,
      nameKey: undefined,
      description: updates.description,
      descriptionKey: undefined,
      features: updates.features,
      featureKeys: undefined,
      prizeMoney: updates.prizeMoney,
    };
  });

/**
 * @param {typeof ADMIN_ALBUM_TYPE_ITEMS} albumTypes
 * @param {{
 *   id: string,
 *   iconKey: string,
 *   name: string,
 *   description: string,
 *   features: string[],
 *   prizeMoney: number,
 * }} albumType
 */
export const appendAlbumType = (albumTypes, albumType) => {
  if (!albumType?.id) return albumTypes;
  if (albumTypes.some((item) => item.id === albumType.id)) return albumTypes;
  return [...albumTypes, albumType];
};

/**
 * @param {string} name
 * @param {number} nextIndex
 * @param {{
 *   description: string,
 *   features: string[],
 *   prizeMoney: number,
 * }} fields
 */
export const createAlbumTypeFromForm = (name, nextIndex, fields) => {
  const iconKey = ALBUM_TYPE_ICON_KEYS[(nextIndex - 1) % ALBUM_TYPE_ICON_KEYS.length];
  return {
    id: `custom-${nextIndex}`,
    iconKey,
    name: String(name || '').trim(),
    description: String(fields.description || '').trim(),
    features: fields.features,
    prizeMoney: fields.prizeMoney,
  };
};

/**
 * Resolve display strings for a card (i18n keys or custom plain text).
 * @param {(key: string) => string} t
 * @param {{
 *   name?: string,
 *   nameKey?: string,
 *   description?: string,
 *   descriptionKey?: string,
 *   features?: string[],
 *   featureKeys?: string[],
 * }} albumType
 */
export const resolveAlbumTypeCopy = (t, albumType) => {
  const name = albumType.name ?? t(albumType.nameKey);
  const description = albumType.description ?? t(albumType.descriptionKey);
  const features =
    albumType.features ??
    (albumType.featureKeys || []).map((featureKey) => t(featureKey));

  return { name, description, features };
};

/**
 * Build modal form values from an album type (edit) or empty (create).
 * @param {(key: string) => string} t
 * @param {typeof ADMIN_ALBUM_TYPE_ITEMS[number] | null | undefined} albumType
 */
export const getAlbumTypeFormDefaults = (t, albumType) => {
  if (!albumType) {
    return {
      name: '',
      prizeMoney: '',
      description: '',
      featured: '',
    };
  }

  const { name, description, features } = resolveAlbumTypeCopy(t, albumType);
  return {
    name,
    prizeMoney: Number(albumType.prizeMoney).toFixed(2),
    description,
    featured: features.join('\n'),
  };
};
