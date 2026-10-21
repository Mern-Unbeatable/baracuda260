import { apiClient } from './client';
import { resolveMediaUrl } from '@/shared/utils/media';

export const ADMIN_PROMOTIONS_QUERY_KEY = ['admin-promotions'];
export const ADMIN_PROMOTION_DETAILS_QUERY_KEY = (id) => [
  'admin-promotion-details',
  id,
];

/**
 * Format ISO date string into readable date (e.g., Oct 14, 2026).
 * @param {string} dateStr
 */
export const formatPromoDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return String(dateStr);
  }
};

/**
 * Format ISO date string into readable time (e.g., 05:47 AM).
 * @param {string} dateStr
 */
export const formatPromoTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

/**
 * Normalizes a single promotion item from GET /v1/admin/promotions.
 * @param {object} p
 */
export const normalizePromotionItem = (p) => {
  if (!p) return null;

  const item = p.item || {};
  const kind = String(item.kind || '').toUpperCase();
  const promotionType = String(
    p.promotionType || item.type || 'ARTWORK',
  ).toUpperCase();

  let typeKey = 'single';
  if (kind === 'TWELVE') {
    typeKey = 'zodiac';
  } else if (kind === 'SIX') {
    typeKey = 'six';
  } else if (kind === 'SINGLE') {
    typeKey = 'single';
  } else if (promotionType === 'PRODUCT') {
    typeKey = 'product';
  } else if (promotionType === 'SELL_PHOTO') {
    typeKey = 'sell_photo';
  } else {
    typeKey = promotionType.toLowerCase();
  }

  const coverUrl = resolveMediaUrl(item.coverImage || item.image);
  const mediaCount = Number(item.mediaCount ?? 1);
  const extraPhotos = mediaCount > 1 ? mediaCount - 1 : null;

  const viewsCount = Number(item.viewsCount ?? 0);
  const likesCount = Number(item.likesCount ?? item.votesCount ?? 0);

  const priceValue =
    item.price ?? (promotionType === 'PRODUCT' ? p.amountPaid : null);
  const formattedPrice =
    priceValue != null ? `$${Number(priceValue).toFixed(2)}` : null;

  const isExpired = Boolean(
    p.isExpired || (p.daysRemaining !== undefined && p.daysRemaining <= 0),
  );
  const isActive = Boolean(p.isActive && !isExpired);

  const itemDate = item.createdAt || p.createdAt || p.startsAt;
  const uploadDate = formatPromoDate(itemDate);
  const uploadTime = formatPromoTime(itemDate);
  const expiryDate = formatPromoDate(p.endsAt);

  return {
    id: p.id,
    promotionId: p.id,
    itemId: item.id || p.id,
    promotionType,
    type: typeKey,
    kind,
    variant: formattedPrice ? 'simple' : 'promoted',
    title: item.title || 'Untitled',
    description: item.story || item.description || '',
    category: item.category || 'General',
    image: coverUrl,
    coverImage: coverUrl,
    extraPhotos,
    mediaCount,
    views: viewsCount.toLocaleString(),
    viewsCount,
    viewsSimple: viewsCount.toLocaleString(),
    hearts: likesCount.toLocaleString(),
    likes: likesCount.toLocaleString(),
    likesCount,
    votesCount: Number(item.votesCount ?? 0),
    price: formattedPrice || `$${Number(p.amountPaid ?? 0).toFixed(2)}`,
    formattedPrice,
    amountPaid: Number(p.amountPaid ?? 0),
    durationDays: p.durationDays,
    startsAt: p.startsAt,
    endsAt: p.endsAt,
    daysRemaining: p.daysRemaining ?? 0,
    isActive,
    isExpired,
    uploadDate,
    uploadTime,
    expiryDate,
    user: p.user
      ? {
          id: p.user.id,
          name: p.user.name || p.user.username || 'User',
          username: p.user.username || '',
          email: p.user.email || '',
          avatar: resolveMediaUrl(p.user.avatar),
        }
      : null,
    raw: p,
  };
};

/**
 * Normalizes full promotion details including user location and media list.
 * @param {object} raw
 */
export const normalizePromotionDetail = (raw) => {
  if (!raw) return null;
  const p = raw.data || raw;
  const item = p.item || {};
  const user = p.user || {};

  const base = normalizePromotionItem(p);
  if (!base) return null;

  const rawMedia = Array.isArray(item.media) ? item.media : [];
  const normalizedMedia = rawMedia.map((m) => ({
    id: m.id,
    submissionId: m.submissionId,
    kind: String(m.kind || 'IMAGE').toUpperCase(),
    slotIndex: m.slotIndex,
    zodiacSign: m.zodiacSign,
    url: resolveMediaUrl(m.url),
    thumbnailUrl: resolveMediaUrl(m.thumbnailUrl || m.url),
    width: m.width,
    height: m.height,
    format: m.format,
    bytes: m.bytes,
    duration: m.duration,
    createdAt: m.createdAt,
  }));

  const userLocation = [user.city, user.country].filter(Boolean).join(', ');

  return {
    ...base,
    user: {
      ...base.user,
      country: user.country || '',
      city: user.city || '',
      location: userLocation,
    },
    item: {
      ...item,
      coverImage: resolveMediaUrl(item.coverImage),
      media: normalizedMedia,
    },
  };
};

/**
 * Fetch promoted items list for admin.
 * GET /api/v1/admin/promotions?type=ALL&status=ALL&page=1&limit=10
 *
 * @param {{
 *   type?: string,
 *   status?: string,
 *   page?: number,
 *   limit?: number,
 * }} params
 */
export const getAdminPromotionsApi = async ({
  type = 'ALL',
  status = 'ALL',
  page = 1,
  limit = 10,
} = {}) => {
  const params = {
    type: String(type || 'ALL').toUpperCase(),
    status: String(status || 'ALL').toUpperCase(),
    page,
    limit,
  };

  const response = await apiClient.get('/v1/admin/promotions', { params });
  const payload = response?.data !== undefined ? response.data : response;

  const rawSummary = payload?.summary || {};
  const summary = {
    totalPromotions: Number(rawSummary?.totalPromotions ?? 0),
    activePromotions: Number(rawSummary?.activePromotions ?? 0),
    expiredPromotions: Number(rawSummary?.expiredPromotions ?? 0),
    totalArtworkPromotions: Number(rawSummary?.totalArtworkPromotions ?? 0),
    totalSellPhotoPromotions: Number(rawSummary?.totalSellPhotoPromotions ?? 0),
    totalRevenue: Number(rawSummary?.totalRevenue ?? 0),
  };

  const rawList = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  const rawMeta = payload?.meta || response?.meta || {};
  const meta = {
    currentPage: Number(rawMeta?.currentPage ?? page),
    totalPages: Math.max(1, Number(rawMeta?.totalPages ?? 1)),
    totalRecords: Number(rawMeta?.totalRecords ?? rawList.length),
    hasNext: Boolean(rawMeta?.hasNext),
    hasPrevious: Boolean(rawMeta?.hasPrevious),
  };

  const items = rawList.map(normalizePromotionItem).filter(Boolean);

  return {
    summary,
    items,
    data: items,
    meta,
  };
};

/**
 * Fetch promotion details by ID for admin.
 * GET /api/v1/admin/promotions/:id
 *
 * @param {string} id
 */
export const getAdminPromotionDetailsApi = async (id) => {
  if (!id) return null;
  const cleanId = String(id).trim();
  const response = await apiClient.get(`/v1/admin/promotions/${cleanId}`);
  const payload = response?.data !== undefined ? response.data : response;
  return normalizePromotionDetail(payload);
};
