import { apiClient } from './client';

export const ADMIN_CAMPAIGNS_QUERY_KEY = ['admin-campaigns'];

/**
 * Fetch campaign stats for admin promo links page.
 * GET /api/v1/campaigns/stats
 */
export const getCampaignStatsApi = async () => {
  const response = await apiClient.get('/v1/campaigns/stats');
  const data = response?.data ?? response;
  return {
    total: Number(data?.totalLinks ?? 0),
    active: Number(data?.activeLinks ?? 0),
    used: Number(data?.usedLinks ?? 0),
    expired: Number(data?.expiredLinks ?? 0),
    incomplete: Number(data?.incompleteReqs ?? 0),
    raw: data,
  };
};

/**
 * Fetch server-paginated campaign promo links with filters.
 * GET /api/v1/campaigns/links?status=ALL&dateCreated=ALL&requirements=ALL&rewardStatus=ALL&page=1&limit=10
 *
 * @param {{
 *   status?: string,
 *   dateCreated?: string,
 *   requirements?: string,
 *   rewardStatus?: string,
 *   page?: number,
 *   limit?: number,
 * }} params
 */
export const getCampaignLinksApi = async ({
  status = 'ALL',
  dateCreated = 'ALL',
  requirements = 'ALL',
  rewardStatus = 'ALL',
  page = 1,
  limit = 10,
} = {}) => {
  const params = {
    status: (status || 'ALL').toUpperCase(),
    dateCreated: (dateCreated || 'ALL').toUpperCase(),
    requirements: (requirements || 'ALL').toUpperCase(),
    rewardStatus: (rewardStatus || 'ALL').toUpperCase(),
    page,
    limit,
  };

  const response = await apiClient.get('/v1/campaigns/links', { params });
  const rawData = response?.data ?? [];
  const rawMeta = response?.meta ?? {};

  const items = (Array.isArray(rawData) ? rawData : []).map((item, idx) => {
    const rawStatus = String(item.status || 'ACTIVE').toUpperCase();
    const rawReward = String(item.reward || '------').toUpperCase();
    const rawChecklist = String(item.checklist || '------');

    // Extract promo code from promotionalUrl or id
    let code = item.token || '';
    if (!code && item.promotionalUrl) {
      const parts = item.promotionalUrl.split('/');
      code = parts[parts.length - 1] || '';
    }
    if (!code) {
      code = item.id ? String(item.id).slice(0, 6).toUpperCase() : `PL${idx + 1}`;
    }

    return {
      id: item.id || `promo-link-${idx}`,
      linkId: code,
      code,
      promotionalUrl: item.promotionalUrl || '',
      url: item.promotionalUrl || '',
      dateIssued: item.dateIssued || item.createdAt || '',
      issuedAt: item.dateIssued || item.createdAt || '',
      validity: item.validity ?? '',
      status: rawStatus,
      checklist: rawChecklist,
      reward: rawReward,
      raw: item,
    };
  });

  return {
    items,
    meta: {
      total: Number(rawMeta?.total ?? items.length),
      page: Number(rawMeta?.page ?? page),
      limit: Number(rawMeta?.limit ?? limit),
      totalPages: Math.max(1, Number(rawMeta?.totalPages ?? 1)),
    },
  };
};

/**
 * Fetch promo link details by id.
 * GET /api/v1/campaigns/links/:id
 * @param {string} id
 */
export const getCampaignLinkDetailsApi = async (id) => {
  if (!id) return null;
  const response = await apiClient.get(`/v1/campaigns/links/${id}`);
  const data = response?.data ?? response;
  return data;
};

/**
 * Create a new promo link.
 * POST /api/v1/campaigns/links
 */
export const createCampaignLinkApi = async () => {
  const response = await apiClient.post('/v1/campaigns/links', {});
  return response?.data ?? response;
};

/**
 * Update a promo link's reward status.
 * PATCH /api/v1/campaigns/links/:id/reward
 * Body: { status: "PAID" | "NOT_ELIGIBLE" }
 *
 * @param {{ id: string, status: 'PAID' | 'NOT_ELIGIBLE' }} payload
 */
export const updateCampaignLinkRewardApi = async ({ id, status }) => {
  const backendStatus = String(status).toUpperCase();
  const response = await apiClient.patch(`/v1/campaigns/links/${id}/reward`, {
    status: backendStatus,
  });
  return response?.data ?? response;
};
