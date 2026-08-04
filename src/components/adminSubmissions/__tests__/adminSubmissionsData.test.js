import {
  SUBMISSION_CARDS,
  filterSubmissionCards,
  selectSubmissionFilter,
} from '../adminSubmissionsData';

describe('adminSubmissionsData helpers', () => {
  it('filters cards by album type without mutating the source list', () => {
    const sourceLength = SUBMISSION_CARDS.length;
    const singleOnly = filterSubmissionCards(SUBMISSION_CARDS, 'single');
    const sixOnly = filterSubmissionCards(SUBMISSION_CARDS, 'six');
    const zodiacOnly = filterSubmissionCards(SUBMISSION_CARDS, 'zodiac');

    expect(singleOnly).toHaveLength(4);
    expect(sixOnly.map((card) => card.id)).toEqual(['autumn', 'city']);
    expect(zodiacOnly.map((card) => card.id)).toEqual(['tidal', 'zodiac']);
    expect(SUBMISSION_CARDS).toHaveLength(sourceLength);
    expect(filterSubmissionCards(SUBMISSION_CARDS, 'all')).toBe(SUBMISSION_CARDS);
  });

  it('selects the next filter id with a safe fallback', () => {
    expect(selectSubmissionFilter('all', 'six')).toBe('six');
    expect(selectSubmissionFilter('six', '')).toBe('six');
    expect(selectSubmissionFilter('', '')).toBe('all');
  });
});
