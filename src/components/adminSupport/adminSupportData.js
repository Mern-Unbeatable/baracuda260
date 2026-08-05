/** Admin Support — Figma node 339:4651. */

const A = '/assets/admin-support';

export const ADMIN_SUPPORT_ASSETS = {
  question: `${A}/icon-question.svg`,
  message: `${A}/icon-message.svg`,
  eye: `${A}/icon-eye.svg`,
};

export const QUESTION_ICON_SIZE = 18;
export const MESSAGE_ICON_SIZE = 12;
export const EYE_ICON_SIZE = 20;
export const AVATAR_SIZE = 40;

export const SUPPORT_STATUS = {
  PENDING: 'pending',
  ANSWERED: 'answered',
};

/** Mock tickets matching Figma 339:4651. */
export const ADMIN_SUPPORT_TICKETS = [
  {
    id: 'pending-1',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.PENDING,
  },
  {
    id: 'pending-2',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.PENDING,
  },
  {
    id: 'pending-3',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.PENDING,
  },
  {
    id: 'answered-1',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.ANSWERED,
  },
  {
    id: 'answered-2',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.ANSWERED,
  },
];

/**
 * @param {typeof ADMIN_SUPPORT_TICKETS} tickets
 * @param {string} status
 */
export const filterSupportTicketsByStatus = (tickets, status) =>
  tickets.filter((ticket) => ticket.status === status);

/**
 * Mark a pending ticket as answered (immutable).
 * @param {typeof ADMIN_SUPPORT_TICKETS} tickets
 * @param {string} ticketId
 */
export const markSupportTicketAnswered = (tickets, ticketId) =>
  tickets.map((ticket) =>
    ticket.id === ticketId ? { ...ticket, status: SUPPORT_STATUS.ANSWERED } : ticket,
  );
