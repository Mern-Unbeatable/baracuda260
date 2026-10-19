import { apiClient } from './client';

export const ADMIN_SUPPORT_QUERY_KEY = ['admin-support'];

/**
 * Normalizes title or message that could be a plain string, JSON string, or object.
 * @param {string|object} val
 * @param {string} [lang='en']
 */
export const normalizeTicketField = (val, lang = 'en') => {
  if (!val) return '';
  if (typeof val === 'object') {
    return val[lang] || val.en || Object.values(val)[0] || '';
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parsed[lang] || parsed.en || Object.values(parsed)[0] || trimmed;
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }
  return String(val);
};

/**
 * Format timestamp into human-readable relative time or date.
 * @param {string} dateStr
 */
export const formatSupportTicketTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const USER_SUPPORT_QUERY_KEY = (params) => ['user-support-tickets', params];
export const USER_SUPPORT_DETAIL_QUERY_KEY = (id) => ['user-support-ticket', id];

/**
 * Normalizes ticket object from API response.
 * @param {object} item
 */
export const normalizeSupportTicket = (item) => {
  if (!item) return null;
  const title = normalizeTicketField(item.title);
  const message = normalizeTicketField(item.message);
  const rawStatus = String(item.status || 'PENDING').toUpperCase();

  return {
    id: item.id,
    userId: item.userId || item.user?.id,
    name: item.name || item.user?.name || 'User',
    email: item.email || item.user?.email || '',
    avatar: item.user?.avatar || null,
    category: item.category || 'GENERAL',
    title,
    message,
    preview: message,
    answer: item.answer || '',
    status: rawStatus,
    statusLower: rawStatus.toLowerCase(),
    attachments: Array.isArray(item.attachments) ? item.attachments : [],
    createdAt: item.createdAt,
    answeredAt: item.answeredAt,
    updatedAt: item.updatedAt,
    timeDisplay: formatSupportTicketTime(item.createdAt),
    user: item.user,
  };
};

/**
 * Creates a support ticket from member dashboard.
 * POST /api/v1/support
 * Payload: { name, email, subject, message }
 *
 * @param {{ name: string, email: string, subject: string, message: string }} payload
 */
export const createSupportTicketApi = async ({ name, email, subject, message }) => {
  const response = await apiClient.post('/v1/support', {
    name,
    email,
    subject,
    message,
  });
  return response?.data || response;
};

/**
 * Fetches member's own support tickets.
 * GET /api/v1/support/my-tickets?status=PENDING&page=1&limit=10
 *
 * @param {{ status?: string, page?: number, limit?: number }} [params]
 */
export const getMySupportTicketsApi = async ({ status, page = 1, limit = 10 } = {}) => {
  const params = { page, limit };
  if (status && status !== 'all') {
    params.status = status === 'replied' ? 'ANSWERED' : String(status).toUpperCase();
  }

  const response = await apiClient.get('/v1/support/my-tickets', { params });
  const rawList = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];

  return {
    items: rawList.map(normalizeSupportTicket).filter(Boolean),
    meta: response?.meta || {
      currentPage: page,
      totalPages: 1,
      totalRecords: rawList.length,
      hasNext: false,
      hasPrevious: false,
    },
    message: response?.message || '',
  };
};

/**
 * Fetches member's single support ticket details.
 * GET /api/v1/support/my-tickets/{{ticket_id}}
 *
 * @param {string} ticketId
 */
export const getMySupportTicketDetailsApi = async (ticketId) => {
  if (!ticketId) return null;
  const response = await apiClient.get(`/v1/support/my-tickets/${ticketId}`);
  const data = response?.data || response;
  return normalizeSupportTicket(data);
};

/**
 * Fetches pending support tickets.
 * @param {{ page?: number, limit?: number }} [params]
 */
export const getPendingSupportTicketsApi = async (params = {}) => {
  const response = await apiClient.get('/v1/support/admin/pending', { params });
  const rawList = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];

  return {
    items: rawList.map(normalizeSupportTicket).filter(Boolean),
    meta: response?.meta || {
      currentPage: 1,
      totalPages: 1,
      totalRecords: rawList.length,
    },
  };
};

/**
 * Fetches answered support tickets.
 * @param {{ page?: number, limit?: number }} [params]
 */
export const getAnsweredSupportTicketsApi = async (params = {}) => {
  const response = await apiClient.get('/v1/support/admin/answered', { params });
  const rawList = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];

  return {
    items: rawList.map(normalizeSupportTicket).filter(Boolean),
    meta: response?.meta || {
      currentPage: 1,
      totalPages: 1,
      totalRecords: rawList.length,
    },
  };
};

/**
 * Fetches detailed ticket information by ticket ID.
 * @param {string} ticketId
 */
export const getSupportTicketDetailsApi = async (ticketId) => {
  if (!ticketId) return null;
  const response = await apiClient.get(`/v1/support/admin/${ticketId}`);
  const data = response?.data || response;
  return normalizeSupportTicket(data);
};

/**
 * Convert plain text or markdown formatting into clean HTML for backend answer.
 * @param {string} raw
 */
export const formatAnswerHtml = (raw) => {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }
  let converted = trimmed
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  const paragraphs = converted.split(/\n\s*\n/).map((block) => {
    const lines = block.split('\n');
    if (
      lines.length > 0 &&
      lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '))
    ) {
      const items = lines.map((l) => `<li>${l.replace(/^[-*]\s*/, '')}</li>`).join('');
      return `<ul>${items}</ul>`;
    }
    return `<p>${lines.join('<br/>')}</p>`;
  });

  return paragraphs.join('');
};

/**
 * Sends reply / answer to a support ticket.
 * @param {{ ticketId: string, answer: string }} payload
 */
export const replySupportTicketApi = async ({ ticketId, answer }) => {
  const formattedAnswer = formatAnswerHtml(answer);
  const response = await apiClient.patch(
    `/v1/support/admin/${ticketId}/reply`,
    { answer: formattedAnswer },
  );
  return response?.data || response;
};
