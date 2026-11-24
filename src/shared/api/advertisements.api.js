import { apiClient } from './client';

export const ADMIN_ADVERTISEMENTS_QUERY_KEY = ['admin-advertisements'];
export const PUBLIC_ADVERTISEMENTS_QUERY_KEY = ['public-advertisements'];

/** Page slugs accepted by GET /v1/advertisements/public?page= */
export const ADVERTISEMENT_PAGES = [
  'home',
  'competitions',
  'competitions-details',
  'gallery',
  'gallery-details',
  'photographer-profile',
  'checkout-page',
  'buy-photo',
  'buy-photo-details',
  'album',
  'leaderboard',
  'winner',
  'about',
];

/**
 * Map a frontend pathname to the advertisement selectPage slug.
 * @param {string} pathname
 * @returns {string | null}
 */
export const resolveAdvertisementPage = (pathname = '/') => {
  const p = String(pathname || '/').replace(/\/+$/, '') || '/';

  if (p === '/') return 'home';
  if (p === '/competitions') return 'competitions';
  if (p.startsWith('/competitions/')) return 'competitions-details';
  if (p === '/gallery') return 'gallery';
  if (p.startsWith('/gallery/')) return 'gallery-details';
  if (p.startsWith('/photographer')) return 'photographer-profile';
  if (p.includes('/checkout')) return 'checkout-page';
  if (p === '/buy-photos' || p === '/marketplace') return 'buy-photo';
  if (p.startsWith('/buy-photos/')) return 'buy-photo-details';
  if (p === '/album-types' || p.startsWith('/album')) return 'album';
  if (p === '/leaderboard') return 'leaderboard';
  if (p === '/winners' || p.startsWith('/winners/')) return 'winner';
  if (p === '/about') return 'about';
  return null;
};

/**
 * Active public ads for a site page.
 * Endpoint: GET /v1/advertisements/public?page=home
 *
 * @param {{ page?: string }} [params]
 */
export const getPublicAdvertisementsApi = async ({ page } = {}) => {
  const params = {};
  if (page) params.page = String(page).toLowerCase();

  const response = await apiClient.get('/v1/advertisements/public', { params });
  const payload = response?.data !== undefined ? response.data : response;
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return list.map((ad) => ({
    id: ad.id,
    businessName: ad.businessName || '',
    businessType: ad.businessType || 'ONLINE',
    description: ad.description || '',
    descriptionPl: ad.description_pl || ad.descriptionPl || '',
    media: ad.media || ad.businessImage || '',
    websiteUrl: ad.websiteUrl || '',
    location: ad.location || '',
    locationPl: ad.location_pl || ad.locationPl || '',
  }));
};

/**
 * Prisma Decimal may arrive as a number, string, or { s, e, d } object.
 * @param {unknown} amount
 * @returns {number | null}
 */
const normalizeAmount = (amount) => {
  if (amount == null || amount === '') return null;
  if (typeof amount === 'number') {
    return Number.isFinite(amount) ? amount : null;
  }
  if (typeof amount === 'string') {
    const num = Number.parseFloat(amount.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(num) ? num : null;
  }
  if (typeof amount === 'object') {
    if (typeof amount.toNumber === 'function') {
      try {
        const num = amount.toNumber();
        return Number.isFinite(num) ? num : null;
      } catch {
        // ignore
      }
    }
    if (Array.isArray(amount.d) && typeof amount.e === 'number') {
      const sign = amount.s ?? 1;
      const digitsStr = amount.d.join('');
      const num =
        sign * Number(digitsStr) * 10 ** (amount.e - digitsStr.length + 1);
      return Number.isFinite(num) ? num : null;
    }
    if (amount.value != null) return normalizeAmount(amount.value);
  }
  return null;
};

const normalizeAdminAd = (ad) => {
  if (!ad) return null;
  return {
    ...ad,
    amount: normalizeAmount(ad.amount),
  };
};

export const getAdminAdvertisementsApi = async ({ page, limit }) => {
  const response = await apiClient.get('/v1/advertisements/admin/all', {
    params: { page, limit },
  });
  const rawItems = response?.data?.data ?? [];
  return {
    items: (Array.isArray(rawItems) ? rawItems : []).map(normalizeAdminAd),
    meta: response?.data?.meta ?? { total: 0, page, limit, totalPages: 1 },
  };
};

export const getAdminAdvertisementApi = async (advertisementId) => {
  const response = await apiClient.get(
    `/v1/advertisements/admin/${advertisementId}`,
  );
  return normalizeAdminAd(response?.data ?? null);
};

export const updateAdvertisementStatusApi = async ({ id, status }) => {
  // status: PENDING | ACTIVE | REJECTED | EXPIRED
  const response = await apiClient.patch(
    `/v1/advertisements/admin/${id}/status`,
    { status },
  );
  return response?.data;
};
