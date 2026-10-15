/** Admin Payouts — tabbed payout tables (Prize, Donation, Photo Sales, Store). */

const A = '/assets/admin-payouts';

export const ADMIN_PAYOUTS_ASSETS = {
  chevronDown: `${A}/icon-chevron-down.svg`,
  more: `${A}/icon-more.svg`,
};

export const MORE_ICON_SIZE = 20;

export const PAYOUT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  REJECTED: 'rejected',
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
  appoved: {
    bg: 'bg-[#eef7f3]',
    dot: 'bg-[#268262]',
    text: 'text-[#268262]',
  },
  [PAYOUT_STATUS.PAID]: {
    bg: 'bg-[#eef7f3]',
    dot: 'bg-[#268262]',
    text: 'text-[#268262]',
  },
  [PAYOUT_STATUS.REJECTED]: {
    bg: 'bg-[#fff1f2]',
    dot: 'bg-[#ee1c25]',
    text: 'text-[#ee1c25]',
  },
};

export const STATUS_LABEL_KEYS = {
  [PAYOUT_STATUS.PENDING]: 'adminPayouts.status.pending',
  [PAYOUT_STATUS.APPROVED]: 'adminPayouts.status.approved',
  appoved: 'adminPayouts.status.approved',
  [PAYOUT_STATUS.PAID]: 'adminPayouts.status.paid',
  [PAYOUT_STATUS.REJECTED]: 'adminPayouts.status.rejected',
};

export const ACTION_STATUS_OPTIONS = [
  { id: 'PENDING', labelKey: 'adminPayouts.status.pending', labelFallback: 'Pending' },
  { id: 'APPROVED', labelKey: 'adminPayouts.status.approved', labelFallback: 'Approved' },
  { id: 'PAID', labelKey: 'adminPayouts.status.paid', labelFallback: 'Paid' },
  { id: 'REJECTED', labelKey: 'adminPayouts.status.rejected', labelFallback: 'Rejected' },
];

export const PAYOUTS_PAGE_SIZE = 7;

export const PAYOUT_TABS = [
  { id: 'prize', labelKey: 'adminPayouts.tabs.prize' },
  { id: 'donation', labelKey: 'adminPayouts.tabs.donation' },
  { id: 'premium', labelKey: 'adminPayouts.tabs.premium' },
  { id: 'store', labelKey: 'adminPayouts.tabs.store' },
];

export const PAYOUT_SECTIONS = [
  {
    id: 'prize',
    titleKey: 'adminPayouts.sections.prize.title',
    subtitleKey: 'adminPayouts.sections.prize.subtitle',
    tabLabelKey: 'adminPayouts.tabs.prize',
    rows: [],
  },
  {
    id: 'donation',
    titleKey: 'adminPayouts.sections.donation.title',
    subtitleKey: 'adminPayouts.sections.donation.subtitle',
    tabLabelKey: 'adminPayouts.tabs.donation',
    rows: [],
  },
  {
    id: 'premium',
    titleKey: 'adminPayouts.sections.premium.title',
    subtitleKey: 'adminPayouts.sections.premium.subtitle',
    tabLabelKey: 'adminPayouts.tabs.premium',
    rows: [],
  },
  {
    id: 'store',
    titleKey: 'adminPayouts.sections.store.title',
    subtitleKey: 'adminPayouts.sections.store.subtitle',
    tabLabelKey: 'adminPayouts.tabs.store',
    rows: [],
  },
];
