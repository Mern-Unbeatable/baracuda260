/** Admin Payouts — three-section payout tables (Prize, Donation, Premium). */

const A = '/assets/admin-payouts';

export const ADMIN_PAYOUTS_ASSETS = {
  chevronDown: `${A}/icon-chevron-down.svg`,
  more: `${A}/icon-more.svg`,
};

export const MORE_ICON_SIZE = 20;

export const PAYOUT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
};

export const STATUS_STYLES = {
  [PAYOUT_STATUS.PENDING]: {
    bg: 'bg-[#fff6e9]',
    dot: 'bg-[#bd7b25]',
    text: 'text-[#bd7b25]',
  },
  [PAYOUT_STATUS.APPROVED]: {
    bg: 'bg-[#eef7f3]',
    dot: 'bg-[#268262]',
    text: 'text-[#268262]',
  },
};

export const STATUS_LABEL_KEYS = {
  [PAYOUT_STATUS.PENDING]: 'adminPayouts.status.pending',
  [PAYOUT_STATUS.APPROVED]: 'adminPayouts.status.approved',
};

export const ACTION_STATUS_OPTIONS = [
  { id: PAYOUT_STATUS.PENDING, labelKey: 'adminPayouts.status.pending' },
  { id: PAYOUT_STATUS.APPROVED, labelKey: 'adminPayouts.status.approved' },
];

export const PAYOUTS_PAGE_SIZE = 7;

const SHARED_ROWS = [
  {
    id: 'row-1',
    dateKey: 'adminPayouts.rows.r1.date',
    typeKey: 'adminPayouts.columns.withdrawal',
    accountTypeKey: 'adminPayouts.columns.paypal',
    accountNumber: '(702) 555-0122',
    amount: '$1,250.00',
    status: PAYOUT_STATUS.APPROVED,
  },
  {
    id: 'row-2',
    dateKey: 'adminPayouts.rows.r2.date',
    typeKey: 'adminPayouts.columns.withdrawal',
    accountTypeKey: 'adminPayouts.columns.paypal',
    accountNumber: '(406) 555-0120',
    amount: '$1,250.00',
    status: PAYOUT_STATUS.APPROVED,
  },
  {
    id: 'row-3',
    dateKey: 'adminPayouts.rows.r3.date',
    typeKey: 'adminPayouts.columns.withdrawal',
    accountTypeKey: 'adminPayouts.columns.paypal',
    accountNumber: '(205) 555-0100',
    amount: '$1,250.00',
    status: PAYOUT_STATUS.APPROVED,
  },
  {
    id: 'row-4',
    dateKey: 'adminPayouts.rows.r4.date',
    typeKey: 'adminPayouts.columns.withdrawal',
    accountTypeKey: 'adminPayouts.columns.paypal',
    accountNumber: '(229) 555-0109',
    amount: '$1,250.00',
    status: PAYOUT_STATUS.APPROVED,
  },
  {
    id: 'row-5',
    dateKey: 'adminPayouts.rows.r5.date',
    typeKey: 'adminPayouts.columns.withdrawal',
    accountTypeKey: 'adminPayouts.columns.paypal',
    accountNumber: '(319) 555-0115',
    amount: '$1,250.00',
    status: PAYOUT_STATUS.APPROVED,
  },
  {
    id: 'row-6',
    dateKey: 'adminPayouts.rows.r6.date',
    typeKey: 'adminPayouts.columns.withdrawal',
    accountTypeKey: 'adminPayouts.columns.paypal',
    accountNumber: '(317) 555-0113',
    amount: '$1,250.00',
    status: PAYOUT_STATUS.APPROVED,
  },
];

const prefixRows = (rows, prefix) =>
  rows.map((r) => ({ ...r, id: `${prefix}-${r.id}` }));

export const PAYOUT_SECTIONS = [
  {
    id: 'prize',
    titleKey: 'adminPayouts.sections.prize.title',
    subtitleKey: 'adminPayouts.sections.prize.subtitle',
    rows: prefixRows(SHARED_ROWS, 'prize'),
  },
  {
    id: 'donation',
    titleKey: 'adminPayouts.sections.donation.title',
    subtitleKey: 'adminPayouts.sections.donation.subtitle',
    rows: prefixRows(SHARED_ROWS, 'donation'),
  },
  {
    id: 'premium',
    titleKey: 'adminPayouts.sections.premium.title',
    subtitleKey: 'adminPayouts.sections.premium.subtitle',
    rows: prefixRows(SHARED_ROWS, 'premium'),
  },
];
