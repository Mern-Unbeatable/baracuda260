/** Admin Categories — Figma node 339:3170. */

const A = '/assets/admin-categories';

export const ADMIN_CATEGORIES_ASSETS = {
  plus: `${A}/icon-plus.svg`,
  trash: `${A}/icon-trash.svg`,
};

export const PLUS_ICON_SIZE = 16;
export const TRASH_ICON_SIZE = 20;

export const ADMIN_CATEGORY_ITEMS = [
  { id: 'nature', labelKey: 'adminCategories.items.nature' },
  { id: 'portrait', labelKey: 'adminCategories.items.portrait' },
  { id: 'wildlife', labelKey: 'adminCategories.items.wildlife' },
  { id: 'landscape', labelKey: 'adminCategories.items.landscape' },
  { id: 'street', labelKey: 'adminCategories.items.street' },
  { id: 'architecture', labelKey: 'adminCategories.items.architecture' },
  { id: 'black-white', labelKey: 'adminCategories.items.blackWhite' },
  { id: 'travel', labelKey: 'adminCategories.items.travel' },
  { id: 'wedding', labelKey: 'adminCategories.items.wedding' },
  { id: 'macro', labelKey: 'adminCategories.items.macro' },
  { id: 'fine-art', labelKey: 'adminCategories.items.fineArt' },
  { id: 'pets', labelKey: 'adminCategories.items.pets' },
  { id: 'sports', labelKey: 'adminCategories.items.sports' },
  { id: 'night', labelKey: 'adminCategories.items.night' },
];

/**
 * @param {typeof ADMIN_CATEGORY_ITEMS} categories
 * @param {string} categoryId
 */
export const removeCategoryById = (categories, categoryId) =>
  categories.filter((category) => category.id !== categoryId);

/**
 * @param {typeof ADMIN_CATEGORY_ITEMS} categories
 * @param {{ id: string, labelKey: string }} category
 */
export const appendCategory = (categories, category) => {
  if (!category?.id) return categories;
  if (categories.some((item) => item.id === category.id)) return categories;
  return [...categories, category];
};

/**
 * @param {number} nextIndex
 */
export const createAddedCategory = (nextIndex) => ({
  id: `custom-${nextIndex}`,
  labelKey: 'adminCategories.items.newCategory',
  labelParams: { number: nextIndex },
});
