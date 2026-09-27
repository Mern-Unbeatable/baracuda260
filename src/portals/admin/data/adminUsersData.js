/** Admin Users Management — Figma node 339:2960. */

const A = '/assets/admin-users';

export const ADMIN_USERS_ASSETS = {
  chevronDown: `${A}/icon-chevron-down.svg`,
  trash: `${A}/icon-trash.svg`,
  reactivate: `${A}/icon-reactivate.svg`,
  close: `${A}/icon-close.svg`,
};

/** Backend user statuses. */
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
};

/** `id` is sent as the `status` query param. */
export const STATUS_FILTERS = [
  { id: 'All', labelKey: 'adminUsers.filters.all' },
  { id: USER_STATUS.ACTIVE, labelKey: 'adminUsers.filters.active' },
  { id: USER_STATUS.PENDING, labelKey: 'adminUsers.filters.pending' },
  { id: USER_STATUS.SUSPENDED, labelKey: 'adminUsers.filters.suspended' },
];

export const DEFAULT_STATUS_FILTER = 'All';

export const USER_STATUS_STYLES = {
  [USER_STATUS.ACTIVE]: {
    badge: 'bg-[#eef7f3]',
    dot: 'bg-[#268262]',
    text: 'text-[#268262]',
  },
  [USER_STATUS.PENDING]: {
    badge: 'bg-[#fff7e6]',
    dot: 'bg-[#c27c0e]',
    text: 'text-[#c27c0e]',
  },
  [USER_STATUS.SUSPENDED]: {
    badge: 'bg-[#f2f1f8]',
    dot: 'bg-[#766f9a]',
    text: 'text-[#766f9a]',
  },
};

export const USERS_PAGE_SIZE = 10;
export const ACTION_ICON_SIZE = 24;
export const CHEVRON_ICON_SIZE = 24;
export const CLOSE_ICON_SIZE = 18;

/**
 * @param {import('i18next').TFunction} t
 * @param {string | null | undefined} status
 */
export const getUserStatusLabel = (t, status) =>
  status
    ? t(`adminUsers.status.${status.toLowerCase()}`, { defaultValue: status })
    : '—';

/**
 * @param {import('i18next').TFunction} t
 * @param {string | null | undefined} role
 */
export const getUserRoleLabel = (t, role) =>
  role
    ? t(`adminUsers.roles.${role.toLowerCase()}`, { defaultValue: role })
    : '—';

/**
 * @param {string | null | undefined} isoDate
 * @param {string} [locale]
 * @param {Intl.DateTimeFormatOptions} [options]
 */
export const formatUserDate = (
  isoDate,
  locale,
  options = { year: 'numeric', month: 'numeric', day: 'numeric' },
) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(locale, options);
};

/** Some stored avatars are Windows file paths (`E:\\...`) and can never load. */
export const isUsableImageUrl = (url) =>
  typeof url === 'string' && url.trim() !== '' && !url.includes('\\');

/** @param {string | null | undefined} name */
export const getUserInitials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';

/**
 * @param {string} reason
 */
export const isSuspendReasonValid = (reason) =>
  Boolean(String(reason || '').trim());
