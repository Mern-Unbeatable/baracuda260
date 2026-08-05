/** Admin Payouts — Figma node 339:4423. */

const A = '/assets/admin-payouts';

export const ADMIN_PAYOUTS_ASSETS = {
  chevronDown: `${A}/icon-chevron-down.svg`,
};

export const PAYOUT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
};

export const STATUS_FILTERS = [
  { id: 'all', labelKey: 'adminPayouts.filters.all' },
  { id: PAYOUT_STATUS.PENDING, labelKey: 'adminPayouts.filters.pending' },
  { id: PAYOUT_STATUS.PROCESSING, labelKey: 'adminPayouts.filters.processing' },
  { id: PAYOUT_STATUS.PAID, labelKey: 'adminPayouts.filters.paid' },
];

export const STATUS_LABEL_KEYS = {
  [PAYOUT_STATUS.PENDING]: 'adminPayouts.status.pending',
  [PAYOUT_STATUS.PROCESSING]: 'adminPayouts.status.processing',
  [PAYOUT_STATUS.PAID]: 'adminPayouts.status.paid',
};

export const STATUS_STYLES = {
  [PAYOUT_STATUS.PENDING]: {
    bg: 'bg-[#fff6e9]',
    dot: 'bg-[#bd7b25]',
    text: 'text-[#bd7b25]',
  },
  [PAYOUT_STATUS.PROCESSING]: {
    bg: 'bg-[#edf3ff]',
    dot: 'bg-[#3d72c8]',
    text: 'text-[#3d72c8]',
  },
  [PAYOUT_STATUS.PAID]: {
    bg: 'bg-[#eef7f3]',
    dot: 'bg-[#268262]',
    text: 'text-[#268262]',
  },
};

export const AVATAR_STYLES = {
  indigo: { bg: 'bg-[#e4e5fb]', text: 'text-[#435176]' },
  peach: { bg: 'bg-[#fce7df]', text: 'text-[#435176]' },
  green: { bg: 'bg-[#e7f4df]', text: 'text-[#435176]' },
};

export const PAYOUTS_PAGE_SIZE = 7;
/** Figma footer total for page chrome. */
export const PAYOUTS_TOTAL_RESULTS = 2480;
export const CHEVRON_ICON_SIZE = 24;
export const AVATAR_SIZE = 39;

/** Mock rows matching Figma 339:4423. */
export const ADMIN_PAYOUT_ROWS = [
  {
    id: 'kofi-agyeman',
    nameKey: 'adminPayouts.rows.kofi.name',
    email: 'kofi@frame.work',
    initials: 'KA',
    avatarTone: 'indigo',
    totalEarn: '$12000.00',
    withdrawAmount: '$1,647',
    paypalNumber: '+1 (555) 010-1001',
    requestedKey: 'adminPayouts.rows.kofi.requested',
    status: PAYOUT_STATUS.PENDING,
  },
  {
    id: 'b-nguyen',
    nameKey: 'adminPayouts.rows.nguyen.name',
    email: 'bn@atelier.vn',
    initials: 'BN',
    avatarTone: 'peach',
    totalEarn: '$12000.00',
    withdrawAmount: '$1,827',
    paypalNumber: '+1 (555) 010-1054',
    requestedKey: 'adminPayouts.rows.nguyen.requested',
    status: PAYOUT_STATUS.PROCESSING,
  },
  {
    id: 'tara-cole-1',
    nameKey: 'adminPayouts.rows.tara.name',
    email: 'tara@cole.studio',
    initials: 'TC',
    avatarTone: 'green',
    totalEarn: '$12000.00',
    withdrawAmount: '$984',
    paypalNumber: '+1 (555) 010-5322',
    requestedKey: 'adminPayouts.rows.tara.requested',
    status: PAYOUT_STATUS.PAID,
  },
  {
    id: 'tara-cole-2',
    nameKey: 'adminPayouts.rows.tara.name',
    email: 'tara@cole.studio',
    initials: 'TC',
    avatarTone: 'green',
    totalEarn: '$12000.00',
    withdrawAmount: '$984',
    paypalNumber: '+1 (555) 010-5322',
    requestedKey: 'adminPayouts.rows.tara.requested',
    status: PAYOUT_STATUS.PAID,
  },
  {
    id: 'tara-cole-3',
    nameKey: 'adminPayouts.rows.tara.name',
    email: 'tara@cole.studio',
    initials: 'TC',
    avatarTone: 'green',
    totalEarn: '$12000.00',
    withdrawAmount: '$984',
    paypalNumber: '+1 (555) 010-5322',
    requestedKey: 'adminPayouts.rows.tara.requested',
    status: PAYOUT_STATUS.PAID,
  },
  {
    id: 'tara-cole-4',
    nameKey: 'adminPayouts.rows.tara.name',
    email: 'tara@cole.studio',
    initials: 'TC',
    avatarTone: 'green',
    totalEarn: '$12000.00',
    withdrawAmount: '$984',
    paypalNumber: '+1 (555) 010-5322',
    requestedKey: 'adminPayouts.rows.tara.requested',
    status: PAYOUT_STATUS.PAID,
  },
  {
    id: 'tara-cole-5',
    nameKey: 'adminPayouts.rows.tara.name',
    email: 'tara@cole.studio',
    initials: 'TC',
    avatarTone: 'green',
    totalEarn: '$12000.00',
    withdrawAmount: '$984',
    paypalNumber: '+1 (555) 010-5322',
    requestedKey: 'adminPayouts.rows.tara.requested',
    status: PAYOUT_STATUS.PAID,
  },
];

/**
 * @param {typeof ADMIN_PAYOUT_ROWS} rows
 * @param {string} filterId
 */
export const filterPayoutsByStatus = (rows, filterId) => {
  if (!filterId || filterId === 'all') return rows;
  return rows.filter((row) => row.status === filterId);
};

/**
 * @param {typeof ADMIN_PAYOUT_ROWS} rows
 * @param {number} page
 * @param {number} pageSize
 */
export const paginatePayouts = (rows, page, pageSize) => {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
};

/**
 * Visible page numbers around the current page (Figma shows 1–3).
 * @param {number} page
 * @param {number} totalPages
 * @param {number} [windowSize]
 */
export const getPayoutPageNumbers = (page, totalPages, windowSize = 3) => {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotal);
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, safePage - half);
  let end = Math.min(safeTotal, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = [];
  for (let n = start; n <= end; n += 1) pages.push(n);
  return pages;
};
