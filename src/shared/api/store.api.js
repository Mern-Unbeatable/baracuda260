import { apiClient } from '@/shared/api/client';
import { resolveMediaUrl } from '@/shared/utils/media';

export const STORE_PRODUCTS_QUERY_KEY = 'store-products';
export const STORE_PRODUCT_DETAILS_QUERY_KEY = 'store-product-details';

/**
 * Valid category values supported by the backend:
 * ART_PRINTS, OTHERS, HANDMADE_CRAFTS, APPAREL, PHOTOBOOKS, DIGITAL_PRESET
 */
export const STORE_CATEGORIES = {
  ALL: 'all',
  ART_PRINTS: 'ART_PRINTS',
  OTHERS: 'OTHERS',
  HANDMADE_CRAFTS: 'HANDMADE_CRAFTS',
  APPAREL: 'APPAREL',
  PHOTOBOOKS: 'PHOTOBOOKS',
  DIGITAL_PRESET: 'DIGITAL_PRESET',
};

export const STORE_CATEGORY_BADGE_MAP = {
  ART_PRINTS: 'myStore.badges.artPrints',
  HANDMADE_CRAFTS: 'myStore.badges.handmadeCrafts',
  APPAREL: 'myStore.badges.apparel',
  PHOTOBOOKS: 'myStore.badges.photobooks',
  DIGITAL_PRESET: 'myStore.badges.digitalPreset',
  OTHERS: 'myStore.badges.other',
};

/**
 * Parses numeric price from numbers, strings, or Decimal.js objects { s, e, d: [...] }.
 */
export const parseProductPrice = (rawPrice) => {
  if (rawPrice == null) return 0;
  if (typeof rawPrice === 'number') return rawPrice;
  if (typeof rawPrice === 'string') {
    const cleaned = rawPrice.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);
    return Number.isFinite(num) ? num : 0;
  }
  if (typeof rawPrice === 'object' && Array.isArray(rawPrice.d)) {
    const sign = rawPrice.s < 0 ? -1 : 1;
    const digits = rawPrice.d.join('');
    const exp = rawPrice.e ?? 0;
    const normalizedDigits = digits.padEnd(exp + 1, '0');
    const integerPart = normalizedDigits.slice(0, exp + 1) || '0';
    const decimalPart = normalizedDigits.slice(exp + 1);
    const numStr = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    const num = parseFloat(numStr) * sign;
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
};

/**
 * Formats a price value to $XX.XX.
 */
export const formatProductPrice = (rawPrice) => {
  const num = parseProductPrice(rawPrice);
  return `$${num.toFixed(2)}`;
};

/**
 * Normalizes a store product item from the backend for UI components.
 */
export const normalizeStoreProduct = (item) => {
  if (!item) return null;
  const categoryKey = String(item.category || '').toUpperCase();
  const badgeKey =
    STORE_CATEGORY_BADGE_MAP[categoryKey] || 'myStore.badges.artPrints';

  const image =
    resolveMediaUrl(
      item.bannerImage ||
        (Array.isArray(item.images) ? item.images[0] : item.image) ||
        '',
    );

  const images = (
    Array.isArray(item.images)
      ? item.images
      : item.bannerImage
        ? [item.bannerImage]
        : []
  ).map((img) => resolveMediaUrl(typeof img === 'string' ? img : img?.url));

  return {
    id: String(item.id),
    userId: item.userId || item.user?.id,
    category: categoryKey,
    badgeKey,
    title: item.title || 'Untitled Product',
    description: item.description || '',
    price: formatProductPrice(item.price),
    rawPrice: parseProductPrice(item.price),
    setEditionSize: item.setEditionSize || item.edition || '',
    bannerImage: image,
    image,
    images,
    promoted: Boolean(item.isPromoted || item.promoted),
    isActive: item.isActive !== false,
    createdAt: item.createdAt,
    user: item.user
      ? {
          id: item.user.id,
          name: item.user.name || item.user.username || 'Creator',
          username: item.user.username,
          avatar: resolveMediaUrl(item.user.avatar),
        }
      : null,
    raw: item,
  };
};

/**
 * Endpoint: GET /v1/store?category=ART_PRINTS&page=1&limit=10
 */
