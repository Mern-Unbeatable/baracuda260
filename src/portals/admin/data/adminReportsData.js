/** Admin Reports & Moderation — list, detail, and audit history. */

import { RED_SLOTS } from '@/portals/member/data/zodiac12Assets';

const THUMBS = [
  '/assets/admin-competition-detail/thumb-1.jpg',
  '/assets/admin-competition-detail/thumb-2.jpg',
  '/assets/admin-competition-detail/thumb-3.jpg',
  '/assets/admin-competition-detail/thumb-4.jpg',
  '/assets/admin-competition-detail/thumb-5.jpg',
  '/assets/admin-competition-detail/thumb-6.jpg',
];

export const REPORTS_PAGE_SIZE = 12;
export const MORE_ICON_SIZE = 20;

export const REPORT_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'underReview',
  RESOLVED: 'resolved',
};

export const REPORT_TYPE = {
  SINGLE: 'single',
  ALBUM6: 'album6',
  ZODIAC: 'zodiac',
};

export const REPORT_REASON = {
  COPYRIGHT: 'copyright',
  HARMFUL: 'harmful',
  STOLEN: 'stolen',
};

export const STATUS_FILTERS = [
  { id: 'all', labelKey: 'adminReports.filters.all' },
  { id: REPORT_STATUS.PENDING, labelKey: 'adminReports.filters.pending' },
  { id: REPORT_STATUS.UNDER_REVIEW, labelKey: 'adminReports.filters.underReview' },
  { id: REPORT_STATUS.RESOLVED, labelKey: 'adminReports.filters.resolved' },
];

export const STATUS_LABEL_KEYS = {
  [REPORT_STATUS.PENDING]: 'adminReports.status.pending',
  [REPORT_STATUS.UNDER_REVIEW]: 'adminReports.status.underReview',
  [REPORT_STATUS.RESOLVED]: 'adminReports.status.resolved',
};

export const STATUS_STYLES = {
  [REPORT_STATUS.PENDING]: {
    bg: 'bg-[#fef3c7]',
    dot: 'bg-[#d97706]',
    text: 'text-[#92400e]',
  },
  [REPORT_STATUS.UNDER_REVIEW]: {
    bg: 'bg-[#dbeafe]',
    dot: 'bg-[#2563eb]',
    text: 'text-[#1e40af]',
  },
  [REPORT_STATUS.RESOLVED]: {
    bg: 'bg-[#dcfce7]',
    dot: 'bg-[#16a34a]',
    text: 'text-[#166534]',
  },
};

export const TYPE_LABEL_KEYS = {
  [REPORT_TYPE.SINGLE]: 'adminReports.types.single',
  [REPORT_TYPE.ALBUM6]: 'adminReports.types.album6',
  [REPORT_TYPE.ZODIAC]: 'adminReports.types.zodiac',
};

export const REASON_LABEL_KEYS = {
  [REPORT_REASON.COPYRIGHT]: 'adminReports.reasons.copyright',
  [REPORT_REASON.HARMFUL]: 'adminReports.reasons.harmful',
  [REPORT_REASON.STOLEN]: 'adminReports.reasons.stolen',
};

export const ACTION_MENU_OPTIONS = [
  { id: 'view', labelKey: 'adminReports.actions.viewReport', kind: 'navigate' },
  { id: REPORT_STATUS.RESOLVED, labelKey: 'adminReports.actions.markResolved', kind: 'status' },
  { id: REPORT_STATUS.UNDER_REVIEW, labelKey: 'adminReports.actions.markUnderReview', kind: 'status' },
];

export const REPORT_STAT_CARDS = [
  {
    id: 'total',
    labelKey: 'adminReports.stats.total.label',
    hintKey: 'adminReports.stats.total.hint',
    icon: '🛡️',
    iconBg: 'bg-[#eff6ff]',
    border: 'border-[#bfdbfe]',
    valueClass: 'text-[#2563eb]',
  },
  {
    id: 'pending',
    labelKey: 'adminReports.stats.pending.label',
    hintKey: 'adminReports.stats.pending.hint',
    icon: '⏳',
    iconBg: 'bg-[#fef3c7]',
    border: 'border-[#fde68a]',
    valueClass: 'text-[#d97706]',
  },
  {
    id: 'underReview',
    labelKey: 'adminReports.stats.underReview.label',
    hintKey: 'adminReports.stats.underReview.hint',
    icon: '🔍',
    iconBg: 'bg-[#dbeafe]',
    border: 'border-[#93c5fd]',
    valueClass: 'text-[#2563eb]',
  },
  {
    id: 'resolved',
    labelKey: 'adminReports.stats.resolved.label',
    hintKey: 'adminReports.stats.resolved.hint',
    icon: '✓',
    iconBg: 'bg-[#dcfce7]',
    border: 'border-[#86efac]',
    valueClass: 'text-[#16a34a]',
  },
];

