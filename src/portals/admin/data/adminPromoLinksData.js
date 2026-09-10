/** Admin Promo Links — list, filters, generate, reward status. */

export const PROMO_LINK_STATUS = {
  ACTIVE: 'active',
  USED: 'used',
  EXPIRED: 'expired',
};

export const PROMO_LINK_REWARD = {
  PAID: 'paid',
  UNDER_REVIEW: 'under_review',
  NOT_ELIGIBLE: 'not_eligible',
};

export const PROMO_LINK_REQUIREMENT = {
  NONE: 'none',
  INCOMPLETE: 'incomplete',
  COMPLETED: 'completed',
};

export const PROMO_LINK_DATE_RANGE = {
  ALL: 'all',
  LAST_7: 'last_7',
  LAST_30: 'last_30',
  LAST_90: 'last_90',
};

export const PROMO_LINKS_PAGE_SIZE = 8;
export const PROMO_LINK_VALIDITY_DAYS = 10;
export const PROMO_LINK_CHECKLIST_TOTAL = 9;

export const STATUS_FILTERS = [
  { id: 'all', labelKey: 'adminPromoLinks.filters.status.all' },
  { id: PROMO_LINK_STATUS.ACTIVE, labelKey: 'adminPromoLinks.filters.status.active' },
  { id: PROMO_LINK_STATUS.USED, labelKey: 'adminPromoLinks.filters.status.used' },
  { id: PROMO_LINK_STATUS.EXPIRED, labelKey: 'adminPromoLinks.filters.status.expired' },
];

export const DATE_FILTERS = [
  { id: PROMO_LINK_DATE_RANGE.LAST_30, labelKey: 'adminPromoLinks.filters.date.last30' },
  { id: PROMO_LINK_DATE_RANGE.LAST_7, labelKey: 'adminPromoLinks.filters.date.last7' },
  { id: PROMO_LINK_DATE_RANGE.LAST_90, labelKey: 'adminPromoLinks.filters.date.last90' },
  { id: PROMO_LINK_DATE_RANGE.ALL, labelKey: 'adminPromoLinks.filters.date.all' },
];

export const REQUIREMENT_FILTERS = [
  { id: 'all', labelKey: 'adminPromoLinks.filters.requirements.all' },
  { id: PROMO_LINK_REQUIREMENT.INCOMPLETE, labelKey: 'adminPromoLinks.filters.requirements.incomplete' },
  { id: PROMO_LINK_REQUIREMENT.COMPLETED, labelKey: 'adminPromoLinks.filters.requirements.completed' },
  { id: PROMO_LINK_REQUIREMENT.NONE, labelKey: 'adminPromoLinks.filters.requirements.none' },
];

export const REWARD_FILTERS = [
  { id: 'all', labelKey: 'adminPromoLinks.filters.reward.all' },
  { id: PROMO_LINK_REWARD.PAID, labelKey: 'adminPromoLinks.filters.reward.paid' },
  { id: PROMO_LINK_REWARD.UNDER_REVIEW, labelKey: 'adminPromoLinks.filters.reward.underReview' },
  { id: PROMO_LINK_REWARD.NOT_ELIGIBLE, labelKey: 'adminPromoLinks.filters.reward.notEligible' },
];

export const STATUS_LABEL_KEYS = {
  [PROMO_LINK_STATUS.ACTIVE]: 'adminPromoLinks.status.active',
  [PROMO_LINK_STATUS.USED]: 'adminPromoLinks.status.used',
  [PROMO_LINK_STATUS.EXPIRED]: 'adminPromoLinks.status.expired',
};

export const REWARD_LABEL_KEYS = {
  [PROMO_LINK_REWARD.PAID]: 'adminPromoLinks.reward.paid',
  [PROMO_LINK_REWARD.UNDER_REVIEW]: 'adminPromoLinks.reward.underReview',
  [PROMO_LINK_REWARD.NOT_ELIGIBLE]: 'adminPromoLinks.reward.notEligible',
};

