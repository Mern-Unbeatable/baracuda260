import { apiClient } from './client';

export const REPORTS_QUERY_KEY = ['admin-reports'];
export const REPORTS_STATS_QUERY_KEY = ['admin-reports-stats'];

export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};

export const normalizeReportStatus = (status) => {
  if (!status) return 'pending';
  const s = String(status).toUpperCase();
  if (s === 'PENDING') return 'pending';
  if (s === 'UNDER_REVIEW' || s === 'UNDERREVIEW') return 'underReview';
  if (s === 'RESOLVED') return 'resolved';
  return status.toLowerCase();
};

export const toBackendReportStatus = (status) => {
  if (!status) return 'PENDING';
  const s = String(status).toUpperCase();
  if (s === 'PENDING') return 'PENDING';
  if (s === 'UNDER_REVIEW' || s === 'UNDERREVIEW') return 'UNDER_REVIEW';
  if (s === 'RESOLVED') return 'RESOLVED';
  return s;
};

/**
 * GET /api/v1/admin/reports/stats
 * Response: { success: true, statusCode: 200, message: "...", data: { total, pending, underReview, resolved } }
 */
export const getAdminReportsStatsApi = async () => {
  const response = await apiClient.get('/v1/admin/reports/stats');
  const data = response?.data || response;
  return {
    total: data?.total ?? 0,
    pending: data?.pending ?? 0,
    underReview: data?.underReview ?? 0,
    resolved: data?.resolved ?? 0,
  };
};

/**
 * GET /api/v1/admin/reports?status=PENDING&page=1&limit=10
 * Response: { success: true, statusCode: 200, message: "...", data: { data: [...], meta: { currentPage, totalPages, totalRecords, hasNext, hasPrevious } } }
 */
export const getAdminReportsApi = async ({
  status,
  page = 1,
  limit = 10,
} = {}) => {
  const params = { page, limit };
  if (status && status !== 'all') {
    params.status = toBackendReportStatus(status);
  }

  const response = await apiClient.get('/v1/admin/reports', { params });
  const rawData = response?.data || response;
  const items = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];
  const meta = rawData?.meta || {};

  return {
    data: items,
    meta: {
      currentPage: meta.currentPage ?? page,
      totalPages: meta.totalPages ?? 1,
      totalRecords: meta.totalRecords ?? items.length,
      hasNext: Boolean(meta.hasNext),
      hasPrevious: Boolean(meta.hasPrevious),
    },
  };
};

/**
 * GET /api/v1/admin/reports/{{report_id}}
 * Response: { success: true, statusCode: 200, message: "...", data: { id, reason, details, status, createdAt, reporter, reportedUser, reportedItem } }
 */
export const getAdminReportDetailsApi = async (reportId) => {
  if (!reportId) return null;
  const response = await apiClient.get(`/v1/admin/reports/${reportId}`);
  return response?.data || response || null;
};

/**
 * PATCH /api/v1/admin/reports/{{report_id}}/status
 * Body: { "status": "UNDER_REVIEW" | "PENDING" | "RESOLVED" }
 */
export const updateAdminReportStatusApi = async (reportId, status) => {
  const backendStatus = toBackendReportStatus(status);
  const response = await apiClient.patch(
    `/v1/admin/reports/${reportId}/status`,
    {
      status: backendStatus,
    },
  );
  return response?.data || response;
};

export const REPORT_ACTION_TYPES = {
  CONTENT_REMOVED: 'CONTENT_REMOVED',
  WARN: 'WARN',
  SUSPEND: 'SUSPEND',
  BAN: 'BAN',
  MARK_RESOLVED: 'MARK_RESOLVED',
};

/**
 * POST /api/v1/admin/reports/{{report_id}}/action
 * Body: { "action": "CONTENT_REMOVED" | "WARN" | "SUSPEND" | "BAN" | "MARK_RESOLVED" }
 */
export const takeAdminReportActionApi = async (reportId, action) => {
  const response = await apiClient.post(
    `/v1/admin/reports/${reportId}/action`,
    {
      action,
    },
  );
  return response?.data || response;
};

/**
 * GET /api/v1/admin/users/{{user_id}}/audit-history
 * Response: { success: true, statusCode: 200, message: "...", data: { totalReports, warnings, suspensions, bans, history, casesInvolved } }
 */
export const getUserAuditHistoryApi = async (userId) => {
  if (!userId) return null;
  const response = await apiClient.get(`/v1/admin/users/${userId}/audit-history`);
  return response?.data || response || null;
};

/**
 * GET /api/v1/users/profile/{{username}}
 * Response: { success: true, data: { id, username, name, avatar, coverPhoto, introVideo, bio, city, country, socialLinks, stats, appreciation, ... } }
 */
export const getUserProfileApi = async (username) => {
  if (!username) return null;
  const cleanUsername = String(username).replace(/^@/, '');
  const response = await apiClient.get(`/v1/users/profile/${cleanUsername}`);
  return response?.data || response || null;
};


