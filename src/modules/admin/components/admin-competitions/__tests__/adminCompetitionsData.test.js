import {
  COMPETITION_CARDS,
  filterCompetitionCards,
  getCompetitionDetailPath,
  paginateCompetitionCards,
  toggleCompetitionFilter,
} from '@/modules/admin/data/adminCompetitionsData';

describe('adminCompetitionsData helpers', () => {
  it('builds a detail path from the route pattern', () => {
    expect(getCompetitionDetailPath('autumn', '/admin/my-competitions/:id')).toBe(
      '/admin/my-competitions/autumn',
    );
  });

  it('filters cards by album type without mutating the source list', () => {
    const sourceLength = COMPETITION_CARDS.length;
    const zodiacOnly = filterCompetitionCards(COMPETITION_CARDS, 'zodiac');

    expect(zodiacOnly).toHaveLength(1);
    expect(zodiacOnly[0].id).toBe('zodiac');
    expect(COMPETITION_CARDS).toHaveLength(sourceLength);
    expect(filterCompetitionCards(COMPETITION_CARDS, null)).toBe(COMPETITION_CARDS);
  });

  it('paginates with a 1-based page index', () => {
    const pageOne = paginateCompetitionCards(COMPETITION_CARDS, 1, 3);
    const pageTwo = paginateCompetitionCards(COMPETITION_CARDS, 2, 3);

    expect(pageOne.map((card) => card.id)).toEqual(['autumn', 'wings', 'city']);
    expect(pageTwo.map((card) => card.id)).toEqual(['forest', 'morning', 'harbor']);
  });

  it('toggles the active filter idempotently', () => {
    expect(toggleCompetitionFilter(null, 'six')).toBe('six');
    expect(toggleCompetitionFilter('six', 'six')).toBeNull();
    expect(toggleCompetitionFilter('six', 'single')).toBe('single');
  });
});