const buildSixSlides = () =>
  RED_SLOTS.slice(0, 6).map((slot, index) => ({
    id: slot.id,
    number: slot.number,
    sign: slot.id.charAt(0).toUpperCase() + slot.id.slice(1),
    icon: slot.icon,
    thumb: THUMBS[index],
  }));

export const SIX_STORY_SLIDES = buildSixSlides();

export const SHARED_MEDIA = {
  hero: '/assets/competition-details/hero.jpg',
  preview: '/assets/admin-competitions/morning.jpg',
  titleKey: 'adminReports.detail.mediaTitle',
  descriptionKey: 'adminReports.detail.mediaDescription',
  credit: 'Wong Kar-Wai',
  creativeNumber: '1234567890',
  resolution: '1200x800',
  quality: '4K',
  format: 'JPEG',
  fileSize: '128 KB',
  uploadDate: '01 June, 2024',
  categories: ['Stock Photos', 'Flower'],
  votes: '2150',
  views: '12400',
};

export const MODERATION_HISTORY = {
  nameKey: 'adminReports.people.victor.name',
  locationKey: 'adminReports.people.victor.location',
  email: 'vvance@biotechsurplus.com',
  memberSince: 'Jan 14, 2025',
  avatar: '/assets/competition-details/avatar-3.jpg',
  recentReportsLabelKey: 'adminReports.history.recentReports',
  stats: {
    totalReports: 7,
    warnings: 2,
    suspensions: 0,
    bans: 0,
  },
  cases: [
    {
      id: 'case-1',
      code: 'REP-1024',
      typeKey: 'adminReports.history.caseTypes.fraud',
      previewKey: 'adminReports.history.cases.case1',
      date: 'Aug 16, 2026 10:32 AM',
    },
    {
      id: 'case-2',
      code: 'REP-1023',
      typeKey: 'adminReports.history.caseTypes.harassment',
      previewKey: 'adminReports.history.cases.case2',
      date: 'Aug 16, 2026 10:32 AM',
    },
    {
      id: 'case-3',
      code: 'REP-1022',
      typeKey: 'adminReports.history.caseTypes.copyright',
      previewKey: 'adminReports.history.cases.case3',
      date: 'Aug 16, 2026 10:32 AM',
    },
    {
      id: 'case-4',
      code: 'REP-1021',
      typeKey: 'adminReports.history.caseTypes.harassment',
      previewKey: 'adminReports.history.cases.case4',
      date: 'Aug 16, 2026 10:32 AM',
    },
  ],
};

