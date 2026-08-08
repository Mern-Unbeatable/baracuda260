import {
  appendAlbumType,
  createAlbumTypeFromForm,
  formatPrizeMoney,
  isAlbumTypeFormValid,
  isPrizeMoneyValid,
  parseFeaturedLines,
  parsePrizeMoney,
  updateAlbumTypeById,
} from '@/modules/admin/data/adminAlbumTypesData';

describe('adminAlbumTypesData helpers', () => {
  it('formats prize money with two decimals', () => {
    expect(formatPrizeMoney(1500)).toBe('$1500.00');
    expect(formatPrizeMoney('2500')).toBe('$2500.00');
  });

  it('parses and validates prize money', () => {
    expect(parsePrizeMoney('$1,500.00')).toBe(1500);
    expect(isPrizeMoneyValid('1500.00')).toBe(true);
    expect(isPrizeMoneyValid('')).toBe(false);
    expect(isPrizeMoneyValid('abc')).toBe(false);
  });

  it('parses featured lines', () => {
    expect(parseFeaturedLines('  One \n\n Two \n')).toEqual(['One', 'Two']);
  });

  it('validates the album type form', () => {
    expect(
      isAlbumTypeFormValid({
        name: 'Single Photo',
        prizeMoney: '1500',
        description: 'A description',
        featured: 'Feature one\nFeature two',
      }),
    ).toBe(true);

    expect(
      isAlbumTypeFormValid({
        name: '',
        prizeMoney: '1500',
        description: 'A description',
        featured: 'Feature one',
      }),
    ).toBe(false);
  });

  it('updates an album type immutably', () => {
    const current = [
      {
        id: 'single-photo',
        nameKey: 'adminAlbumTypes.items.single.name',
        prizeMoney: 1500,
      },
    ];

    const next = updateAlbumTypeById(current, 'single-photo', {
      name: 'Updated',
      description: 'New description',
      features: ['A', 'B'],
      prizeMoney: 1800,
    });

    expect(next).not.toBe(current);
    expect(next[0]).toMatchObject({
      id: 'single-photo',
      name: 'Updated',
      description: 'New description',
      features: ['A', 'B'],
      prizeMoney: 1800,
    });
    expect(next[0].nameKey).toBeUndefined();
  });

  it('appends and creates custom album types', () => {
    const created = createAlbumTypeFromForm('Custom Story', 1, {
      description: 'Custom description',
      features: ['Feature'],
      prizeMoney: 999,
    });

    expect(created).toMatchObject({
      id: 'custom-1',
      iconKey: 'camera',
      name: 'Custom Story',
      prizeMoney: 999,
    });

    expect(appendAlbumType([], created)).toEqual([created]);
    expect(appendAlbumType([created], created)).toEqual([created]);
  });
});
