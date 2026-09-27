/** Admin Categories — Figma node 339:3170 / Add popup 339:4813. */

import { getLocalizedText } from '@/shared/utils/localizedText';

const A = '/assets/admin-categories';

export const ADMIN_CATEGORIES_ASSETS = {
  plus: `${A}/icon-plus.svg`,
  trash: `${A}/icon-trash.svg`,
  close: `${A}/icon-close.svg`,
};

export const PLUS_ICON_SIZE = 16;
export const TRASH_ICON_SIZE = 20;
export const CLOSE_ICON_SIZE = 18;

export const getCategoryName = getLocalizedText;

/**
 * "Street & Night Photography" -> "street-night-photography"
 * @param {string} value
 */
export const slugify = (value) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * @param {string} name
 */
export const isCategoryNameValid = (name) => Boolean(slugify(name));

/**
 * @param {string} name
 * @param {string} [parentId]
 */
export const buildCategoryPayload = (name, parentId) => {
  const trimmedName = String(name || '').trim();
  return {
    name: trimmedName,
    slug: slugify(trimmedName),
    ...(parentId ? { parentId } : {}),
  };
};

/**
 * @param {Array<{ subcategories?: Array<object> }>} categories
 */
export const flattenSubcategories = (categories) =>
  categories.flatMap((category) => category.subcategories ?? []);
