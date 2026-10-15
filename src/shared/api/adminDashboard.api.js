import { apiClient } from './client';

export const ADMIN_DASHBOARD_QUERY_KEY = ['admin-dashboard'];

export const getAdminDashboardApi = async () => {
  const response = await apiClient.get('/v1/admin/users/dashboard');
  return response?.data ?? response;
};
