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

export const ALBUM_TYPE_KINDS = ['SINGLE', 'SIX', 'TWELVE'];

const KIND_ICON_KEYS = {
  SINGLE: 'camera',
  SIX: 'book',
  TWELVE: 'zodiac',
};

/** The backend stores feature lines joined by a literal backslash-n. */
const FEATURE_SEPARATOR = '\\n';
const FEATURE_SPLIT_PATTERN = /\\n|\r?\n/;

export const MODAL_MODE = {
  CREATE: 'create',
  EDIT: 'edit',
};

/**
 * @param {{ iconKey?: string | null, kind?: string }} albumType
 */
export const getAlbumTypeIcon = (albumType) =>
  ADMIN_ALBUM_TYPES_ASSETS[albumType.iconKey] ||
  ADMIN_ALBUM_TYPES_ASSETS[KIND_ICON_KEYS[albumType.kind]] ||
  ADMIN_ALBUM_TYPES_ASSETS.camera;

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
 * Split stored or typed features into trimmed, non-empty lines.
 * @param {string | null | undefined} features
 * @returns {string[]}
 */
export const parseFeatures = (features) =>
  String(features || '')
    .split(FEATURE_SPLIT_PATTERN)
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * Build modal form values from an album type (edit) or empty (create).
 * @param {object | null | undefined} albumType
 */
export const getAlbumTypeFormDefaults = (albumType) => {
  if (!albumType) {
    return {
      kind: ALBUM_TYPE_KINDS[0],
      name: '',
      prizeMoney: '',
      description: '',
      featured: '',
    };
  }

  const prizeMoney = Number(albumType.prizeMoney);
  return {
    kind: albumType.kind,
    name: albumType.name ?? '',
    prizeMoney: Number.isFinite(prizeMoney) ? prizeMoney.toFixed(2) : '',
    description: albumType.description ?? '',
    featured: parseFeatures(albumType.features).join('\n'),
  };
};

/**
 * @param {{
 *   kind: string,
 *   name: string,
 *   prizeMoney: string,
 *   description: string,
 *   featured: string,
 * }} values
 * @param {{ includeKind: boolean }} options
 */
export const buildAlbumTypePayload = (values, { includeKind }) => ({
  ...(includeKind ? { kind: values.kind } : {}),
  name: values.name.trim(),
  prizeMoney: parsePrizeMoney(values.prizeMoney),
  description: values.description.trim(),
  features: parseFeatures(values.featured).join(FEATURE_SEPARATOR),
});
