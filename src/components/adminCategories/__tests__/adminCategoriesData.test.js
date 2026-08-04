import {
  ADMIN_CATEGORY_ITEMS,
  appendCategory,
  createAddedCategory,
  removeCategoryById,
} from '../adminCategoriesData';

describe('adminCategoriesData helpers', () => {
  it('removes a category by id without mutating the source list', () => {
    const sourceLength = ADMIN_CATEGORY_ITEMS.length;
    const next = removeCategoryById(ADMIN_CATEGORY_ITEMS, 'nature');

    expect(next).toHaveLength(sourceLength - 1);
    expect(next.find((item) => item.id === 'nature')).toBeUndefined();
    expect(ADMIN_CATEGORY_ITEMS).toHaveLength(sourceLength);
  });

  it('appends a unique category and skips duplicates', () => {
    const added = { id: 'astro', labelKey: 'adminCategories.items.newCategory' };
    const once = appendCategory(ADMIN_CATEGORY_ITEMS, added);
    const twice = appendCategory(once, added);

    expect(once).toHaveLength(ADMIN_CATEGORY_ITEMS.length + 1);
    expect(twice).toHaveLength(once.length);
    expect(appendCategory(ADMIN_CATEGORY_ITEMS, null)).toBe(ADMIN_CATEGORY_ITEMS);
  });

  it('creates a numbered custom category payload', () => {
    expect(createAddedCategory(2)).toEqual({
      id: 'custom-2',
      labelKey: 'adminCategories.items.newCategory',
      labelParams: { number: 2 },
    });
  });
});