export const STATUS_STYLES = {
  [PROMO_LINK_STATUS.ACTIVE]: {
    bg: 'bg-[#eef7f3]',
    text: 'text-[#268262]',
    dot: 'bg-[#268262]',
  },
  [PROMO_LINK_STATUS.USED]: {
    bg: 'bg-[#5850ec]',
    text: 'text-white',
    dot: 'bg-white',
  },
  [PROMO_LINK_STATUS.EXPIRED]: {
    bg: 'bg-[#f2f1f8]',
    text: 'text-[#766f9a]',
    dot: 'bg-[#766f9a]',
  },
};

export const CHECKLIST_STYLES = {
  [PROMO_LINK_REQUIREMENT.COMPLETED]: {
    bg: 'bg-[#eef7f3]',
    text: 'text-[#268262]',
  },
  [PROMO_LINK_REQUIREMENT.INCOMPLETE]: {
    bg: 'bg-[#fff4e8]',
    text: 'text-[#c26a1a]',
  },
};

export const REWARD_STYLES = {
  [PROMO_LINK_REWARD.PAID]: 'text-[#268262]',
  [PROMO_LINK_REWARD.UNDER_REVIEW]: 'text-[#687186]',
  [PROMO_LINK_REWARD.NOT_ELIGIBLE]: 'text-[#9aa3b5]',
};

export const PROMO_LINKS_STAT_CARDS = [
  {
    id: 'total',
    labelKey: 'adminPromoLinks.stats.total',
    iconBg: 'bg-[#eef2ff] text-[#4048cd]',
    Icon: 'Link2',
  },
  {
    id: 'active',
    labelKey: 'adminPromoLinks.stats.active',
    iconBg: 'bg-[#eef7f3] text-[#268262]',
    Icon: 'CheckCircle2',
  },
  {
    id: 'used',
    labelKey: 'adminPromoLinks.stats.used',
    iconBg: 'bg-[#f3eefc] text-[#7c3aed]',
    Icon: 'UserCheck',
  },
  {
    id: 'expired',
    labelKey: 'adminPromoLinks.stats.expired',
    iconBg: 'bg-[#eef6ff] text-[#2563eb]',
    Icon: 'Clock',
  },
  {
    id: 'incomplete',
    labelKey: 'adminPromoLinks.stats.incomplete',
    iconBg: 'bg-[#fff4e8] text-[#c26a1a]',
    Icon: 'ClipboardList',
  },
];

export const REWARD_ACTIONS = [
  PROMO_LINK_REWARD.NOT_ELIGIBLE,
  PROMO_LINK_REWARD.PAID,
  PROMO_LINK_REWARD.UNDER_REVIEW,
];

const daysAgoIso = (days, hour = 10, minute = 42) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const buildUrl = (code) => `/join/promo/${code}`;

export const buildPromoJoinAbsoluteUrl = (code) => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/join/promo/${code}`;
  }
  return `https://my12photos.com/join/promo/${code}`;
};

