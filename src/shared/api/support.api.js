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

/**
 * Normalizes ticket object from API response.
 * @param {object} item
 */
export const normalizeSupportTicket = (item) => {
  if (!item) return null;
  const title = normalizeTicketField(item.title);
  const message = normalizeTicketField(item.message);
  const statusStr = String(item.status || 'PENDING').toLowerCase();

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
    status: statusStr,
    attachments: Array.isArray(item.attachments) ? item.attachments : [],
    createdAt: item.createdAt,
    answeredAt: item.answeredAt,
    timeDisplay: formatSupportTicketTime(item.createdAt),
    user: item.user,
  };
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
