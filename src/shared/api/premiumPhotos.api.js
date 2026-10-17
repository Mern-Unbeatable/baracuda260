import { apiClient } from './client';

export const ADMIN_PREMIUM_PHOTOS_QUERY_KEY = ['admin-premium-photos'];

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
  const baseUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    ''
  ).replace(/\/+$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};

const mapKindToType = (kind) => {
  const normalized = String(kind || 'SINGLE').toUpperCase();
  if (normalized === 'TWELVE') return 'zodiac';
  if (normalized === 'SIX') return 'six';
  return 'single';
};

/**
 * Fetches admin premium photos showcase list.
 * Endpoint: GET /v1/admin/premium-photos?page=1&limit=10
 *
 * @param {{
 *   page?: number,
 *   limit?: number,
 *   kind?: string,
 * }} [params]
 */
export const getAdminPremiumPhotosApi = async ({
  page = 1,
  limit = 10,
  kind,
} = {}) => {
  const queryParams = {
    page,
    limit,
  };

  if (kind && kind !== 'all') {
    queryParams.kind = kind;
  }

  const response = await apiClient.get('/v1/admin/premium-photos', {
    params: queryParams,
  });

  const payload = response?.data !== undefined ? response.data : response;
  const rawList = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  const rawMeta = payload?.meta || response?.meta;
  const meta = {
    currentPage: rawMeta?.currentPage ?? page,
    totalPages: rawMeta?.totalPages ?? 1,
    totalRecords: rawMeta?.totalRecords ?? rawList.length,
    hasNext: Boolean(rawMeta?.hasNext),
    hasPrevious: Boolean(rawMeta?.hasPrevious),
  };

  const data = rawList.map((item, idx) => {
    const rawKind = String(item.kind || 'SINGLE').toUpperCase();
    const type = mapKindToType(rawKind);
    const cover = resolveMediaUrl(item.coverImage || item.featuredImage || '');
    const createdDate = item.createdAt ? new Date(item.createdAt) : null;
    const formattedDate = createdDate
      ? createdDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

    const priceNum = Number(item.price ?? 0);
    const formattedPrice =
      priceNum > 0
        ? `$${priceNum % 1 === 0 ? priceNum.toFixed(0) : priceNum.toFixed(2)}`
        : null;

    return {
      id: item.id || `premium-photo-${idx}`,
      kind: rawKind,
      type,
      title: item.title || 'Untitled Photo',
      story: item.story || item.description || '',
      description: item.story || item.description || '',
      coverImage: cover,
      image: cover,
      viewsCount: Number(item.viewsCount ?? 0),
      views: Number(item.viewsCount ?? 0).toLocaleString(),
      likesCount: Number(item.likesCount ?? 0),
      likes: Number(item.likesCount ?? 0).toLocaleString(),
      totalSales: Number(item.totalSales ?? 0),
      price: formattedPrice,
      rawPrice: priceNum,
      additionalPhotos: Number(item.additionalPhotos ?? 0),
      extraPhotos:
        Number(item.additionalPhotos ?? 0) > 0
          ? Number(item.additionalPhotos)
          : null,
      createdAt: item.createdAt,
      formattedDate,
      raw: item,
    };
  });

  return {
    data,
    meta,
  };
};

/**
 * Fetches admin premium photo details.
 * @param {string} id
 */
export const getAdminPremiumPhotoDetailsApi = async (id) => {
  const response = await apiClient.get(`/v1/admin/premium-photos/${id}`);
  return response?.data ?? response;
};

/**
 * Deletes a premium photo.
 * @param {string} id
 */
export const deleteAdminPremiumPhotoApi = async (id) => {
  const response = await apiClient.delete(`/v1/admin/premium-photos/${id}`);
  return response?.data ?? response;
};
