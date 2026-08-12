/** Admin Comment Management — Figma 390:2248, dropdown 2071:1495, details 390:3272. */

const A = '/assets/admin-comment';

export const ADMIN_COMMENT_ASSETS = {
  more: `${A}/icon-more.svg`,
};

export const MORE_ICON_SIZE = 20;
export const AVATAR_SIZE = 30;
export const PHOTO_THUMB_SIZE = 36;
export const DRAWER_WIDTH_PX = 480;
export const COMMENTS_PAGE_SIZE = 12;
/** Figma footer always shows pages 1–3 on the full list. */
export const COMMENTS_PAGE_CHROME = 3;

export const COMMENT_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  DELETED: 'deleted',
  HIDDEN: 'hidden',
};

export const COMMENT_TYPE = {
  SINGLE: 'single',
  ALBUM6: 'album6',
  ZODIAC: 'zodiac',
};

export const STATUS_FILTERS = [
  { id: 'all', labelKey: 'adminComment.filters.all' },
  { id: COMMENT_STATUS.APPROVED, labelKey: 'adminComment.filters.approved' },
  { id: COMMENT_STATUS.PENDING, labelKey: 'adminComment.filters.pending' },
  { id: COMMENT_STATUS.DELETED, labelKey: 'adminComment.filters.deleted' },
];

export const ACTION_MENU_OPTIONS = [
  { id: 'details', labelKey: 'adminComment.actions.seeDetails', kind: 'details' },
  { id: COMMENT_STATUS.HIDDEN, labelKey: 'adminComment.actions.hide', kind: 'status' },
  { id: COMMENT_STATUS.APPROVED, labelKey: 'adminComment.actions.approved', kind: 'status' },
  { id: COMMENT_STATUS.PENDING, labelKey: 'adminComment.actions.pending', kind: 'status' },
];

export const STATUS_LABEL_KEYS = {
  [COMMENT_STATUS.APPROVED]: 'adminComment.status.approved',
  [COMMENT_STATUS.PENDING]: 'adminComment.status.pending',
  [COMMENT_STATUS.DELETED]: 'adminComment.status.deleted',
  [COMMENT_STATUS.HIDDEN]: 'adminComment.status.hidden',
};

export const STATUS_STYLES = {
  [COMMENT_STATUS.APPROVED]: {
    bg: 'bg-[#dcfce7]',
    dot: 'bg-[#16a34a]',
    text: 'text-[#166534]',
  },
  [COMMENT_STATUS.PENDING]: {
    bg: 'bg-[#fef3c7]',
    dot: 'bg-[#d97706]',
    text: 'text-[#92400e]',
  },
  [COMMENT_STATUS.DELETED]: {
    bg: 'bg-[#fee2e2]',
    dot: 'bg-[#dc2626]',
    text: 'text-[#991b1b]',
  },
  [COMMENT_STATUS.HIDDEN]: {
    bg: 'bg-[#f3f4f6]',
    dot: 'bg-[#6b7280]',
    text: 'text-[#4b5563]',
  },
};

export const TYPE_LABEL_KEYS = {
  [COMMENT_TYPE.SINGLE]: 'adminComment.types.single',
  [COMMENT_TYPE.ALBUM6]: 'adminComment.types.album6',
  [COMMENT_TYPE.ZODIAC]: 'adminComment.types.zodiac',
};

export const TYPE_STYLES = {
  [COMMENT_TYPE.SINGLE]: { bg: 'bg-[#eff6ff]', text: 'text-[#1d4ed8]' },
  [COMMENT_TYPE.ALBUM6]: { bg: 'bg-[#f0fdf4]', text: 'text-[#15803d]' },
  [COMMENT_TYPE.ZODIAC]: { bg: 'bg-[#fdf4ff]', text: 'text-[#7e22ce]' },
};

/** Stat cards — Figma values (static chrome). */
export const COMMENT_STAT_CARDS = [
  {
    id: 'total',
    labelKey: 'adminComment.stats.total.label',
    value: '12',
    hintKey: 'adminComment.stats.total.hint',
    hintClass: 'text-[#2563eb]',
    icon: '💬',
    iconBg: 'bg-[#eff6ff]',
  },
  {
    id: 'approved',
    labelKey: 'adminComment.stats.approved.label',
    value: '6',
    hintKey: 'adminComment.stats.approved.hint',
    hintClass: 'text-[#16a34a]',
    icon: '✓',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 'pending',
    labelKey: 'adminComment.stats.pending.label',
    value: '2',
    hintKey: 'adminComment.stats.pending.hint',
    hintClass: 'text-[#d97706]',
    icon: '⏳',
    iconBg: 'bg-[#fef3c7]',
  },
  {
    id: 'hidden',
    labelKey: 'adminComment.stats.hidden.label',
    value: '1',
    hintKey: 'adminComment.stats.hidden.hint',
    hintClass: 'text-[#6b7280]',
    icon: '◉',
    iconBg: 'bg-[#f3f4f6]',
  },
];

