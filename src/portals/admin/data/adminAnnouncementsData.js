/** Admin Ads & Announcements — Figma Settings / Ads page. */

const A = '/assets/admin-payouts';

export const ADMIN_ANNOUNCEMENTS_ASSETS = {
  more: `${A}/icon-more.svg`,
};

export const MORE_ICON_SIZE = 20;
export const ANNOUNCEMENTS_PAGE_SIZE = 10;
export const ANNOUNCEMENTS_PAGE_CHROME = 3;

/** Computed by the backend (`displayStatus`), lower-cased for lookups. */
export const ANNOUNCEMENT_STATUS = {
  ACTIVE: 'active',
  SCHEDULED: 'scheduled',
  EXPIRED: 'expired',
  INACTIVE: 'inactive',
};

/** Admin-controlled switch (`activeState`). */
export const ACTIVE_STATE = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/** Must match the backend enum exactly; anything else is rejected with a 400. */
export const ANNOUNCEMENT_TYPE = {
  GENERAL_ANNOUNCEMENT: 'general_announcement',
  IMPORTANT_NOTICE: 'important_notice',
  COMPETITION_ANNOUNCEMENT: 'competition_announcement',
  COMPETITION_REMINDER: 'competition_reminder',
  WINNER_ANNOUNCEMENT: 'winner_announcement',
  EVENT_ANNOUNCEMENT: 'event_announcement',
  NEW_FEATURE: 'new_feature',
  WEBSITE_UPDATE: 'website_update',
  PROMOTION: 'promotion',
  COMMUNITY_NEWS: 'community_news',
};

export const ANNOUNCEMENT_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
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

export const TYPE_STYLES = {
  [ANNOUNCEMENT_TYPE.GENERAL_ANNOUNCEMENT]: {
    bg: 'bg-[#eff6ff]',
    text: 'text-[#2563eb]',
  },
  [ANNOUNCEMENT_TYPE.IMPORTANT_NOTICE]: {
    bg: 'bg-[#fff7ed]',
    text: 'text-[#ea580c]',
  },
  [ANNOUNCEMENT_TYPE.COMPETITION_ANNOUNCEMENT]: {
    bg: 'bg-[#f5f3ff]',
    text: 'text-[#7c3aed]',
  },
  [ANNOUNCEMENT_TYPE.COMPETITION_REMINDER]: {
    bg: 'bg-[#eef2ff]',
    text: 'text-[#4f46e5]',
  },
  [ANNOUNCEMENT_TYPE.WINNER_ANNOUNCEMENT]: {
    bg: 'bg-[#fefce8]',
    text: 'text-[#a16207]',
  },
  [ANNOUNCEMENT_TYPE.EVENT_ANNOUNCEMENT]: {
    bg: 'bg-[#ecfeff]',
    text: 'text-[#0e7490]',
  },
  [ANNOUNCEMENT_TYPE.NEW_FEATURE]: {
    bg: 'bg-[#ecfdf3]',
    text: 'text-[#15803d]',
  },
  [ANNOUNCEMENT_TYPE.WEBSITE_UPDATE]: {
    bg: 'bg-[#f1f5f9]',
    text: 'text-[#475569]',
  },
  [ANNOUNCEMENT_TYPE.PROMOTION]: { bg: 'bg-[#fdf2f8]', text: 'text-[#db2777]' },
  [ANNOUNCEMENT_TYPE.COMMUNITY_NEWS]: {
    bg: 'bg-[#fff1f2]',
    text: 'text-[#e11d48]',
  },
};

export const PRIORITY_LABEL_KEYS = {
  [ANNOUNCEMENT_PRIORITY.HIGH]: 'adminAnnouncements.priority.high',
  [ANNOUNCEMENT_PRIORITY.MEDIUM]: 'adminAnnouncements.priority.medium',
  [ANNOUNCEMENT_PRIORITY.LOW]: 'adminAnnouncements.priority.low',
};

