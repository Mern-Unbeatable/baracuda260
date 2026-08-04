import {
  ADMIN_USERS,
  USER_STATUS,
  filterUsersByStatus,
  getUsersPageRange,
  isSuspendReasonValid,
  paginateUsers,
  toggleUserStatus,
} from '../adminUsersData';

describe('adminUsersData helpers', () => {
  it('filters users by status without mutating the source list', () => {
    const sourceLength = ADMIN_USERS.length;
    const activeOnly = filterUsersByStatus(ADMIN_USERS, USER_STATUS.ACTIVE);
    const suspendedOnly = filterUsersByStatus(ADMIN_USERS, USER_STATUS.SUSPENDED);

    expect(activeOnly).toHaveLength(5);
    expect(suspendedOnly).toHaveLength(1);
    expect(suspendedOnly[0].id).toBe('emily-davis');
    expect(ADMIN_USERS).toHaveLength(sourceLength);
    expect(filterUsersByStatus(ADMIN_USERS, 'all')).toBe(ADMIN_USERS);
  });

  it('paginates with a 1-based page index', () => {
    const pageOne = paginateUsers(ADMIN_USERS, 1, 3);
    const pageTwo = paginateUsers(ADMIN_USERS, 2, 3);

    expect(pageOne.map((user) => user.id)).toEqual([
      'john-anderson',
      'sarah-mitchell',
      'buildpro-corp',
    ]);
    expect(pageTwo.map((user) => user.id)).toEqual([
      'mike-johnson',
      'construction-ltd',
      'emily-davis',
    ]);
  });

  it('builds a showing range for the current page', () => {
    expect(getUsersPageRange(1, 7, 6)).toEqual({ from: 1, to: 6, total: 6 });
    expect(getUsersPageRange(2, 3, 6)).toEqual({ from: 4, to: 6, total: 6 });
    expect(getUsersPageRange(1, 7, 0)).toEqual({ from: 0, to: 0, total: 0 });
  });

  it('toggles active and suspended status', () => {
    expect(toggleUserStatus(USER_STATUS.ACTIVE)).toBe(USER_STATUS.SUSPENDED);
    expect(toggleUserStatus(USER_STATUS.SUSPENDED)).toBe(USER_STATUS.ACTIVE);
  });

  it('validates suspend reason input', () => {
    expect(isSuspendReasonValid('ok')).toBe(true);
    expect(isSuspendReasonValid(' ')).toBe(false);
  });
});
