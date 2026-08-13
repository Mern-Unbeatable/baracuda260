/** Admin Ads & Announcements — Figma Settings / Ads page. */

const A = '/assets/admin-payouts';

export const ADMIN_ANNOUNCEMENTS_ASSETS = {
  more: `${A}/icon-more.svg`,
};

export const MORE_ICON_SIZE = 20;
export const ANNOUNCEMENTS_PAGE_SIZE = 10;
export const ANNOUNCEMENTS_PAGE_CHROME = 3;

export const ANNOUNCEMENT_STATUS = {
  ACTIVE: 'active',
  SCHEDULED: 'scheduled',
  EXPIRED: 'expired',
  INACTIVE: 'inactive',
};

export const ANNOUNCEMENT_TYPE = {
  WINNER: 'winner',
  COMPETITION: 'competition',
  PROMOTION: 'promotion',
  GENERAL: 'general',
  IMPORTANT: 'important',
};

export const ANNOUNCEMENT_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const STATUS_LABEL_KEYS = {
  [ANNOUNCEMENT_STATUS.ACTIVE]: 'adminAnnouncements.status.active',
  [ANNOUNCEMENT_STATUS.SCHEDULED]: 'adminAnnouncements.status.scheduled',
  [ANNOUNCEMENT_STATUS.EXPIRED]: 'adminAnnouncements.status.expired',
  [ANNOUNCEMENT_STATUS.INACTIVE]: 'adminAnnouncements.status.inactive',
};

export const STATUS_STYLES = {
  [ANNOUNCEMENT_STATUS.ACTIVE]: {
    bg: 'bg-[#ecfdf3]',
    text: 'text-[#16a34a]',
    icon: 'dot',
  },
  [ANNOUNCEMENT_STATUS.SCHEDULED]: {
    bg: 'bg-[#eff6ff]',
    text: 'text-[#2563eb]',
    icon: 'clock',
  },
  [ANNOUNCEMENT_STATUS.EXPIRED]: {
    bg: 'bg-[#f3f4f6]',
    text: 'text-[#6b7280]',
    icon: 'x',
  },
  [ANNOUNCEMENT_STATUS.INACTIVE]: {
    bg: 'bg-[#fefce8]',
    text: 'text-[#ca8a04]',
    icon: 'square',
  },
};

export const TYPE_LABEL_KEYS = {
  [ANNOUNCEMENT_TYPE.WINNER]: 'adminAnnouncements.types.winner',
  [ANNOUNCEMENT_TYPE.COMPETITION]: 'adminAnnouncements.types.competition',
  [ANNOUNCEMENT_TYPE.PROMOTION]: 'adminAnnouncements.types.promotion',
  [ANNOUNCEMENT_TYPE.GENERAL]: 'adminAnnouncements.types.general',
  [ANNOUNCEMENT_TYPE.IMPORTANT]: 'adminAnnouncements.types.important',
};

export const TYPE_STYLES = {
  [ANNOUNCEMENT_TYPE.WINNER]: { bg: 'bg-[#fff7ed]', text: 'text-[#c2410c]' },
  [ANNOUNCEMENT_TYPE.COMPETITION]: { bg: 'bg-[#f5f3ff]', text: 'text-[#7c3aed]' },
  [ANNOUNCEMENT_TYPE.PROMOTION]: { bg: 'bg-[#fdf2f8]', text: 'text-[#db2777]' },
  [ANNOUNCEMENT_TYPE.GENERAL]: { bg: 'bg-[#eff6ff]', text: 'text-[#2563eb]' },
  [ANNOUNCEMENT_TYPE.IMPORTANT]: { bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]' },
};

export const PRIORITY_LABEL_KEYS = {
  [ANNOUNCEMENT_PRIORITY.HIGH]: 'adminAnnouncements.priority.high',
  [ANNOUNCEMENT_PRIORITY.MEDIUM]: 'adminAnnouncements.priority.medium',
  [ANNOUNCEMENT_PRIORITY.LOW]: 'adminAnnouncements.priority.low',
};