export const PROMO_LINKS = [
  {
    id: 'pl-0248',
    linkId: 'PL-0248',
    code: '8XK29P',
    url: buildUrl('8XK29P'),
    issuedAt: daysAgoIso(4, 10, 42),
    expiresAt: daysAgoIso(-6, 10, 42),
    status: PROMO_LINK_STATUS.ACTIVE,
    checklistDone: null,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.PAID,
  },
  {
    id: 'pl-0247',
    linkId: 'PL-0247',
    code: 'Q7M2LN',
    url: buildUrl('Q7M2LN'),
    issuedAt: daysAgoIso(12, 9, 15),
    expiresAt: daysAgoIso(2, 9, 15),
    status: PROMO_LINK_STATUS.USED,
    checklistDone: 5,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.UNDER_REVIEW,
  },
  {
    id: 'pl-0246',
    linkId: 'PL-0246',
    code: 'H4R9TX',
    url: buildUrl('H4R9TX'),
    issuedAt: daysAgoIso(18, 14, 5),
    expiresAt: daysAgoIso(8, 14, 5),
    status: PROMO_LINK_STATUS.EXPIRED,
    checklistDone: 0,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.NOT_ELIGIBLE,
  },
  {
    id: 'pl-0245',
    linkId: 'PL-0245',
    code: 'B2K8WP',
    url: buildUrl('B2K8WP'),
    issuedAt: daysAgoIso(22, 11, 30),
    expiresAt: daysAgoIso(12, 11, 30),
    status: PROMO_LINK_STATUS.USED,
    checklistDone: 9,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.PAID,
  },
  {
    id: 'pl-0244',
    linkId: 'PL-0244',
    code: 'N5V1QD',
    url: buildUrl('N5V1QD'),
    issuedAt: daysAgoIso(3, 16, 20),
    expiresAt: daysAgoIso(-7, 16, 20),
    status: PROMO_LINK_STATUS.ACTIVE,
    checklistDone: null,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.NOT_ELIGIBLE,
  },
  {
    id: 'pl-0243',
    linkId: 'PL-0243',
    code: 'F9C3ZM',
    url: buildUrl('F9C3ZM'),
    issuedAt: daysAgoIso(9, 8, 10),
    expiresAt: daysAgoIso(-1, 8, 10),
    status: PROMO_LINK_STATUS.ACTIVE,
    checklistDone: null,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.UNDER_REVIEW,
  },
  {
    id: 'pl-0242',
    linkId: 'PL-0242',
    code: 'T6J4YA',
    url: buildUrl('T6J4YA'),
    issuedAt: daysAgoIso(28, 13, 45),
    expiresAt: daysAgoIso(18, 13, 45),
    status: PROMO_LINK_STATUS.USED,
    checklistDone: 7,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.UNDER_REVIEW,
  },
  {
    id: 'pl-0241',
    linkId: 'PL-0241',
    code: 'P1L8KE',
    url: buildUrl('P1L8KE'),
    issuedAt: daysAgoIso(35, 10, 0),
    expiresAt: daysAgoIso(25, 10, 0),
    status: PROMO_LINK_STATUS.EXPIRED,
    checklistDone: 2,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.NOT_ELIGIBLE,
  },
  {
    id: 'pl-0240',
    linkId: 'PL-0240',
    code: 'W3S7UB',
    url: buildUrl('W3S7UB'),
    issuedAt: daysAgoIso(6, 17, 55),
    expiresAt: daysAgoIso(-4, 17, 55),
    status: PROMO_LINK_STATUS.ACTIVE,
    checklistDone: null,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.PAID,
  },
  {
    id: 'pl-0239',
    linkId: 'PL-0239',
    code: 'R8D2HC',
    url: buildUrl('R8D2HC'),
    issuedAt: daysAgoIso(15, 12, 12),
    expiresAt: daysAgoIso(5, 12, 12),
    status: PROMO_LINK_STATUS.USED,
    checklistDone: 9,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.PAID,
  },
  {
    id: 'pl-0238',
    linkId: 'PL-0238',
    code: 'M4G6XV',
    url: buildUrl('M4G6XV'),
    issuedAt: daysAgoIso(40, 9, 40),
    expiresAt: daysAgoIso(30, 9, 40),
    status: PROMO_LINK_STATUS.EXPIRED,
    checklistDone: 4,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.NOT_ELIGIBLE,
  },
  {
    id: 'pl-0237',
    linkId: 'PL-0237',
    code: 'K9A5OJ',
    url: buildUrl('K9A5OJ'),
    issuedAt: daysAgoIso(1, 18, 8),
    expiresAt: daysAgoIso(-9, 18, 8),
    status: PROMO_LINK_STATUS.ACTIVE,
    checklistDone: null,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.NOT_ELIGIBLE,
  },
];

let promoLinksStore = [...PROMO_LINKS];

export const getPromoLinksStore = () => promoLinksStore;

export const setPromoLinksStore = (links) => {
  promoLinksStore = [...links];
  return promoLinksStore;
};

export const getRequirementStage = (link) => {
  if (link.checklistDone == null) return PROMO_LINK_REQUIREMENT.NONE;
  if (link.checklistDone >= link.checklistTotal) return PROMO_LINK_REQUIREMENT.COMPLETED;
  return PROMO_LINK_REQUIREMENT.INCOMPLETE;
};