export const PRIORITY_DOT_STYLES = {
  [ANNOUNCEMENT_PRIORITY.HIGH]: [
    'bg-[#ef4444]',
    'bg-[#ef4444]',
    'bg-[#ef4444]',
  ],
  [ANNOUNCEMENT_PRIORITY.MEDIUM]: [
    'bg-[#f97316]',
    'bg-[#f97316]',
    'bg-transparent border border-[#d1d5db]',
  ],
  [ANNOUNCEMENT_PRIORITY.LOW]: [
    'bg-[#d1d5db]',
    'bg-transparent border border-[#d1d5db]',
    'bg-transparent border border-[#d1d5db]',
  ],
};

export const ANNOUNCEMENT_STAT_CARDS = [
  {
    id: 'total',
    labelKey: 'adminAnnouncements.stats.total.label',
    hintKey: 'adminAnnouncements.stats.total.hint',
    hintClass: 'text-[#6b7280]',
    icon: '▢',
    iconBg: 'bg-[#f3f4f6] text-[#6b7280]',
  },
  {
    id: 'active',
    labelKey: 'adminAnnouncements.stats.active.label',
    hintKey: 'adminAnnouncements.stats.active.hint',
    hintClass: 'text-[#16a34a]',
    icon: '●',
    iconBg: 'bg-[#ecfdf3] text-[#16a34a]',
  },
  {
    id: 'scheduled',
    labelKey: 'adminAnnouncements.stats.scheduled.label',
    hintKey: 'adminAnnouncements.stats.scheduled.hint',
    hintClass: 'text-[#2563eb]',
    icon: '◷',
    iconBg: 'bg-[#eff6ff] text-[#2563eb]',
  },
  {
    id: 'expired',
    labelKey: 'adminAnnouncements.stats.expired.label',
    hintKey: 'adminAnnouncements.stats.expired.hint',
    hintClass: 'text-[#6b7280]',
    icon: '✕',
    iconBg: 'bg-[#f3f4f6] text-[#6b7280]',
  },
  {
    id: 'inactive',
    labelKey: 'adminAnnouncements.stats.inactive.label',
    hintKey: 'adminAnnouncements.stats.inactive.hint',
    hintClass: 'text-[#ca8a04]',
    icon: '■',
    iconBg: 'bg-[#fefce8] text-[#ca8a04]',
  },
];

export const ACTION_MENU_OPTIONS = [
  { id: 'edit', labelKey: 'adminAnnouncements.actions.edit' },
  { id: ACTIVE_STATE.ACTIVE, labelKey: 'adminAnnouncements.actions.setActive' },
  {
    id: ACTIVE_STATE.INACTIVE,
    labelKey: 'adminAnnouncements.actions.setInactive',
  },
  { id: 'delete', labelKey: 'adminAnnouncements.actions.delete' },
];

export const getAnnouncementPageNumbers = (
  page,
  totalPages,
  windowSize = ANNOUNCEMENTS_PAGE_CHROME,
) => {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotal);
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, safePage - half);
  const end = Math.min(safeTotal, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = [];
  for (let n = start; n <= end; n += 1) pages.push(n);
  return pages;
};

export const ANNOUNCEMENT_MESSAGE_MAX = 120;

export const ANNOUNCEMENT_EMOJI_OPTIONS = [
  '🎉',
  '🏆',
  '📅',
  '🚩',
  '📷',
  '🔥',
  '🚀',
  '💰',
  '⭐',
  '📢',
  '🎯',
  '🌟',
  '🎁',
];

export const ANNOUNCEMENT_TYPE_OPTIONS = Object.values(ANNOUNCEMENT_TYPE);

export const ANNOUNCEMENT_PRIORITY_OPTIONS = [
  ANNOUNCEMENT_PRIORITY.HIGH,
  ANNOUNCEMENT_PRIORITY.MEDIUM,
  ANNOUNCEMENT_PRIORITY.LOW,
];