export const PRIORITY_DOT_STYLES = {
  [ANNOUNCEMENT_PRIORITY.HIGH]: ['bg-[#ef4444]', 'bg-[#ef4444]', 'bg-[#ef4444]'],
  [ANNOUNCEMENT_PRIORITY.MEDIUM]: ['bg-[#f97316]', 'bg-[#f97316]', 'bg-transparent border border-[#d1d5db]'],
  [ANNOUNCEMENT_PRIORITY.LOW]: ['bg-[#d1d5db]', 'bg-transparent border border-[#d1d5db]', 'bg-transparent border border-[#d1d5db]'],
};

export const ANNOUNCEMENT_STAT_CARDS = [
  {
    id: 'total',
    labelKey: 'adminAnnouncements.stats.total.label',
    value: '24',
    hintKey: 'adminAnnouncements.stats.total.hint',
    hintClass: 'text-[#6b7280]',
    icon: '▢',
    iconBg: 'bg-[#f3f4f6] text-[#6b7280]',
  },
  {
    id: 'active',
    labelKey: 'adminAnnouncements.stats.active.label',
    value: '2',
    hintKey: 'adminAnnouncements.stats.active.hint',
    hintClass: 'text-[#16a34a]',
    icon: '●',
    iconBg: 'bg-[#ecfdf3] text-[#16a34a]',
  },
  {
    id: 'scheduled',
    labelKey: 'adminAnnouncements.stats.scheduled.label',
    value: '2',
    hintKey: 'adminAnnouncements.stats.scheduled.hint',
    hintClass: 'text-[#2563eb]',
    icon: '◷',
    iconBg: 'bg-[#eff6ff] text-[#2563eb]',
  },
  {
    id: 'expired',
    labelKey: 'adminAnnouncements.stats.expired.label',
    value: '19',
    hintKey: 'adminAnnouncements.stats.expired.hint',
    hintClass: 'text-[#6b7280]',
    icon: '✕',
    iconBg: 'bg-[#f3f4f6] text-[#6b7280]',
  },
];

export const ACTION_MENU_OPTIONS = [
  { id: 'edit', labelKey: 'adminAnnouncements.actions.edit' },
  { id: ANNOUNCEMENT_STATUS.ACTIVE, labelKey: 'adminAnnouncements.actions.setActive' },
  { id: ANNOUNCEMENT_STATUS.INACTIVE, labelKey: 'adminAnnouncements.actions.setInactive' },
  { id: 'delete', labelKey: 'adminAnnouncements.actions.delete' },
];

const buildRow = (id, code, emoji, titleKey, type, startKey, endKey, priority, status) => ({
  id,
  code,
  emoji,
  titleKey,
  type,
  startKey,
  endKey,
  priority,
  status,
});

