import {
  ADMIN_PAYOUT_ROWS,
  PAYOUT_STATUS,
  filterPayoutsByStatus,
  getPayoutPageNumbers,
  paginatePayouts,
  updatePayoutStatus,
} from '../adminPayoutsData';

describe('adminPayoutsData helpers', () => {
  it('filters payouts by status without mutating source', () => {
    const sourceLength = ADMIN_PAYOUT_ROWS.length;
    const pending = filterPayoutsByStatus(ADMIN_PAYOUT_ROWS, PAYOUT_STATUS.PENDING);
    const processing = filterPayoutsByStatus(ADMIN_PAYOUT_ROWS, PAYOUT_STATUS.PROCESSING);
    const paid = filterPayoutsByStatus(ADMIN_PAYOUT_ROWS, PAYOUT_STATUS.PAID);

    expect(pending).toHaveLength(1);
    expect(processing).toHaveLength(1);
    expect(paid).toHaveLength(5);
    expect(filterPayoutsByStatus(ADMIN_PAYOUT_ROWS, 'all')).toHaveLength(sourceLength);
    expect(ADMIN_PAYOUT_ROWS).toHaveLength(sourceLength);
  });

  it('paginates payout rows', () => {
    const pageOne = paginatePayouts(ADMIN_PAYOUT_ROWS, 1, 3);
    const pageTwo = paginatePayouts(ADMIN_PAYOUT_ROWS, 2, 3);

    expect(pageOne).toHaveLength(3);
    expect(pageOne[0].id).toBe('kofi-agyeman');
    expect(pageTwo[0].id).toBe('tara-cole-2');
  });

  it('builds a window of page numbers', () => {
    expect(getPayoutPageNumbers(1, 3)).toEqual([1, 2, 3]);
    expect(getPayoutPageNumbers(2, 5)).toEqual([1, 2, 3]);
    expect(getPayoutPageNumbers(5, 5)).toEqual([3, 4, 5]);
  });

  it('updates a row status immutably', () => {
    const next = updatePayoutStatus(ADMIN_PAYOUT_ROWS, 'kofi-agyeman', PAYOUT_STATUS.PAID);
    expect(next.find((row) => row.id === 'kofi-agyeman')?.status).toBe(PAYOUT_STATUS.PAID);
    expect(ADMIN_PAYOUT_ROWS.find((row) => row.id === 'kofi-agyeman')?.status).toBe(
      PAYOUT_STATUS.PENDING,
    );
  });
});