export const computePromoLinkStats = (links) => ({
  total: links.length,
  active: links.filter((link) => link.status === PROMO_LINK_STATUS.ACTIVE).length,
  used: links.filter((link) => link.status === PROMO_LINK_STATUS.USED).length,
  expired: links.filter((link) => link.status === PROMO_LINK_STATUS.EXPIRED).length,
  incomplete: links.filter((link) => getRequirementStage(link) === PROMO_LINK_REQUIREMENT.INCOMPLETE)
    .length,
});

const daysBetween = (fromIso, toDate = new Date()) => {
  const from = new Date(fromIso).getTime();
  const to = toDate.getTime();
  return Math.ceil((from - to) / (1000 * 60 * 60 * 24));
};

export const getValidityMeta = (link) => {
  if (link.status === PROMO_LINK_STATUS.USED) {
    return { kind: 'used', daysLeft: 0 };
  }

  const daysLeft = daysBetween(link.expiresAt);
  if (link.status === PROMO_LINK_STATUS.EXPIRED || daysLeft <= 0) {
    return { kind: 'expired', daysLeft: 0 };
  }

  return { kind: 'active', daysLeft };
};

export const formatIssuedAt = (iso) => {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const truncatePromoUrl = (url, max = 34) => {
  if (!url || url.length <= max) return url;
  return `${url.slice(0, max)}…`;
};

const matchesDateRange = (issuedAt, rangeId) => {
  if (!rangeId || rangeId === PROMO_LINK_DATE_RANGE.ALL) return true;

  const issued = new Date(issuedAt).getTime();
  const now = Date.now();
  const dayMs = 1000 * 60 * 60 * 24;
  const windows = {
    [PROMO_LINK_DATE_RANGE.LAST_7]: 7 * dayMs,
    [PROMO_LINK_DATE_RANGE.LAST_30]: 30 * dayMs,
    [PROMO_LINK_DATE_RANGE.LAST_90]: 90 * dayMs,
  };
  const windowMs = windows[rangeId];
  if (!windowMs) return true;
  return now - issued <= windowMs;
};

export const filterPromoLinks = (links, filters) => {
  const { status = 'all', dateRange = PROMO_LINK_DATE_RANGE.LAST_30, requirements = 'all', reward = 'all' } =
    filters || {};

  return links.filter((link) => {
    if (status !== 'all' && link.status !== status) return false;
    if (!matchesDateRange(link.issuedAt, dateRange)) return false;
    if (requirements !== 'all' && getRequirementStage(link) !== requirements) return false;
    if (reward !== 'all' && link.reward !== reward) return false;
    return true;
  });
};

export const paginatePromoLinks = (links, page, pageSize) => {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return links.slice(start, start + pageSize);
};

export const getPromoLinkById = (links, linkId) =>
  links.find((link) => link.id === linkId) || null;

export const updatePromoLinkReward = (links, linkId, nextReward) =>
  links.map((link) => (link.id === linkId ? { ...link, reward: nextReward } : link));

const randomCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
};

export const createPromoLink = (links) => {
  const highest = links.reduce((max, link) => {
    const n = Number(String(link.linkId).replace(/\D/g, '')) || 0;
    return Math.max(max, n);
  }, 0);
  const nextNum = highest + 1;
  const code = randomCode();
  const issuedAt = new Date().toISOString();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + PROMO_LINK_VALIDITY_DAYS);

  return {
    id: `pl-${String(nextNum).padStart(4, '0')}`,
    linkId: `PL-${String(nextNum).padStart(4, '0')}`,
    code,
    url: buildUrl(code),
    issuedAt,
    expiresAt: expiresAt.toISOString(),
    status: PROMO_LINK_STATUS.ACTIVE,
    checklistDone: null,
    checklistTotal: PROMO_LINK_CHECKLIST_TOTAL,
    reward: PROMO_LINK_REWARD.NOT_ELIGIBLE,
  };
};

export const prependPromoLink = (links, link) => [link, ...links];

export const MORE_ICON_SIZE = 20;
export const CLOSE_ICON_SIZE = 24;
