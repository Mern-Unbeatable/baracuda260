import { apiClient } from './client';

export const ADMIN_USERS_QUERY_KEY = ['admin-users'];

/**
 * @param {{ page: number, limit: number, status: string }} params status: All | ACTIVE | PENDING | SUSPENDED
 */
export const getAdminUsersApi = async ({ page, limit, status }) => {
  const response = await apiClient.get('/v1/admin/users', {
    params: { page, limit, status },
  });
  const pagination = response?.pagination;
  return {
    items: response?.data ?? [],
    meta: {
      total: pagination?.total ?? 0,
      page: pagination?.page ?? page,
      totalPages: pagination?.totalPages ?? 1,
    },
  };
};

export const getAdminUserApi = async (userId) => {
  const response = await apiClient.get(`/v1/admin/users/${userId}`);
  return response?.data ?? null;
};

/**
 * @param {{ id: string, status: string, reason?: string }} params
 */
export const updateAdminUserStatusApi = async ({ id, status, reason }) => {
  const response = await apiClient.patch(`/v1/admin/users/${id}/status`, {
    status,
    ...(reason ? { reason } : {}),
  });
  return response;
};