export const ADMIN_ANNOUNCEMENT_ROWS = [
  buildRow(
    'ann-1024',
    'ANN-1024',
    '🥳',
    'adminAnnouncements.rows.mayWinners.title',
    ANNOUNCEMENT_TYPE.WINNER,
    'adminAnnouncements.rows.mayWinners.start',
    'adminAnnouncements.rows.mayWinners.end',
    ANNOUNCEMENT_PRIORITY.HIGH,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1025',
    'ANN-1025',
    '🚩',
    'adminAnnouncements.rows.juneCompetition.title',
    ANNOUNCEMENT_TYPE.COMPETITION,
    'adminAnnouncements.rows.juneCompetition.start',
    'adminAnnouncements.rows.juneCompetition.end',
    ANNOUNCEMENT_PRIORITY.MEDIUM,
    ANNOUNCEMENT_STATUS.ACTIVE,
  ),
  buildRow(
    'ann-1026',
    'ANN-1026',
    '🏆',
    'adminAnnouncements.rows.prizePool.title',
    ANNOUNCEMENT_TYPE.PROMOTION,
    'adminAnnouncements.rows.prizePool.start',
    'adminAnnouncements.rows.prizePool.end',
    ANNOUNCEMENT_PRIORITY.LOW,
    ANNOUNCEMENT_STATUS.SCHEDULED,
  ),
  buildRow(
    'ann-1027',
    'ANN-1027',
    '📢',
    'adminAnnouncements.rows.maintenance.title',
    ANNOUNCEMENT_TYPE.GENERAL,
    'adminAnnouncements.rows.maintenance.start',
    'adminAnnouncements.rows.maintenance.end',
    ANNOUNCEMENT_PRIORITY.MEDIUM,
    ANNOUNCEMENT_STATUS.INACTIVE,
  ),
  buildRow(
    'ann-1028',
    'ANN-1028',
    '📢',
    'adminAnnouncements.rows.deadline.title',
    ANNOUNCEMENT_TYPE.IMPORTANT,
    'adminAnnouncements.rows.deadline.start',
    'adminAnnouncements.rows.deadline.end',
    ANNOUNCEMENT_PRIORITY.HIGH,
    ANNOUNCEMENT_STATUS.ACTIVE,
  ),
  buildRow(
    'ann-1029',
    'ANN-1029',
    '📸',
    'adminAnnouncements.rows.summerGallery.title',
    ANNOUNCEMENT_TYPE.GENERAL,
    'adminAnnouncements.rows.summerGallery.start',
    'adminAnnouncements.rows.summerGallery.end',
    ANNOUNCEMENT_PRIORITY.LOW,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1030',
    'ANN-1030',
    '🏅',
    'adminAnnouncements.rows.aprilWinners.title',
    ANNOUNCEMENT_TYPE.WINNER,
    'adminAnnouncements.rows.aprilWinners.start',
    'adminAnnouncements.rows.aprilWinners.end',
    ANNOUNCEMENT_PRIORITY.HIGH,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1031',
    'ANN-1031',
    '🎯',
    'adminAnnouncements.rows.julyCompetition.title',
    ANNOUNCEMENT_TYPE.COMPETITION,
    'adminAnnouncements.rows.julyCompetition.start',
    'adminAnnouncements.rows.julyCompetition.end',
    ANNOUNCEMENT_PRIORITY.MEDIUM,
    ANNOUNCEMENT_STATUS.SCHEDULED,
  ),
  buildRow(
    'ann-1032',
    'ANN-1032',
    '💎',
    'adminAnnouncements.rows.premiumLaunch.title',
    ANNOUNCEMENT_TYPE.PROMOTION,
    'adminAnnouncements.rows.premiumLaunch.start',
    'adminAnnouncements.rows.premiumLaunch.end',
    ANNOUNCEMENT_PRIORITY.MEDIUM,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1033',
    'ANN-1033',
    '🔔',
    'adminAnnouncements.rows.newsletter.title',
    ANNOUNCEMENT_TYPE.GENERAL,
    'adminAnnouncements.rows.newsletter.start',
    'adminAnnouncements.rows.newsletter.end',
    ANNOUNCEMENT_PRIORITY.LOW,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1034',
    'ANN-1034',
    '⚠️',
    'adminAnnouncements.rows.policyUpdate.title',
    ANNOUNCEMENT_TYPE.IMPORTANT,
    'adminAnnouncements.rows.policyUpdate.start',
    'adminAnnouncements.rows.policyUpdate.end',
    ANNOUNCEMENT_PRIORITY.HIGH,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1035',
    'ANN-1035',
    '🌅',
    'adminAnnouncements.rows.goldenHour.title',
    ANNOUNCEMENT_TYPE.COMPETITION,
    'adminAnnouncements.rows.goldenHour.start',
    'adminAnnouncements.rows.goldenHour.end',
    ANNOUNCEMENT_PRIORITY.MEDIUM,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1036',
    'ANN-1036',
    '🎁',
    'adminAnnouncements.rows.referral.title',
    ANNOUNCEMENT_TYPE.PROMOTION,
    'adminAnnouncements.rows.referral.start',
    'adminAnnouncements.rows.referral.end',
    ANNOUNCEMENT_PRIORITY.LOW,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1037',
    'ANN-1037',
    '📅',
    'adminAnnouncements.rows.calendar.title',
    ANNOUNCEMENT_TYPE.GENERAL,
    'adminAnnouncements.rows.calendar.start',
    'adminAnnouncements.rows.calendar.end',
    ANNOUNCEMENT_PRIORITY.LOW,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1038',
    'ANN-1038',
    '🏆',
    'adminAnnouncements.rows.marchWinners.title',
    ANNOUNCEMENT_TYPE.WINNER,
    'adminAnnouncements.rows.marchWinners.start',
    'adminAnnouncements.rows.marchWinners.end',
    ANNOUNCEMENT_PRIORITY.HIGH,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1039',
    'ANN-1039',
    '🚀',
    'adminAnnouncements.rows.featureLaunch.title',
    ANNOUNCEMENT_TYPE.PROMOTION,
    'adminAnnouncements.rows.featureLaunch.start',
    'adminAnnouncements.rows.featureLaunch.end',
    ANNOUNCEMENT_PRIORITY.MEDIUM,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1040',
    'ANN-1040',
    '📢',
    'adminAnnouncements.rows.community.title',
    ANNOUNCEMENT_TYPE.GENERAL,
    'adminAnnouncements.rows.community.start',
    'adminAnnouncements.rows.community.end',
    ANNOUNCEMENT_PRIORITY.LOW,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1041',
    'ANN-1041',
    '⏰',
    'adminAnnouncements.rows.votingReminder.title',
    ANNOUNCEMENT_TYPE.IMPORTANT,
    'adminAnnouncements.rows.votingReminder.start',
    'adminAnnouncements.rows.votingReminder.end',
    ANNOUNCEMENT_PRIORITY.HIGH,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1042',
    'ANN-1042',
    '🌊',
    'adminAnnouncements.rows.seascape.title',
    ANNOUNCEMENT_TYPE.COMPETITION,
    'adminAnnouncements.rows.seascape.start',
    'adminAnnouncements.rows.seascape.end',
    ANNOUNCEMENT_PRIORITY.MEDIUM,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1043',
    'ANN-1043',
    '✨',
    'adminAnnouncements.rows.spotlight.title',
    ANNOUNCEMENT_TYPE.PROMOTION,
    'adminAnnouncements.rows.spotlight.start',
    'adminAnnouncements.rows.spotlight.end',
    ANNOUNCEMENT_PRIORITY.LOW,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1044',
    'ANN-1044',
    '📝',
    'adminAnnouncements.rows.submissionTips.title',
    ANNOUNCEMENT_TYPE.GENERAL,
    'adminAnnouncements.rows.submissionTips.start',
    'adminAnnouncements.rows.submissionTips.end',
    ANNOUNCEMENT_PRIORITY.LOW,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1045',
    'ANN-1045',
    '🎉',
    'adminAnnouncements.rows.anniversary.title',
    ANNOUNCEMENT_TYPE.WINNER,
    'adminAnnouncements.rows.anniversary.start',
    'adminAnnouncements.rows.anniversary.end',
    ANNOUNCEMENT_PRIORITY.HIGH,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1046',
    'ANN-1046',
    '🛠️',
    'adminAnnouncements.rows.tools.title',
    ANNOUNCEMENT_TYPE.GENERAL,
    'adminAnnouncements.rows.tools.start',
    'adminAnnouncements.rows.tools.end',
    ANNOUNCEMENT_PRIORITY.MEDIUM,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
  buildRow(
    'ann-1047',
    'ANN-1047',
    '🔥',
    'adminAnnouncements.rows.flashSale.title',
    ANNOUNCEMENT_TYPE.PROMOTION,
    'adminAnnouncements.rows.flashSale.start',
    'adminAnnouncements.rows.flashSale.end',
    ANNOUNCEMENT_PRIORITY.HIGH,
    ANNOUNCEMENT_STATUS.EXPIRED,
  ),
];

export const paginateAnnouncements = (rows, page, pageSize) => {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
};

export const getAnnouncementPageNumbers = (page, totalPages, windowSize = ANNOUNCEMENTS_PAGE_CHROME) => {
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

export const updateAnnouncementStatus = (rows, rowId, nextStatus) =>
  rows.map((row) => (row.id === rowId ? { ...row, status: nextStatus } : row));

export const ANNOUNCEMENT_MESSAGE_MAX = 120;

export const ANNOUNCEMENT_EMOJI_OPTIONS = [
  '🎉',
  '🏆',
  '📅',
  '🚩',
  '📷',
  '🔥',
  '💰',
  '⭐',
  '📢',
  '🎯',
  '🌟',
  '🎁',
];

export const ANNOUNCEMENT_TYPE_OPTIONS = [
  { id: ANNOUNCEMENT_TYPE.GENERAL, labelKey: 'adminAnnouncements.types.general' },
  { id: ANNOUNCEMENT_TYPE.WINNER, labelKey: 'adminAnnouncements.types.winner' },
  { id: ANNOUNCEMENT_TYPE.COMPETITION, labelKey: 'adminAnnouncements.types.competition' },
  { id: ANNOUNCEMENT_TYPE.PROMOTION, labelKey: 'adminAnnouncements.types.promotion' },
  { id: ANNOUNCEMENT_TYPE.IMPORTANT, labelKey: 'adminAnnouncements.types.important' },
];

export const ANNOUNCEMENT_LINK_OPTIONS = [
  { id: 'none', labelKey: 'adminAnnouncements.modal.links.none' },
  { id: 'competitions', labelKey: 'adminAnnouncements.modal.links.competitions' },
  { id: 'gallery', labelKey: 'adminAnnouncements.modal.links.gallery' },
  { id: 'winners', labelKey: 'adminAnnouncements.modal.links.winners' },
];

export const ANNOUNCEMENT_PRIORITY_OPTIONS = [
  { id: ANNOUNCEMENT_PRIORITY.HIGH, labelKey: 'adminAnnouncements.priority.high' },
  { id: ANNOUNCEMENT_PRIORITY.MEDIUM, labelKey: 'adminAnnouncements.priority.medium' },
  { id: ANNOUNCEMENT_PRIORITY.LOW, labelKey: 'adminAnnouncements.priority.low' },
];

export const EMPTY_ANNOUNCEMENT_FORM = {
  message: '',
  emoji: '🎉',
  type: ANNOUNCEMENT_TYPE.GENERAL,
  link: 'none',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  noEndDate: false,
  status: ANNOUNCEMENT_STATUS.ACTIVE,
  priority: ANNOUNCEMENT_PRIORITY.MEDIUM,
};

export const getAnnouncementTitle = (row, t) =>
  row.title ?? (row.titleKey ? t(row.titleKey) : '');

export const getAnnouncementScheduleStart = (row, t) =>
  row.startLabel ?? (row.startKey ? t(row.startKey) : '');

export const getAnnouncementScheduleEnd = (row, t) =>
  row.endLabel ?? (row.endKey ? t(row.endKey) : '');

export const isRequiredTextValid = (value) => Boolean(String(value || '').trim());

export const isAnnouncementMessageValid = (value) => {
  const text = String(value || '').trim();
  return text.length > 0 && text.length <= ANNOUNCEMENT_MESSAGE_MAX;
};

export const isAnnouncementFormValid = (values) => {
  if (!isAnnouncementMessageValid(values.message)) return false;
  if (!isRequiredTextValid(values.startDate)) return false;
  if (!values.noEndDate && !isRequiredTextValid(values.endDate)) return false;
  return true;
};

const formatDisplayDate = (dateValue, timeValue) => {
  if (!dateValue) return '';
  const date = new Date(`${dateValue}T${timeValue || '00:00'}`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getNextAnnouncementCode = (rows) => {
  const maxCode = rows.reduce((max, row) => {
    const match = String(row.code || '').match(/ANN-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1023);
  return `ANN-${maxCode + 1}`;
};

export const buildAnnouncementFromForm = (values, rows) => {
  const startLabel = formatDisplayDate(values.startDate, values.startTime);
  const endLabel = values.noEndDate
    ? undefined
    : formatDisplayDate(values.endDate, values.endTime);
  const endKey = values.noEndDate ? 'adminAnnouncements.schedule.manual' : undefined;

  return {
    id: `ann-${Date.now()}`,
    code: getNextAnnouncementCode(rows),
    emoji: values.emoji || '📢',
    title: values.message.trim(),
    type: values.type,
    link: values.link,
    startLabel,
    ...(endKey ? { endKey } : { endLabel }),
    priority: values.priority,
    status:
      values.status === ANNOUNCEMENT_STATUS.INACTIVE
        ? ANNOUNCEMENT_STATUS.INACTIVE
        : ANNOUNCEMENT_STATUS.ACTIVE,
  };
};