export const EMPTY_ANNOUNCEMENT_FORM = {
  message: '',
  icon: '🎉',
  type: ANNOUNCEMENT_TYPE.GENERAL_ANNOUNCEMENT,
  link: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  noEndDate: false,
  activeState: ACTIVE_STATE.ACTIVE,
  priority: ANNOUNCEMENT_PRIORITY.MEDIUM,
};

const humanize = (value) => {
  const text = String(value || '').replace(/_/g, ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * @param {(key: string, options?: object) => string} t
 * @param {string} type
 */
export const getAnnouncementTypeLabel = (t, type) =>
  t(`adminAnnouncements.types.${type}`, { defaultValue: humanize(type) });

/**
 * @param {{ displayStatus?: string, activeState?: string }} announcement
 */
export const getAnnouncementStatus = (announcement) =>
  String(announcement.displayStatus || announcement.activeState || '')
    .trim()
    .toLowerCase();

/** `2026-10-01T00:00:00.000Z` → `2026-10-01` (the calendar day the admin picked). */
const toDateInputValue = (value) => (value ? String(value).slice(0, 10) : '');

/**
 * @param {string | null} date
 * @param {string | null} time
 * @param {string} [locale]
 */
export const formatScheduleDate = (date, time, locale) => {
  const day = toDateInputValue(date);
  if (!day) return '';
  const parsed = new Date(`${day}T00:00:00`);
  const label = Number.isNaN(parsed.getTime())
    ? day
    : parsed.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
  return time ? `${label} · ${time}` : label;
};

export const isAnnouncementMessageValid = (value) => {
  const text = String(value || '').trim();
  return text.length > 0 && text.length <= ANNOUNCEMENT_MESSAGE_MAX;
};

/**
 * @param {object | null | undefined} announcement
 * @returns {typeof EMPTY_ANNOUNCEMENT_FORM}
 */
export const getAnnouncementFormValues = (announcement) => {
  if (!announcement) return EMPTY_ANNOUNCEMENT_FORM;
  return {
    message: announcement.message ?? '',
    icon: announcement.icon || EMPTY_ANNOUNCEMENT_FORM.icon,
    type: announcement.type || EMPTY_ANNOUNCEMENT_FORM.type,
    link: announcement.link ?? '',
    startDate: toDateInputValue(announcement.startDate),
    startTime: announcement.startTime ?? '',
    endDate: toDateInputValue(announcement.endDate),
    endTime: announcement.endTime ?? '',
    noEndDate: Boolean(announcement.noEndDate),
    activeState: announcement.activeState || ACTIVE_STATE.ACTIVE,
    priority: announcement.priority || EMPTY_ANNOUNCEMENT_FORM.priority,
  };
};

/**
 * @param {typeof EMPTY_ANNOUNCEMENT_FORM} values
 * @param {{ previousLink?: string | null }} [options]
 */
export const buildAnnouncementPayload = (values, { previousLink } = {}) => {
  const link = String(values.link || '').trim();
  const noEndDate = Boolean(values.noEndDate);

  return {
    message: values.message.trim(),
    icon: values.icon,
    type: values.type,
    ...(link ? { link } : previousLink ? { link: null } : {}),
    startDate: values.startDate,
    ...(values.startTime ? { startTime: values.startTime } : {}),
    ...(!noEndDate && {
      endDate: values.endDate,
      ...(values.endTime ? { endTime: values.endTime } : {}),
    }),
    noEndDate,
    activeState: values.activeState,
    priority: values.priority,
  };
};

/**
 * Full PUT body for an existing announcement with only `activeState` changed.
 * @param {object} announcement
 * @param {string} activeState
 */
export const buildActiveStatePayload = (announcement, activeState) =>
  buildAnnouncementPayload(
    { ...getAnnouncementFormValues(announcement), activeState },
    { previousLink: announcement.link },
  );