export const getStoreProductsApi = async ({
  category,
  page = 1,
  limit = 8,
  search,
  userId,
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (category && category.toLowerCase() !== 'all') {
    params.category = category.toUpperCase();
  }
  if (search) {
    params.search = search;
  }
  if (userId) {
    params.userId = userId;
  }

  const response = await apiClient.get('/v1/store', { params });
  const payload = response?.data || response;
  const rawList = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  const meta = payload?.meta || {
    currentPage: page,
    totalPages: 1,
    totalRecords: rawList.length,
    hasNext: false,
    hasPrevious: false,
  };

  return {
    data: rawList.map(normalizeStoreProduct),
    meta: {
      currentPage: Number(meta.currentPage || page),
      totalPages: Number(meta.totalPages || 1),
      totalRecords: Number(meta.totalRecords || rawList.length),
      hasNext: Boolean(meta.hasNext),
      hasPrevious: Boolean(meta.hasPrevious),
    },
  };
};

/**
 * Endpoint: GET /v1/store/:id
 */
export const getStoreProductDetailsApi = async (id) => {
  if (!id) return null;
  const response = await apiClient.get(`/v1/store/${id}`);
  const payload = response?.data || response;
  return normalizeStoreProduct(payload);
};

/**
 * Endpoint: DELETE /v1/store/:id
/**
 * Builds FormData for creating or updating store products.
 * Expected backend fields:
 * - title (Text)
 * - category (Text)
 * - price (Text/Number)
 * - setEditionSize (Text)
 * - description (Text)
 * - copyrightConfirmed (Text 'true'/'false')
 * - bannerImage (File)
 * - images (File or File[])
 */
export const buildStoreProductFormData = (input) => {
  if (typeof FormData !== 'undefined' && input instanceof FormData) {
    return input;
  }

  const formData = new FormData();

  if (input.title != null) formData.append('title', String(input.title).trim());
  if (input.category != null) formData.append('category', String(input.category).trim());
  if (input.price != null) {
    const rawPrice = String(input.price).replace(/[^0-9.]/g, '');
    formData.append('price', rawPrice);
  }
  if (input.setEditionSize != null || input.edition != null) {
    formData.append(
      'setEditionSize',
      String(input.setEditionSize ?? input.edition ?? '').trim(),
    );
  }
  if (input.description != null) {
    formData.append('description', String(input.description).trim());
  }
  formData.append(
    'copyrightConfirmed',
    String(Boolean(input.copyrightConfirmed ?? input.copyrightOk ?? true)),
  );

  if (input.bannerImage instanceof File || input.bannerImage instanceof Blob) {
    formData.append('bannerImage', input.bannerImage);
  }

  if (Array.isArray(input.images)) {
    input.images.forEach((img) => {
      if (img instanceof File || img instanceof Blob) {
        formData.append('images', img);
      }
    });
  } else if (input.images instanceof File || input.images instanceof Blob) {
    formData.append('images', input.images);
  }

  return formData;
};

/**
 * Endpoint: POST /v1/store
 * Receives multipart/form-data
 */
export const createStoreProductApi = async (data) => {
  const payload = buildStoreProductFormData(data);
  const response = await apiClient.post('/v1/store', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data ?? response;
};

/**
 * Endpoint: PUT /v1/store/:id
 * Receives multipart/form-data or JSON
 */
export const updateStoreProductApi = async (id, data) => {
  const payload = buildStoreProductFormData(data);
  const response = await apiClient.put(`/v1/store/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data ?? response;
};

/**
 * Endpoint: DELETE /v1/store/:id
 */
export const deleteStoreProductApi = async (id) => {
  if (!id) return null;
  const response = await apiClient.delete(`/v1/store/${id}`);
  return response?.data ?? response;
};

/**
 * Initiates promotion for a store product listing.
 * Endpoint: POST /v1/store/:id/promote
 *
 * @param {string} productId
 * @param {{ durationDays?: number } | number} payload
 */
export const promoteStoreProductApi = async (productId, payload) => {
  const body =
    typeof payload === 'number'
      ? { durationDays: payload }
      : { durationDays: Number(payload?.durationDays || payload?.days || 7) };

  const response = await apiClient.post(`/v1/store/${productId}/promote`, body);
  if (response?.success === false) {
    const errorMsg =
      response?.error ||
      response?.message ||
      'Failed to create store promotion checkout';
    throw new Error(errorMsg);
  }
  return response;
};

/**
 * Captures PayPal payment for store product promotion.
 * Endpoint: POST /v1/store/promote/capture
 *
 * @param {{ paymentId: string } | string} payload
 */
export const captureStoreProductPromotionPaymentApi = async (payload) => {
  const paymentId =
    typeof payload === 'string'
      ? payload
      : payload?.paymentId || payload?.token;

  const response = await apiClient.post('/v1/store/promote/capture', {
    paymentId,
  });
  if (response?.success === false) {
    const errorMsg =
      response?.error ||
      response?.message ||
      'Failed to capture store promotion payment';
    throw new Error(errorMsg);
  }
  return response;
};
