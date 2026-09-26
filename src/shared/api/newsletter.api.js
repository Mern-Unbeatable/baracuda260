import { apiClient } from './client';

export const ADMIN_NEWSLETTER_SUBSCRIBERS_QUERY_KEY = [
  'admin-newsletter-subscribers',
];

export const getNewsletterSubscribersApi = async ({ page, limit }) => {
  const response = await apiClient.get('/v1/newsletter/subscribers', {
    params: { page, limit },
  });
  const meta = response?.meta;
  return {
    items: response?.data?.data ?? [],
    meta: {
      page: meta?.currentPage ?? page,
      totalPages: meta?.totalPages ?? 1,
      total: meta?.totalRecords ?? response?.data?.total ?? 0,
    },
  };
};

/**
 * @param {FormData} formData target, subject, title, content, ctaText, ctaUrl, banner
 */
export const sendNewsletterCampaignApi = async (formData) => {
  const response = await apiClient.post(
    '/v1/newsletter/campaigns/send',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return response;
};
