/** Admin Support — Figma nodes 339:4651, 339:4819, 339:4863. */

const A = '/assets/admin-support';

export const ADMIN_SUPPORT_ASSETS = {
  question: `${A}/icon-question.svg`,
  message: `${A}/icon-message.svg`,
  eye: `${A}/icon-eye.svg`,
  close: `${A}/icon-close.svg`,
  questionBadge: `${A}/icon-question-badge.svg`,
  bold: `${A}/icon-bold.svg`,
  italic: `${A}/icon-italic.svg`,
  listUl: `${A}/icon-list-ul.svg`,
  listOl: `${A}/icon-list-ol.svg`,
  link: `${A}/icon-link.svg`,
  image: `${A}/icon-image.svg`,
};

export const QUESTION_ICON_SIZE = 18;
export const MESSAGE_ICON_SIZE = 12;
export const EYE_ICON_SIZE = 20;
export const AVATAR_SIZE = 40;
export const CLOSE_ICON_SIZE = 30;
export const QUESTION_BADGE_SIZE = 18;

export const SUPPORT_STATUS = {
  PENDING: 'pending',
  ANSWERED: 'answered',
};

export const ANSWER_MODAL_MODE = {
  COMPOSE: 'compose',
  PUBLISHED: 'published',
};

export const EDITOR_TOOLBAR = [
  { id: 'bold', assetKey: 'bold', labelKey: 'adminSupport.modal.toolbar.bold', wrap: ['**', '**'] },
  { id: 'italic', assetKey: 'italic', labelKey: 'adminSupport.modal.toolbar.italic', wrap: ['*', '*'] },
  { id: 'divider-1', type: 'divider' },
  { id: 'listUl', assetKey: 'listUl', labelKey: 'adminSupport.modal.toolbar.listUl', prefix: '- ' },
  { id: 'listOl', assetKey: 'listOl', labelKey: 'adminSupport.modal.toolbar.listOl', prefix: '1. ' },
  { id: 'divider-2', type: 'divider' },
  { id: 'link', assetKey: 'link', labelKey: 'adminSupport.modal.toolbar.link', wrap: ['[', '](url)'] },
  { id: 'image', assetKey: 'image', labelKey: 'adminSupport.modal.toolbar.image', wrap: ['![', '](url)'] },
];

/** Mock tickets matching Figma 339:4651 / 339:4819 / 339:4863. */
export const ADMIN_SUPPORT_TICKETS = [
  {
    id: 'pending-1',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    fullQuestionKey: 'adminSupport.tickets.export.fullQuestion',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.PENDING,
    answer: '',
  },
  {
    id: 'pending-2',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    fullQuestionKey: 'adminSupport.tickets.export.fullQuestion',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.PENDING,
    answer: '',
  },
  {
    id: 'pending-3',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    fullQuestionKey: 'adminSupport.tickets.export.fullQuestion',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.PENDING,
    answer: '',
  },
  {
    id: 'answered-1',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    fullQuestionKey: 'adminSupport.tickets.export.fullQuestion',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.ANSWERED,
    answerKey: 'adminSupport.tickets.export.answer',
  },
  {
    id: 'answered-2',
    titleKey: 'adminSupport.tickets.export.title',
    previewKey: 'adminSupport.tickets.export.preview',
    fullQuestionKey: 'adminSupport.tickets.export.fullQuestion',
    timeKey: 'adminSupport.tickets.export.time',
    status: SUPPORT_STATUS.ANSWERED,
    answerKey: 'adminSupport.tickets.export.answer',
  },
];

/**
 * @param {typeof ADMIN_SUPPORT_TICKETS} tickets
 * @param {string} status
 */
export const filterSupportTicketsByStatus = (tickets, status) =>
  tickets.filter((ticket) => ticket.status === status);

/**
 * @param {typeof ADMIN_SUPPORT_TICKETS} tickets
 * @param {string} ticketId
 */
export const findSupportTicketById = (tickets, ticketId) =>
  tickets.find((ticket) => ticket.id === ticketId) || null;

/**
 * Publish an answer and move the ticket to answered (immutable).
 * @param {typeof ADMIN_SUPPORT_TICKETS} tickets
 * @param {string} ticketId
 * @param {string} answer
 */
export const publishSupportAnswer = (tickets, ticketId, answer) =>
  tickets.map((ticket) =>
    ticket.id === ticketId
      ? {
          ...ticket,
          status: SUPPORT_STATUS.ANSWERED,
          answer: answer.trim(),
          answerKey: undefined,
        }
      : ticket,
  );

/**
 * @deprecated Prefer publishSupportAnswer — kept for existing tests.
 * @param {typeof ADMIN_SUPPORT_TICKETS} tickets
 * @param {string} ticketId
 */
export const markSupportTicketAnswered = (tickets, ticketId) =>
  publishSupportAnswer(tickets, ticketId, '');

/**
 * Apply a toolbar wrap/prefix to the current textarea selection.
 * @param {string} value
 * @param {{ start: number, end: number }} selection
 * @param {{ wrap?: [string, string], prefix?: string }} tool
 */
export const applyEditorTool = (value, selection, tool) => {
  const start = Math.max(0, selection.start);
  const end = Math.max(start, selection.end);
  const selected = value.slice(start, end) || 'text';

  if (tool.prefix) {
    const next = `${value.slice(0, start)}${tool.prefix}${selected}${value.slice(end)}`;
    const cursor = start + tool.prefix.length + selected.length;
    return { value: next, selection: { start: cursor, end: cursor } };
  }

  if (tool.wrap) {
    const [before, after] = tool.wrap;
    const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    return {
      value: next,
      selection: { start: start + before.length, end: start + before.length + selected.length },
    };
  }

  return { value, selection: { start, end } };
};

/**
 * Resolve displayed answer text for a ticket.
 * @param {object} ticket
 * @param {(key: string) => string} t
 */
export const getTicketAnswerText = (ticket, t) => {
  if (!ticket) return '';
  if (ticket.answer) return ticket.answer;
  if (ticket.answerKey) return t(ticket.answerKey);
  return '';
};
