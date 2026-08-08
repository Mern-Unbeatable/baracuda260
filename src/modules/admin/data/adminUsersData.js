/** Admin Users Management — Figma node 339:2960. */

const A = '/assets/admin-users';

export const ADMIN_USERS_ASSETS = {
  chevronDown: `${A}/icon-chevron-down.svg`,
  trash: `${A}/icon-trash.svg`,
  reactivate: `${A}/icon-reactivate.svg`,
  close: `${A}/icon-close.svg`,
};

export const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
};

export const STATUS_FILTERS = [
  { id: 'all', labelKey: 'adminUsers.filters.all' },
  { id: USER_STATUS.ACTIVE, labelKey: 'adminUsers.filters.active' },
  { id: USER_STATUS.SUSPENDED, labelKey: 'adminUsers.filters.suspended' },
];

export const STATUS_LABEL_KEYS = {
  [USER_STATUS.ACTIVE]: 'adminUsers.status.active',
  [USER_STATUS.SUSPENDED]: 'adminUsers.status.suspended',
};

export const USERS_PAGE_SIZE = 7;
export const ACTION_ICON_SIZE = 24;
export const CHEVRON_ICON_SIZE = 24;
export const CLOSE_ICON_SIZE = 18;

/**
 * @param {string} reason
 */
export const isSuspendReasonValid = (reason) => Boolean(String(reason || '').trim());

export const ADMIN_USERS = [
  {
    id: 'john-anderson',
    nameKey: 'adminUsers.rows.john.name',
    email: 'john.anderson@company.com',
    phone: '+324 356 9876',
    registeredDate: '6/9/2026',
    status: USER_STATUS.ACTIVE,
  },
  {
    id: 'sarah-mitchell',
    nameKey: 'adminUsers.rows.sarah.name',
    email: 'sarah.m@email.com',
    phone: '+324 356 9876',
    registeredDate: '6/9/2026',
    status: USER_STATUS.ACTIVE,
  },
  {
    id: 'buildpro-corp',
    nameKey: 'adminUsers.rows.buildpro.name',
    email: 'admin@buildpro.com',
    phone: '+324 356 9876',
    registeredDate: '6/9/2026',
    status: USER_STATUS.ACTIVE,
  },
  {
    id: 'mike-johnson',
    nameKey: 'adminUsers.rows.mike.name',
    email: 'contact@construction.com',
    phone: '+324 356 9876',
    registeredDate: '6/9/2026',
    status: USER_STATUS.ACTIVE,
  },
  {
    id: 'construction-ltd',
    nameKey: 'adminUsers.rows.construction.name',
    email: 'emily.d@email.com',
    phone: '+324 356 9876',
    registeredDate: '6/9/2026',
    status: USER_STATUS.ACTIVE,
  },
  {
    id: 'emily-davis',
    nameKey: 'adminUsers.rows.emily.name',
    email: 'emily.d@email.com',
    phone: '+324 356 9876',
    registeredDate: '6/9/2026',
    status: USER_STATUS.SUSPENDED,
  },
];

/**
 * @param {typeof ADMIN_USERS} users
 * @param {string} filterId
 */
export const filterUsersByStatus = (users, filterId) => {
  if (!filterId || filterId === 'all') return users;
  return users.filter((user) => user.status === filterId);
};

/**
 * @param {number} page
 * @param {number} pageSize
 * @param {number} total
 */
export const getUsersPageRange = (page, pageSize, total) => {
  if (total <= 0) {
    return { from: 0, to: 0, total: 0 };
  }
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return { from, to, total };
};

/**
 * @param {typeof ADMIN_USERS} users
 * @param {number} page
 * @param {number} pageSize
 */
export const paginateUsers = (users, page, pageSize) => {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return users.slice(start, start + pageSize);
};

/**
 * @param {string} status
 */
export const toggleUserStatus = (status) =>
  status === USER_STATUS.ACTIVE ? USER_STATUS.SUSPENDED : USER_STATUS.ACTIVE;