/** Mock rows matching Figma 390:2248. */
export const ADMIN_COMMENT_ROWS = [
  {
    id: 'cmt-0001',
    code: 'CMT-0001',
    pinned: true,
    nameKey: 'adminComment.rows.cmt0001.name',
    countryKey: 'adminComment.rows.cmt0001.country',
    email: 'elena.v@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0001.photoTitle',
    categoryKey: 'adminComment.rows.cmt0001.category',
    commentKey: 'adminComment.rows.cmt0001.comment',
    type: COMMENT_TYPE.SINGLE,
    date: '2025-07-28',
    status: COMMENT_STATUS.APPROVED,
    avatar: `${A}/avatar-1.jpg`,
    photo: `${A}/photo-1.jpg`,
    followers: '1,240',
    uploads: '38',
    visits: '5,200',
  },
  {
    id: 'cmt-0002',
    code: 'CMT-0002',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0002.name',
    countryKey: 'adminComment.rows.cmt0002.country',
    email: 'marcus.c@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0002.photoTitle',
    categoryKey: 'adminComment.rows.cmt0002.category',
    commentKey: 'adminComment.rows.cmt0002.comment',
    type: COMMENT_TYPE.ALBUM6,
    date: '2025-07-28',
    status: COMMENT_STATUS.APPROVED,
    avatar: `${A}/avatar-2.jpg`,
    photo: `${A}/photo-2.jpg`,
    followers: '890',
    uploads: '24',
    visits: '3,100',
  },
  {
    id: 'cmt-0003',
    code: 'CMT-0003',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0003.name',
    countryKey: 'adminComment.rows.cmt0003.country',
    email: 'priya.s@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0003.photoTitle',
    categoryKey: 'adminComment.rows.cmt0003.category',
    commentKey: 'adminComment.rows.cmt0003.comment',
    type: COMMENT_TYPE.ZODIAC,
    date: '2025-07-28',
    status: COMMENT_STATUS.DELETED,
    avatar: `${A}/avatar-3.jpg`,
    photo: `${A}/photo-3.jpg`,
    followers: '2,010',
    uploads: '51',
    visits: '6,400',
  },
  {
    id: 'cmt-0004',
    code: 'CMT-0004',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0004.name',
    countryKey: 'adminComment.rows.cmt0004.country',
    email: 'james.o@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0004.photoTitle',
    categoryKey: 'adminComment.rows.cmt0004.category',
    commentKey: 'adminComment.rows.cmt0004.comment',
    type: COMMENT_TYPE.SINGLE,
    date: '2025-07-27',
    status: COMMENT_STATUS.PENDING,
    avatar: `${A}/avatar-4.jpg`,
    photo: `${A}/photo-4.jpg`,
    followers: '640',
    uploads: '19',
    visits: '2,250',
  },
  {
    id: 'cmt-0005',
    code: 'CMT-0005',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0005.name',
    countryKey: 'adminComment.rows.cmt0005.country',
    email: 'sofia.a@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0005.photoTitle',
    categoryKey: 'adminComment.rows.cmt0005.category',
    commentKey: 'adminComment.rows.cmt0005.comment',
    type: COMMENT_TYPE.ALBUM6,
    date: '2025-07-27',
    status: COMMENT_STATUS.DELETED,
    avatar: `${A}/avatar-5.jpg`,
    photo: `${A}/photo-5.jpg`,
    followers: '1,120',
    uploads: '33',
    visits: '4,080',
  },
  {
    id: 'cmt-0006',
    code: 'CMT-0006',
    pinned: true,
    nameKey: 'adminComment.rows.cmt0006.name',
    countryKey: 'adminComment.rows.cmt0006.country',
    email: 'yuki.t@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0006.photoTitle',
    categoryKey: 'adminComment.rows.cmt0006.category',
    commentKey: 'adminComment.rows.cmt0006.comment',
    type: COMMENT_TYPE.ZODIAC,
    date: '2025-07-27',
    status: COMMENT_STATUS.APPROVED,
    avatar: `${A}/avatar-6.jpg`,
    photo: `${A}/photo-6.jpg`,
    followers: '3,450',
    uploads: '72',
    visits: '9,800',
  },
  {
    id: 'cmt-0007',
    code: 'CMT-0007',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0007.name',
    countryKey: 'adminComment.rows.cmt0007.country',
    email: 'ahmed.a@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0007.photoTitle',
    categoryKey: 'adminComment.rows.cmt0007.category',
    commentKey: 'adminComment.rows.cmt0007.comment',
    type: COMMENT_TYPE.SINGLE,
    date: '2025-07-26',
    status: COMMENT_STATUS.HIDDEN,
    avatar: `${A}/avatar-7.jpg`,
    photo: `${A}/photo-7.jpg`,
    followers: '510',
    uploads: '14',
    visits: '1,900',
  },
  {
    id: 'cmt-0008',
    code: 'CMT-0008',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0008.name',
    countryKey: 'adminComment.rows.cmt0008.country',
    email: 'isabelle.l@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0008.photoTitle',
    categoryKey: 'adminComment.rows.cmt0008.category',
    commentKey: 'adminComment.rows.cmt0008.comment',
    type: COMMENT_TYPE.ALBUM6,
    date: '2025-07-26',
    status: COMMENT_STATUS.APPROVED,
    avatar: `${A}/avatar-8.jpg`,
    photo: `${A}/photo-8.jpg`,
    followers: '1,780',
    uploads: '41',
    visits: '5,600',
  },
  {
    id: 'cmt-0009',
    code: 'CMT-0009',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0009.name',
    countryKey: 'adminComment.rows.cmt0009.country',
    email: 'kofi.m@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0009.photoTitle',
    categoryKey: 'adminComment.rows.cmt0009.category',
    commentKey: 'adminComment.rows.cmt0009.comment',
    type: COMMENT_TYPE.SINGLE,
    date: '2025-07-25',
    status: COMMENT_STATUS.PENDING,
    avatar: `${A}/avatar-9.jpg`,
    photo: `${A}/photo-9.jpg`,
    followers: '720',
    uploads: '22',
    visits: '2,640',
  },
  {
    id: 'cmt-0010',
    code: 'CMT-0010',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0010.name',
    countryKey: 'adminComment.rows.cmt0010.country',
    email: 'natalia.p@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0010.photoTitle',
    categoryKey: 'adminComment.rows.cmt0010.category',
    commentKey: 'adminComment.rows.cmt0010.comment',
    type: COMMENT_TYPE.ZODIAC,
    date: '2025-07-25',
    status: COMMENT_STATUS.HIDDEN,
    avatar: `${A}/avatar-10.jpg`,
    photo: `${A}/photo-10.jpg`,
    followers: '980',
    uploads: '27',
    visits: '3,320',
  },
  {
    id: 'cmt-0011',
    code: 'CMT-0011',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0011.name',
    countryKey: 'adminComment.rows.cmt0011.country',
    email: 'luca.b@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0011.photoTitle',
    categoryKey: 'adminComment.rows.cmt0011.category',
    commentKey: 'adminComment.rows.cmt0011.comment',
    type: COMMENT_TYPE.ALBUM6,
    date: '2025-07-24',
    status: COMMENT_STATUS.APPROVED,
    avatar: `${A}/avatar-11.jpg`,
    photo: `${A}/photo-11.jpg`,
    followers: '2,240',
    uploads: '58',
    visits: '7,100',
  },
  {
    id: 'cmt-0012',
    code: 'CMT-0012',
    pinned: false,
    nameKey: 'adminComment.rows.cmt0012.name',
    countryKey: 'adminComment.rows.cmt0012.country',
    email: 'amara.d@mail.com',
    photoTitleKey: 'adminComment.rows.cmt0012.photoTitle',
    categoryKey: 'adminComment.rows.cmt0012.category',
    commentKey: 'adminComment.rows.cmt0012.comment',
    type: COMMENT_TYPE.SINGLE,
    date: '2025-07-23',
    status: COMMENT_STATUS.APPROVED,
    avatar: `${A}/avatar-12.jpg`,
    photo: `${A}/photo-12.jpg`,
    followers: '1,560',
    uploads: '36',
    visits: '4,900',
  },
];

/**
 * @param {typeof ADMIN_COMMENT_ROWS} rows
 * @param {string} filterId
 */
export const filterCommentsByStatus = (rows, filterId) => {
  if (!filterId || filterId === 'all') return rows;
  return rows.filter((row) => row.status === filterId);
};

/**
 * @param {typeof ADMIN_COMMENT_ROWS} rows
 * @param {number} page
 * @param {number} pageSize
 */
export const paginateComments = (rows, page, pageSize) => {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
};

/**
 * @param {typeof ADMIN_COMMENT_ROWS} rows
 * @param {string} rowId
 * @param {string} nextStatus
 */
export const updateCommentStatus = (rows, rowId, nextStatus) =>
  rows.map((row) => (row.id === rowId ? { ...row, status: nextStatus } : row));

/**
 * @param {number} page
 * @param {number} totalPages
 * @param {number} [windowSize]
 */
export const getCommentPageNumbers = (page, totalPages, windowSize = COMMENTS_PAGE_CHROME) => {
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
