import { apiClient } from './client';

export const ADMIN_PROFILE_QUERY_KEY = ['admin-profile'];

/**
 * Fetch admin profile details.
 * GET /api/v1/admin/profile
 */
export const getAdminProfileApi = async () => {
  try {
    const response = await apiClient.get('/v1/admin/profile');
    return response?.data ?? response;
  } catch {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }
};

/**
 * Update admin profile name.
 * PATCH /api/v1/admin/profile
 * Body: { name: string }
 *
 * @param {{ name: string }} payload
 */
export const updateAdminProfileApi = async ({ name }) => {
  const response = await apiClient.patch('/v1/admin/profile', { name });
  return response?.data ?? response;
};

/**
 * Change admin password.
 * POST /api/v1/admin/profile/change-password
 * Body: { currentPassword: string, newPassword: string }
 *
 * @param {{ currentPassword: string, newPassword: string }} payload
 */
export const changeAdminPasswordApi = async ({ currentPassword, newPassword }) => {
  const response = await apiClient.post('/v1/admin/profile/change-password', {
    currentPassword,
    newPassword,
  });
  return response?.data ?? response;
};