export const ADMIN_REPORTS_ROWS = [
  {
    id: 'rep-1',
    code: 'REP-1024',
    reportedByKey: 'adminReports.people.albert',
    reportedItemKey: 'adminReports.items.morningLight',
    type: REPORT_TYPE.SINGLE,
    reason: REPORT_REASON.COPYRIGHT,
    reportedUserKey: 'adminReports.people.victor.name',
    reportedUserReportCount: 5,
    reportedDate: '05/01/2026',
    status: REPORT_STATUS.RESOLVED,
    reasonCommentKey: 'adminReports.detail.reasonComment',
    reporter: {
      nameKey: 'adminReports.people.claire.name',
      roleKey: 'adminReports.people.claire.role',
      locationKey: 'adminReports.people.claire.location',
      avatar: '/assets/competition-details/avatar-1.jpg',
    },
    reportedUser: {
      nameKey: 'adminReports.people.victor.name',
      roleKey: 'adminReports.people.victor.role',
      locationKey: 'adminReports.people.victor.location',
      avatar: '/assets/competition-details/avatar-3.jpg',
      reportCount: 1,
      warnings: 0,
    },
    media: { ...SHARED_MEDIA, slides: SIX_STORY_SLIDES, albumLabelKey: 'adminReports.detail.sixPhotos' },
  },
  {
    id: 'rep-2',
    code: 'REP-1023',
    reportedByKey: 'adminReports.people.marvin',
    reportedItemKey: 'adminReports.items.neonStream',
    type: REPORT_TYPE.ALBUM6,
    reason: REPORT_REASON.HARMFUL,
    reportedUserKey: 'adminReports.people.victor.name',
    reportedUserReportCount: 5,
    reportedDate: '05/01/2026',
    status: REPORT_STATUS.PENDING,
    reasonCommentKey: 'adminReports.detail.reasonCommentHarmful',
    reporter: {
      nameKey: 'adminReports.people.marvin',
      roleKey: 'adminReports.people.marvinRole',
      locationKey: 'adminReports.people.marvinLocation',
      avatar: '/assets/competition-details/avatar-2.jpg',
    },
    reportedUser: {
      nameKey: 'adminReports.people.victor.name',
      roleKey: 'adminReports.people.victor.role',
      locationKey: 'adminReports.people.victor.location',
      avatar: '/assets/competition-details/avatar-3.jpg',
      reportCount: 1,
      warnings: 0,
    },
    media: { ...SHARED_MEDIA, slides: SIX_STORY_SLIDES, albumLabelKey: 'adminReports.detail.sixPhotos' },
  },
  {
    id: 'rep-3',
    code: 'REP-1022',
    reportedByKey: 'adminReports.people.ronald',
    reportedItemKey: 'adminReports.items.neonStream',
    type: REPORT_TYPE.ZODIAC,
    reason: REPORT_REASON.STOLEN,
    reportedUserKey: 'adminReports.people.victor.name',
    reportedUserReportCount: 5,
    reportedDate: '05/01/2026',
    status: REPORT_STATUS.UNDER_REVIEW,
    reasonCommentKey: 'adminReports.detail.reasonCommentStolen',
    reporter: {
      nameKey: 'adminReports.people.ronald',
      roleKey: 'adminReports.people.ronaldRole',
      locationKey: 'adminReports.people.ronaldLocation',
      avatar: '/assets/competition-details/avatar-4.jpg',
    },
    reportedUser: {
      nameKey: 'adminReports.people.victor.name',
      roleKey: 'adminReports.people.victor.role',
      locationKey: 'adminReports.people.victor.location',
      avatar: '/assets/competition-details/avatar-3.jpg',
      reportCount: 1,
      warnings: 0,
    },
    media: {
      ...SHARED_MEDIA,
      slides: SIX_STORY_SLIDES,
      albumLabelKey: 'adminReports.detail.zodiacStory',
    },
  },
  {
    id: 'rep-4',
    code: 'REP-1021',
    reportedByKey: 'adminReports.people.albert',
    reportedItemKey: 'adminReports.items.morningLight',
    type: REPORT_TYPE.SINGLE,
    reason: REPORT_REASON.COPYRIGHT,
    reportedUserKey: 'adminReports.people.victor.name',
    reportedUserReportCount: 5,
    reportedDate: '04/01/2026',
    status: REPORT_STATUS.PENDING,
    reasonCommentKey: 'adminReports.detail.reasonComment',
    reporter: {
      nameKey: 'adminReports.people.albert',
      roleKey: 'adminReports.people.albertRole',
      locationKey: 'adminReports.people.albertLocation',
      avatar: '/assets/competition-details/avatar-5.jpg',
    },
    reportedUser: {
      nameKey: 'adminReports.people.victor.name',
      roleKey: 'adminReports.people.victor.role',
      locationKey: 'adminReports.people.victor.location',
      avatar: '/assets/competition-details/avatar-3.jpg',
      reportCount: 1,
      warnings: 0,
    },
    media: { ...SHARED_MEDIA, slides: SIX_STORY_SLIDES, albumLabelKey: 'adminReports.detail.singlePhoto' },
  },
  {
    id: 'rep-5',
    code: 'REP-1020',
    reportedByKey: 'adminReports.people.marvin',
    reportedItemKey: 'adminReports.items.neonStream',
    type: REPORT_TYPE.ALBUM6,
    reason: REPORT_REASON.HARMFUL,
    reportedUserKey: 'adminReports.people.victor.name',
    reportedUserReportCount: 5,
    reportedDate: '03/01/2026',
    status: REPORT_STATUS.UNDER_REVIEW,
    reasonCommentKey: 'adminReports.detail.reasonCommentHarmful',
    reporter: {
      nameKey: 'adminReports.people.marvin',
      roleKey: 'adminReports.people.marvinRole',
      locationKey: 'adminReports.people.marvinLocation',
      avatar: '/assets/competition-details/avatar-2.jpg',
    },
    reportedUser: {
      nameKey: 'adminReports.people.victor.name',
      roleKey: 'adminReports.people.victor.role',
      locationKey: 'adminReports.people.victor.location',
      avatar: '/assets/competition-details/avatar-3.jpg',
      reportCount: 1,
      warnings: 0,
    },
    media: { ...SHARED_MEDIA, slides: SIX_STORY_SLIDES, albumLabelKey: 'adminReports.detail.sixPhotos' },
  },
  {
    id: 'rep-6',
    code: 'REP-1019',
    reportedByKey: 'adminReports.people.ronald',
    reportedItemKey: 'adminReports.items.morningLight',
    type: REPORT_TYPE.SINGLE,
    reason: REPORT_REASON.STOLEN,
    reportedUserKey: 'adminReports.people.victor.name',
    reportedUserReportCount: 5,
    reportedDate: '02/01/2026',
    status: REPORT_STATUS.PENDING,
    reasonCommentKey: 'adminReports.detail.reasonCommentStolen',
    reporter: {
      nameKey: 'adminReports.people.ronald',
      roleKey: 'adminReports.people.ronaldRole',
      locationKey: 'adminReports.people.ronaldLocation',
      avatar: '/assets/competition-details/avatar-4.jpg',
    },
    reportedUser: {
      nameKey: 'adminReports.people.victor.name',
      roleKey: 'adminReports.people.victor.role',
      locationKey: 'adminReports.people.victor.location',
      avatar: '/assets/competition-details/avatar-3.jpg',
      reportCount: 1,
      warnings: 0,
    },
    media: { ...SHARED_MEDIA, slides: SIX_STORY_SLIDES, albumLabelKey: 'adminReports.detail.singlePhoto' },
  },
  {
    id: 'rep-7',
    code: 'REP-1018',
    reportedByKey: 'adminReports.people.albert',
    reportedItemKey: 'adminReports.items.neonStream',
    type: REPORT_TYPE.ZODIAC,
    reason: REPORT_REASON.COPYRIGHT,
    reportedUserKey: 'adminReports.people.victor.name',
    reportedUserReportCount: 5,
    reportedDate: '01/01/2026',
    status: REPORT_STATUS.PENDING,
    reasonCommentKey: 'adminReports.detail.reasonComment',
    reporter: {
      nameKey: 'adminReports.people.albert',
      roleKey: 'adminReports.people.albertRole',
      locationKey: 'adminReports.people.albertLocation',
      avatar: '/assets/competition-details/avatar-5.jpg',
    },
    reportedUser: {
      nameKey: 'adminReports.people.victor.name',
      roleKey: 'adminReports.people.victor.role',
      locationKey: 'adminReports.people.victor.location',
      avatar: '/assets/competition-details/avatar-3.jpg',
      reportCount: 1,
      warnings: 0,
    },
    media: {
      ...SHARED_MEDIA,
      slides: SIX_STORY_SLIDES,
      albumLabelKey: 'adminReports.detail.zodiacStory',
    },
  },
];

export const computeReportStats = (rows) => ({
  total: rows.length,
  pending: rows.filter((row) => row.status === REPORT_STATUS.PENDING).length,
  underReview: rows.filter((row) => row.status === REPORT_STATUS.UNDER_REVIEW).length,
  resolved: rows.filter((row) => row.status === REPORT_STATUS.RESOLVED).length,
});

export const filterReportsByStatus = (rows, filterId) => {
  if (!filterId || filterId === 'all') return rows;
  return rows.filter((row) => row.status === filterId);
};

export const paginateReports = (rows, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
};

export const updateReportStatus = (rows, rowId, nextStatus) =>
  rows.map((row) => (row.id === rowId ? { ...row, status: nextStatus } : row));

export const getReportById = (rows, reportId) => rows.find((row) => row.id === reportId) || null;
