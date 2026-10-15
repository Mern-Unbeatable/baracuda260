import { apiClient } from './client';
import { resolveMediaUrl } from '@/shared/utils/media';

export const ADMIN_COMMENTS_QUERY_KEY = ['admin-comments'];

/**
 * Normalizes comment type from backend strings to client COMMENT_TYPE.
 * @param {string} rawType
 */
export const normalizeCommentType = (rawType) => {
  const str = String(rawType || '').toLowerCase();
  if (str.includes('six') || str.includes('album6') || str.includes('6')) {
    return 'album6';
  }
  if (str.includes('zodiac') || str.includes('12')) {
    return 'zodiac';
  }
  return 'single';
};

/**
 * Normalizes raw comment row from list API.
 * @param {object} item
 */
export const normalizeCommentRow = (item) => {
  if (!item) return null;

  const id = item.commentId || item.id || '';
  const statusStr = String(item.status || 'PENDING').toLowerCase();

  let formattedDate = '';
  if (item.date) {
    try {
      formattedDate = new Date(item.date).toISOString().split('T')[0];
    } catch {
      formattedDate = String(item.date);
    }
  }

  return {
    id,
    code: item.commentId || id,
    pinned: Boolean(item.pinned),
    name: item.user?.name || item.photographerProfile?.name || 'User',
    country: item.user?.country || item.photographerProfile?.country || '',
    email: item.user?.email || item.photographerProfile?.email || '',
    photoTitle: item.photo?.title || 'Artwork',
    category: item.photo?.type || 'Photo',
    comment: item.comment || '',
    type: normalizeCommentType(item.photo?.type),
    date: formattedDate || '2026-10-14',
    status: statusStr,
    avatar: resolveMediaUrl(item.user?.avatar || item.photographerProfile?.avatar),
    photo: resolveMediaUrl(item.photo?.image),
    followers: item.photographerProfile?.stats?.followers ?? 0,
    uploads: item.photographerProfile?.stats?.uploads ?? 0,
    visits: item.photographerProfile?.stats?.visits ?? 0,
    raw: item,
  };
};

/**
 * Normalizes comment detail from detail API.
 * @param {object} item
 */
export const normalizeCommentDetail = (item) => {
  if (!item) return null;
  const base = normalizeCommentRow(item);
  const profile = item.photographerProfile || {};
  const stats = profile.stats || {};

  return {
    ...base,
    name: profile.name || base.name,
    email: profile.email || base.email,
    country: profile.country || base.country,
    avatar: resolveMediaUrl(profile.avatar || base.avatar),
    followers: stats.followers !== undefined ? Number(stats.followers).toLocaleString() : base.followers,
    uploads: stats.uploads !== undefined ? Number(stats.uploads).toLocaleString() : base.uploads,
    visits: stats.visits !== undefined ? Number(stats.visits).toLocaleString() : base.visits,
    photographerProfile: profile,
  };
};

/**
 * Fetches admin comments list with status and pagination.
 * @param {{ status?: string, page?: number, limit?: number }} params
 */
export const getAdminCommentsApi = async ({
  status = 'all',
  page = 1,
  limit = 10,
} = {}) => {
  const queryParams = { page, limit };
  if (status && status !== 'all') {
    queryParams.status = String(status).toUpperCase();
  }

  const response = await apiClient.get('/v1/admin/comments', {
    params: queryParams,
  });

  const rawList = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];

  const meta = response?.meta || {
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(rawList.length / limit)),
    totalRecords: rawList.length,
    hasNext: false,
    hasPrevious: false,
  };

  return {
    items: rawList.map(normalizeCommentRow).filter(Boolean),
    meta,
  };
};

/**
 * Fetches details for a single comment by public code.
 * @param {string} commentCode
 */
export const getAdminCommentDetailsApi = async (commentCode) => {
  if (!commentCode) return null;
  const response = await apiClient.get(`/v1/admin/comments/${commentCode}`);
  const data = response?.data || response;
  return normalizeCommentDetail(data);
};

/**
 * Updates status of one or multiple comments.
 * @param {{ commentIds: string[], status: string }} payload
 */
export const updateAdminCommentsBulkStatusApi = async ({
  commentIds,
  status,
}) => {
  const formattedStatus = String(status).toUpperCase();
  const response = await apiClient.patch('/v1/admin/comments/bulk-status', {
    commentIds,
    status: formattedStatus,
  });
  return response?.data || response;
};
