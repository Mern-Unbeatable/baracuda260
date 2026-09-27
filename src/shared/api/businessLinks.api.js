import { apiClient } from './client';

export const ADMIN_BUSINESS_LINKS_QUERY_KEY = ['admin-business-links'];

export const getAdminBusinessLinksApi = async ({ page, limit }) => {
  const response = await apiClient.get('/v1/business-links/admin', {
    params: { page, limit },
  });
  const meta = response?.data?.meta;
  return {
    items: response?.data?.data ?? [],
    meta: {
      page: meta?.currentPage ?? page,
      totalPages: meta?.totalPages ?? 1,
      total: meta?.totalRecords ?? 0,
      hasNext: Boolean(meta?.hasNext),
      hasPrevious: Boolean(meta?.hasPrevious),
    },
  };
};

export const getAdminBusinessLinkApi = async (businessAlbumId) => {
  const response = await apiClient.get(
    `/v1/business-links/admin/${businessAlbumId}`,
  );
  return response?.data ?? null;
};
