import { apiClient } from './client';

export const ADMIN_ADVERTISEMENTS_QUERY_KEY = ['admin-advertisements'];

export const getAdminAdvertisementsApi = async ({ page, limit }) => {
  const response = await apiClient.get('/v1/advertisements/admin/all', {
    params: { page, limit },
  });
  return {
    items: response?.data?.data ?? [],
    meta: response?.data?.meta ?? { total: 0, page, limit, totalPages: 1 },
  };
};

export const getAdminAdvertisementApi = async (advertisementId) => {
  const response = await apiClient.get(
    `/v1/advertisements/admin/${advertisementId}`,
  );
  return response?.data ?? null;
};

export const updateAdvertisementStatusApi = async ({ id, status }) => {
  // status: PENDING | ACTIVE | REJECTED | EXPIRED
  const response = await apiClient.patch(
    `/v1/advertisements/admin/${id}/status`,
    { status },
  );
  return response?.data;
};
