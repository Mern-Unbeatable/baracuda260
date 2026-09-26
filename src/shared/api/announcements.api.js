import { apiClient } from './client';

export const ADMIN_ANNOUNCEMENTS_QUERY_KEY = ['admin-announcements'];

export const getAdminAnnouncementsApi = async ({ page, limit }) => {
  const response = await apiClient.get('/v1/admin/announcements', {
    params: { page, limit },
  });
  const meta = response?.meta ?? {};
  return {
    items: response?.data ?? [],
    meta: {
      page: meta.currentPage ?? page,
      totalPages: meta.totalPages ?? 1,
      total: meta.totalRecords ?? 0,
    },
  };
};

export const getAdminAnnouncementStatsApi = async () => {
  const response = await apiClient.get('/v1/admin/announcements/stats');
  return response?.data ?? {};
};

export const getAdminAnnouncementApi = async (announcementId) => {
  const response = await apiClient.get(
    `/v1/admin/announcements/${announcementId}`,
  );
  return response?.data;
};

export const createAdminAnnouncementApi = async (payload) => {
  const response = await apiClient.post('/v1/admin/announcements', payload);
  return response?.data;
};

export const updateAdminAnnouncementApi = async ({ id, payload }) => {
  // payload: { message, icon, type, link?, startDate, startTime, endDate?, endTime?, noEndDate, activeState, priority }
  const response = await apiClient.put(
    `/v1/admin/announcements/${id}`,
    payload,
  );
  return response?.data;
};

export const deleteAdminAnnouncementApi = async (announcementId) => {
  const response = await apiClient.delete(
    `/v1/admin/announcements/${announcementId}`,
  );
  return response?.data;
};
