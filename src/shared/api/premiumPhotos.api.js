import { API_CONFIG } from '@/shared/config';
import { BUY_PHOTO_DEFAULT_SPECS } from '@/shared/data/buyPhotos';
import { GALLERY_DETAIL_ASSETS } from '@/shared/data/galleryDetail';
import { SIX_STORY_SLIDES } from '@/shared/data/gallerySixStory';
import { SIX_BLUE_STORY_SLIDES } from '@/shared/data/gallerySixStoryBlue';
import { TWELVE_STORY_SLIDES } from '@/shared/data/galleryTwelveStory';
import { apiClient } from './client';

export const ADMIN_PREMIUM_PHOTOS_QUERY_KEY = ['admin-premium-photos'];
export const MARKETPLACE_PREMIUM_PHOTOS_QUERY_KEY = (params = {}) => [
  'marketplace-premium-photos',
  params,
];
export const MARKETPLACE_PREMIUM_PHOTO_DETAIL_QUERY_KEY = (id) => [
  'marketplace-premium-photo-detail',
  id,
];
export const MY_PURCHASES_STATS_QUERY_KEY = ['my-purchases-stats'];
export const MY_PURCHASES_QUERY_KEY = (params = {}) => ['my-purchases', params];
export const PUBLIC_PREMIUM_PHOTOS_QUERY_KEY = ['public-premium-photos'];
export const PUBLIC_PREMIUM_PHOTO_DETAIL_QUERY_KEY = (id) => [
  'public-premium-photo-detail',
  id,
];

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

/**
 * Normalizes price to GBP string format (e.g. "5.00").
 * @param {string | number} rawPrice
 * @returns {string}
 */
export const formatPriceForMarketplace = (rawPrice) => {
  if (typeof rawPrice === 'number') {
    return rawPrice.toFixed(2);
  }
  if (!rawPrice) return '5.00';
  const cleaned = String(rawPrice).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? '5.00' : num.toFixed(2);
};

/**
 * Post a photo or album for sale on the marketplace.
 * Endpoint: POST /v1/marketplace/premium-photos
 * Receives multipart/form-data:
 * - kind: 'SINGLE' | 'SIX' | 'TWELVE'
 * - title: string
 * - price: string (price in GBP, e.g. "5.00")
 * - isAiGenerated: 'true' | 'false'
 * - copyrightConfirmed: 'true' | 'false'
 * - resolution: string
 * - quality: string
 * - categoryId: string (UUID)
 * - subcategoryId: string (UUID)
 * - images: File | File[] (1 file for SINGLE, 6 for SIX, 12 for TWELVE)
 * - video?: File (optional)
 * - zodiacSign?: string (e.g. 'ARIES' for SINGLE)
 * - theme?: string ('RED' | 'BLUE' for SIX, 'FULL' for TWELVE)
 * - zodiacSigns?: string (JSON array string for TWELVE)
 *
 * @param {FormData | object} payload
 */
export const createMarketplacePremiumPhotoApi = async (payload) => {
  let formData;

  if (payload instanceof FormData) {
    formData = payload;
  } else {
    formData = new FormData();
    const kind = String(payload.kind || 'SINGLE').toUpperCase();
    formData.append('kind', kind);

    if (payload.title) {
      formData.append('title', payload.title);
    }
    const priceStr = formatPriceForMarketplace(payload.price);
    formData.append('price', priceStr);

    formData.append('isAiGenerated', String(Boolean(payload.isAiGenerated)));
    formData.append(
      'copyrightConfirmed',
      String(payload.copyrightConfirmed !== false),
    );
    formData.append('resolution', payload.resolution || '60000x60000');
    formData.append('quality', payload.quality || '4K');

    if (payload.categoryId) {
      formData.append('categoryId', payload.categoryId);
    }
    if (payload.subcategoryId) {
      formData.append('subcategoryId', payload.subcategoryId);
    }

    if (kind === 'SINGLE') {
      if (payload.zodiacSign) {
        formData.append('zodiacSign', String(payload.zodiacSign).toUpperCase());
      }
    } else if (kind === 'SIX') {
      const theme = payload.theme ? String(payload.theme).toUpperCase() : 'RED';
      formData.append('theme', theme);
    } else if (kind === 'TWELVE') {
      formData.append(
        'theme',
        payload.theme ? String(payload.theme).toUpperCase() : 'FULL',
      );
      const signs = Array.isArray(payload.zodiacSigns)
        ? JSON.stringify(payload.zodiacSigns)
        : payload.zodiacSigns ||
          JSON.stringify([
            'ARIES',
            'TAURUS',
            'GEMINI',
            'CANCER',
            'LEO',
            'VIRGO',
            'LIBRA',
            'SCORPIO',
            'SAGITTARIUS',
            'CAPRICORN',
            'AQUARIUS',
            'PISCES',
          ]);
      formData.append('zodiacSigns', signs);
    }

    if (Array.isArray(payload.images)) {
      payload.images.forEach((file) => {
        if (file) formData.append('images', file);
      });
    } else if (payload.images) {
      formData.append('images', payload.images);
    }

    if (payload.video) {
      formData.append('video', payload.video);
    }
  }

  const response = await apiClient.post(
    '/v1/marketplace/premium-photos',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response?.data ?? response;
};

export const formatMarketplacePrice = (rawPrice) => {
  if (rawPrice == null || rawPrice === '') return '£0.00';
  const num = Number(rawPrice);
  if (isNaN(num)) return String(rawPrice);
  return `£${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)}`;
};

const mapKindToBadge = (kind) => {
  const norm = String(kind || 'SINGLE').toUpperCase();
  if (norm === 'TWELVE') return '12 photos - full Zodiac Story';
  if (norm === 'SIX') return '6 Photos Story';
  return 'Single Photo';
};

const mapKindToVariant = (kind, theme) => {
  const norm = String(kind || 'SINGLE').toUpperCase();
  if (norm === 'TWELVE') return 'twelve';
  if (norm === 'SIX') {
    return String(theme || '').toUpperCase() === 'BLUE' ? 'sixBlue' : 'six';
  }
  return 'single';
};

export const extractImagesList = (rawImages) => {
  if (!rawImages) return [];
  if (Array.isArray(rawImages)) {
    return rawImages.map((img, idx) => ({
      slotIndex: img?.slotIndex ?? idx,
      ...img,
      url: resolveMediaUrl(img?.url || img),
    }));
  }
  if (typeof rawImages === 'object') {
    return Object.values(rawImages)
      .filter(Boolean)
      .sort((a, b) => Number(a.slotIndex ?? 0) - Number(b.slotIndex ?? 0))
      .map((img, idx) => ({
        slotIndex: img?.slotIndex ?? idx,
        ...img,
        url: resolveMediaUrl(img?.url || img),
      }));
  }
  return [];
};

/**
 * Normalizes details payload from GET /v1/marketplace/premium-photos/:id
 */
export const normalizeMarketplaceDetail = (item) => {
  if (!item) return null;

  const rawKind = String(item.kind || 'SINGLE').toUpperCase();
  const variant = mapKindToVariant(rawKind, item.theme);
  const badge = mapKindToBadge(rawKind);

  const imagesList = extractImagesList(item.images);
  const coverUrl =
    imagesList[0]?.url || resolveMediaUrl(item.coverImage || item.image || '');

  const videoUrl = item.video?.url ? resolveMediaUrl(item.video.url) : null;

  const createdDate = item.createdAt ? new Date(item.createdAt) : null;
  const formattedDate = createdDate
    ? createdDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const priceNum = Number(item.price ?? 0);
  const formattedPrice = formatMarketplacePrice(priceNum);

  let slides = [];
  if (variant === 'six') {
    slides = SIX_STORY_SLIDES.map((slide, index) => {
      const imgUrl =
        imagesList[index]?.url || (index === 0 ? coverUrl : slide.hero);
      return {
        ...slide,
        hero: imgUrl,
        thumb: imgUrl,
      };
    });
  } else if (variant === 'sixBlue') {
    slides = SIX_BLUE_STORY_SLIDES.map((slide, index) => {
      const imgUrl =
        imagesList[index]?.url || (index === 0 ? coverUrl : slide.hero);
      return {
        ...slide,
        hero: imgUrl,
        thumb: imgUrl,
      };
    });
  } else if (variant === 'twelve') {
    slides = TWELVE_STORY_SLIDES.map((slide, index) => {
      const imgUrl =
        imagesList[index]?.url || (index === 0 ? coverUrl : slide.hero);
      return {
        ...slide,
        hero: imgUrl,
        thumb: imgUrl,
      };
    });
  } else {
    slides = [
      {
        id: 'main',
        hero: coverUrl,
        thumb: coverUrl,
        sign: item.zodiacSign || 'Aries',
        icon: GALLERY_DETAIL_ASSETS.aries,
        number: '1',
        theme: 'red',
      },
    ];
  }

  const categoryName =
    item.category?.name || item.category?.slug || 'Astrophotography';

  return {
    id: item.id,
    userId: item.userId,
    submissionId: item.submissionId,
    title: item.title || 'Untitled Photo',
    story: item.story || item.description || '',
    description: item.story || item.description || '',
    image: coverUrl,
    coverImage: coverUrl,
    images: imagesList,
    video: videoUrl ? { ...item.video, url: videoUrl } : null,
    videoSrc: videoUrl,
    videoPoster: coverUrl,
    kind: rawKind,
    variant,
    badge,
    albumBadge: badge,
    slides,
    category: categoryName,
    price: `$${priceNum.toFixed(2)}`,
    priceAmount: priceNum,
    rawPrice: priceNum,
    resolution: item.resolution || BUY_PHOTO_DEFAULT_SPECS.resolution,
    format:
      item.format || imagesList[0]?.format || BUY_PHOTO_DEFAULT_SPECS.format,
    camera: item.camera || BUY_PHOTO_DEFAULT_SPECS.camera,
    quality: item.quality || '4K',
    license: item.license || BUY_PHOTO_LICENSE,
    zodiacSign: item.zodiacSign || null,
    isAiGenerated: Boolean(item.isAiGenerated),
    copyrightConfirmed: Boolean(item.copyrightConfirmed),
    bytes: imagesList[0]?.bytes || item.bytes || null,
    likesCount: Number(item.likesCount ?? 0),
    likesMetric: Number(item.likesCount ?? 0).toLocaleString(),
    hearts: Number(item.likesCount ?? 0).toLocaleString(),
    likes: Number(item.likesCount ?? 0),
    votes: Number(item.likesCount ?? 0),
    viewsCount: Number(item.viewsCount ?? 0),
    viewsMetric: Number(item.viewsCount ?? 0).toLocaleString(),
    views: Number(item.viewsCount ?? 0),
    totalSellMetric: Number(item.totalSales ?? 0).toLocaleString(),
    totalSales: Number(item.totalSales ?? 0),
    isLiked: Boolean(item.isLiked),
    isSaved: Boolean(item.isSaved),
    expiryDate: item.expiryDate || null,
    uploadedDate: formattedDate,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    user: item.user,
    author: item.user
      ? {
          id: item.user.id,
          name: item.user.name || 'Photographer',
          avatar: resolveMediaUrl(item.user.avatar),
          followers: item.user._count?.followers ?? 0,
          following: item.user._count?.following ?? 0,
        }
      : null,
    avatar: item.user?.avatar ? resolveMediaUrl(item.user.avatar) : null,
    photographer: item.user?.name || 'Photographer',
    promoted: Array.isArray(item.promotions) && item.promotions.length > 0,
    raw: item,
  };
};

/**
 * Fetches marketplace premium photos list.
 * Endpoint: GET /v1/marketplace/premium-photos?kind=ALL&page=1&limit=10&username={{username}}
 *
 * @param {{
 *   kind?: string,
 *   page?: number,
 *   limit?: number,
 *   username?: string,
 * }} [params]
 */
export const getMarketplacePremiumPhotosApi = async ({
  kind = 'ALL',
  page = 1,
  limit = 10,
  username,
} = {}) => {
  const queryParams = {
    page,
    limit,
  };
  if (kind) {
    queryParams.kind = kind;
  }
  if (username) {
    queryParams.username = username;
  }

  const response = await apiClient.get('/v1/marketplace/premium-photos', {
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
    const imagesList = extractImagesList(item.images);
    const coverUrl =
      imagesList[0]?.url ||
      resolveMediaUrl(item.coverImage || item.image || '');

    const videoUrl = item.video?.url ? resolveMediaUrl(item.video.url) : null;
    const albumBadge = mapKindToBadge(rawKind);
    const variant = mapKindToVariant(rawKind, item.theme);

    const createdDate = item.createdAt ? new Date(item.createdAt) : null;
    const formattedDate = createdDate
      ? createdDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

    const priceNum = Number(item.price ?? 0);
    const formattedPrice = formatMarketplacePrice(priceNum);
    const extraPhotoCount =
      imagesList.length > 1 ? imagesList.length - 1 : null;

    return {
      id: item.id || `premium-photo-${idx}`,
      kind: rawKind,
      variant,
      albumBadge,
      badge: albumBadge,
      title: item.title || 'Untitled Photo',
      story: item.story || item.description || '',
      description: item.story || item.description || '',
      image: coverUrl,
      coverImage: coverUrl,
      images: imagesList,
      video: videoUrl ? { ...item.video, url: videoUrl } : null,
      viewsCount: Number(item.viewsCount ?? 0),
      views: Number(item.viewsCount ?? 0).toLocaleString(),
      likesCount: Number(item.likesCount ?? 0),
      hearts: Number(item.likesCount ?? 0).toLocaleString(),
      likes: Number(item.likesCount ?? 0).toLocaleString(),
      votes: Number(item.likesCount ?? 0).toLocaleString(),
      price: formattedPrice,
      rawPrice: priceNum,
      extraPhotoCount,
      extraPhotosLabel:
        extraPhotoCount != null ? String(extraPhotoCount) : undefined,
      uploadedDate: formattedDate,
      date: formattedDate,
      createdAt: item.createdAt,
      promoted: Array.isArray(item.promotions) && item.promotions.length > 0,
      raw: item,
    };
  });

  return {
    data,
    meta,
  };
};

/**
 * Fetches details for a single premium photo.
 * Endpoint: GET /v1/marketplace/premium-photos/:id
 *
 * @param {string} id
 */
export const getMarketplacePremiumPhotoDetailsApi = async (id) => {
  const response = await apiClient.get(`/v1/marketplace/premium-photos/${id}`);
  const payload = response?.data !== undefined ? response.data : response;
  const item = payload?.data || payload;
  return normalizeMarketplaceDetail(item);
};

/**
 * Normalizes an item from GET /api/v1/marketplace/public/premium-photos
 */
export const normalizePublicPremiumPhoto = (item, idx = 0) => {
  if (!item) return null;
  const rawKind = String(item.kind || 'SINGLE').toUpperCase();
  const badge = mapKindToBadge(rawKind);
  const imagesList = extractImagesList(item.images);
  const coverUrl =
    imagesList[0]?.url || resolveMediaUrl(item.coverImage || item.image || '');
  const videoUrl = item.video?.url ? resolveMediaUrl(item.video.url) : null;
  const priceNum = Number(item.price ?? 0);
  const priceLabel = `$${priceNum.toFixed(2)}`;

  let extraPhotosLabel;
  if (rawKind === 'SIX') {
    extraPhotosLabel = '+5 Photos';
  } else if (rawKind === 'TWELVE') {
    extraPhotosLabel = '+11 Photos';
  }

  const createdDate = item.createdAt ? new Date(item.createdAt) : null;
  const formattedDate = createdDate
    ? createdDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return {
    id: item.id || `public-premium-photo-${idx}`,
    href: `/buy-photos/${item.id}`,
    title: item.title || 'Untitled Photo',
    description: item.story || item.description || '',
    story: item.story || item.description || '',
    image: coverUrl,
    coverImage: coverUrl,
    videoUrl,
    images: imagesList,
    video: videoUrl ? { ...item.video, url: videoUrl } : null,
    kind: rawKind,
    badge,
    price: priceLabel,
    priceAmount: priceNum,
    extraPhotosLabel,
    likes: Number(item.likesCount ?? 0),
    views: Number(item.viewsCount ?? 0),
    date: formattedDate,
    category: item.category?.name || 'Nature',
    author: item.user
      ? {
          id: item.user.id,
          name: item.user.name || 'Photographer',
          avatar: resolveMediaUrl(item.user.avatar),
        }
      : null,
    photographer: item.user?.name || 'Photographer',
    isAiGenerated: Boolean(item.isAiGenerated),
    raw: item,
  };
};

/**
 * Fetches public premium photos list with filtering for /buy-photos page.
 * Endpoint: GET /v1/marketplace/public/premium-photos
 *
 * @param {{
 *   kind?: string,
 *   page?: number,
 *   limit?: number,
 *   search?: string,
 *   categoryId?: string,
 *   subcategoryId?: string,
 * }} [params]
 */
export const getPublicPremiumPhotosApi = async ({
  kind,
  page = 1,
  limit = 10,
  search,
  categoryId,
  subcategoryId,
} = {}) => {
  const queryParams = {
    page,
    limit,
  };
  if (kind && kind !== 'ALL') {
    queryParams.kind = String(kind).toUpperCase();
  }
  if (search && String(search).trim()) {
    queryParams.search = String(search).trim();
  }
  if (categoryId) {
    queryParams.categoryId = categoryId;
  }
  if (subcategoryId) {
    queryParams.subcategoryId = subcategoryId;
  }

  const response = await apiClient.get(
    '/v1/marketplace/public/premium-photos',
    {
      params: queryParams,
    },
  );

  const payload = response?.data !== undefined ? response.data : response;
  const innerData = payload?.data !== undefined ? payload.data : payload;

  const rawList = Array.isArray(innerData?.data)
    ? innerData.data
    : Array.isArray(innerData)
      ? innerData
      : Array.isArray(payload)
        ? payload
        : [];

  const rawMeta = innerData?.meta || payload?.meta || response?.meta;
  const meta = {
    currentPage: rawMeta?.currentPage ?? page,
    totalPages: rawMeta?.totalPages ?? 1,
    totalRecords: rawMeta?.totalRecords ?? rawList.length,
    hasNext: Boolean(rawMeta?.hasNext),
    hasPrevious: Boolean(rawMeta?.hasPrevious),
  };

  const data = rawList.map(normalizePublicPremiumPhoto);

  return {
    data,
    meta,
  };
};

/**
 * Fetches public premium photo details by ID.
 * Endpoint: GET /v1/marketplace/public/premium-photos/:id
 *
 * @param {string} id
 */
export const getPublicPremiumPhotoDetailsApi = async (id) => {
  const response = await apiClient.get(
    `/v1/marketplace/public/premium-photos/${id}`,
  );
  const payload = response?.data !== undefined ? response.data : response;
  const item = payload?.data || payload;
  return normalizeMarketplaceDetail(item);
};

/**
 * Updates a marketplace premium photo listing.
 * Endpoint: PUT /v1/marketplace/premium-photos/:id
 *
 * @param {string} id
 * @param {FormData | object} payload
 */
export const updateMarketplacePremiumPhotoApi = async (id, payload) => {
  let formData;
  if (payload instanceof FormData) {
    formData = payload;
  } else {
    formData = new FormData();
    if (payload.kind) {
      formData.append('kind', String(payload.kind).toUpperCase());
    }
    if (payload.title !== undefined) {
      formData.append('title', payload.title);
    }
    if (payload.price !== undefined) {
      formData.append('price', formatPriceForMarketplace(payload.price));
    }
    if (payload.isAiGenerated !== undefined) {
      formData.append('isAiGenerated', String(Boolean(payload.isAiGenerated)));
    }
    if (payload.copyrightConfirmed !== undefined) {
      formData.append(
        'copyrightConfirmed',
        String(payload.copyrightConfirmed !== false),
      );
    }
    if (payload.resolution !== undefined) {
      formData.append('resolution', payload.resolution || '60000x60000');
    }
    if (payload.quality !== undefined) {
      formData.append('quality', payload.quality || '4K');
    }
    if (payload.categoryId) {
      formData.append('categoryId', payload.categoryId);
    }
    if (payload.subcategoryId) {
      formData.append('subcategoryId', payload.subcategoryId);
    }
    if (payload.story !== undefined) {
      formData.append('story', payload.story || '');
    }
    if (payload.zodiacSign) {
      formData.append('zodiacSign', String(payload.zodiacSign).toUpperCase());
    }
    if (payload.theme) {
      formData.append('theme', String(payload.theme).toUpperCase());
    }
    if (payload.zodiacSigns) {
      const signs = Array.isArray(payload.zodiacSigns)
        ? JSON.stringify(payload.zodiacSigns)
        : payload.zodiacSigns;
      formData.append('zodiacSigns', signs);
    }
    if (Array.isArray(payload.images)) {
      payload.images.forEach((file) => {
        if (file instanceof File) formData.append('images', file);
      });
    } else if (payload.images instanceof File) {
      formData.append('images', payload.images);
    }
    if (payload.video instanceof File) {
      formData.append('video', payload.video);
    }
  }

  const response = await apiClient.put(
    `/v1/marketplace/premium-photos/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response?.data ?? response;
};

/**
 * Deletes a marketplace premium photo listing.
 * Endpoint: DELETE /v1/marketplace/premium-photos/:id
 *
 * @param {string} id
 */
export const deleteMarketplacePremiumPhotoApi = async (id) => {
  const response = await apiClient.delete(
    `/v1/marketplace/premium-photos/${id}`,
  );
  return response?.data ?? response;
};

/**
 * Initiates promotion for a marketplace premium photo listing.
 * Endpoint: POST /v1/marketplace/premium-photos/:id/promote
 *
 * @param {string} photoId
 * @param {{ durationDays?: number } | number} payload
 */
export const promoteMarketplacePremiumPhotoApi = async (photoId, payload) => {
  const body =
    typeof payload === 'number'
      ? { durationDays: payload }
      : { durationDays: Number(payload?.durationDays || 7) };

  const response = await apiClient.post(
    `/v1/marketplace/premium-photos/${photoId}/promote`,
    body,
  );
  if (response?.success === false) {
    const errorMsg =
      response?.error ||
      response?.message ||
      'Failed to create promotion checkout';
    throw new Error(errorMsg);
  }
  return response;
};

/**
 * Captures PayPal payment for premium photo promotion.
 * Endpoint: POST /v1/marketplace/premium-photos/promote/capture
 *
 * @param {{ paymentId: string } | string} payload
 */
export const captureMarketplacePremiumPhotoPromotionPaymentApi = async (
  payload,
) => {
  const paymentId =
    typeof payload === 'string'
      ? payload
      : payload?.paymentId || payload?.token;

  const response = await apiClient.post(
    '/v1/marketplace/premium-photos/promote/capture',
    { paymentId },
  );
  if (response?.success === false) {
    const errorMsg =
      response?.error ||
      response?.message ||
      'Failed to capture promotion payment';
    throw new Error(errorMsg);
  }
  return response;
};

/**
 * Parses purchase price safely from either decimal.js object, string, or number.
 * E.g. { s: 1, e: 1, d: [30] } -> 30, { s: 1, e: 0, d: [7, 5000000] } -> 7.5
 *
 * @param {any} priceObj
 * @param {any} [fallbackPrice]
 * @returns {number}
 */
export const parsePurchasePrice = (priceObj, fallbackPrice) => {
  if (typeof priceObj === 'number') return priceObj;
  if (typeof priceObj === 'string') {
    const num = parseFloat(priceObj);
    if (!isNaN(num)) return num;
  }
  if (priceObj && typeof priceObj === 'object') {
    if (typeof fallbackPrice === 'number') return fallbackPrice;
    if (
      typeof fallbackPrice === 'string' &&
      !isNaN(parseFloat(fallbackPrice))
    ) {
      return parseFloat(fallbackPrice);
    }
    if (Array.isArray(priceObj.d) && typeof priceObj.e === 'number') {
      try {
        const sign = priceObj.s === -1 ? -1 : 1;
        const joined = priceObj.d.join('');
        const exp = priceObj.e + 1;
        let str;
        if (exp >= joined.length) {
          str = joined + '0'.repeat(exp - joined.length);
        } else if (exp <= 0) {
          str = '0.' + '0'.repeat(-exp) + joined;
        } else {
          str = joined.slice(0, exp) + '.' + joined.slice(exp);
        }
        const val = parseFloat(str) * sign;
        if (!isNaN(val)) return val;
      } catch {
        // fallback
      }
    }
  }
  if (typeof fallbackPrice === 'number') return fallbackPrice;
  if (typeof fallbackPrice === 'string' && !isNaN(parseFloat(fallbackPrice))) {
    return parseFloat(fallbackPrice);
  }
  return 0;
};

/**
 * Fetches buyer purchase stats (total purchases, total spent, available downloads).
 * Endpoint: GET /v1/marketplace/my-purchases/stats
 */
export const getMyPurchasesStatsApi = async () => {
  const response = await apiClient.get('/v1/marketplace/my-purchases/stats');
  const payload = response?.data !== undefined ? response.data : response;
  return payload?.data || payload;
};

/**
 * Fetches buyer purchased photos with pagination.
 * Endpoint: GET /v1/marketplace/my-purchases?page=1&limit=6
 *
 * @param {{ page?: number, limit?: number }} [params]
 */
export const getMyPurchasesApi = async ({ page = 1, limit = 8 } = {}) => {
  const response = await apiClient.get('/v1/marketplace/my-purchases', {
    params: { page, limit },
  });
  const payload = response?.data !== undefined ? response.data : response;
  const rawList = Array.isArray(payload?.data?.data)
    ? payload.data.data
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

  const rawMeta = payload?.data?.meta || payload?.meta;
  const meta = {
    currentPage: rawMeta?.currentPage ?? page,
    totalPages: rawMeta?.totalPages ?? 1,
    totalRecords: rawMeta?.totalRecords ?? rawList.length,
    hasNext: Boolean(rawMeta?.hasNext),
    hasPrevious: Boolean(rawMeta?.hasPrevious),
  };

  return {
    data: rawList,
    meta,
  };
};

/**
 * Downloads a file from a URL to the client.
 *
 * @param {string} fileUrl
 * @param {string} defaultFilename
 */
export const triggerFileDownload = async (
  fileUrl,
  defaultFilename = 'photo',
) => {
  try {
    const resolvedUrl = resolveMediaUrl(fileUrl);
    const res = await fetch(resolvedUrl);
    if (!res.ok) throw new Error('Fetch failed');
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    const ext = resolvedUrl.split('.').pop()?.split(/[?#]/)[0] || 'jpg';
    link.download = defaultFilename.includes('.')
      ? defaultFilename
      : `${defaultFilename}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(fileUrl, '_blank');
  }
};

/**
 * Downloads a purchased marketplace premium photo using the download endpoint.
 * Endpoint: GET /v1/marketplace/premium-photos/:premiumPhotoId/download
 *
 * Supports both direct binary stream downloads and JSON responses with downloadUrl.
 *
 * @param {string} premiumPhotoId
 * @param {string} [filename]
 */
export const downloadMarketplacePremiumPhotoApi = async (
  premiumPhotoId,
  filename = 'photo',
) => {
  const token = localStorage.getItem('token');
  const endpoint = `${API_CONFIG.BASE_URL}/v1/marketplace/premium-photos/${premiumPhotoId}/download`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: 'application/json, image/*, */*',
    },
  });

  if (!response.ok) {
    let errorMsg = 'Failed to download photo';
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errJson.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  const contentType = response.headers.get('content-type') || '';

  // If response is JSON, extract URL
  if (contentType.includes('application/json')) {
    const json = await response.json();
    const downloadUrl =
      (typeof json?.data === 'string' ? json.data : null) ||
      json?.data?.downloadUrl ||
      json?.data?.url ||
      json?.data?.fileUrl ||
      json?.data?.photoUrl ||
      json?.downloadUrl ||
      json?.url;

    if (downloadUrl) {
      await triggerFileDownload(downloadUrl, filename);
      return { success: true, url: downloadUrl };
    }
    return json;
  }

  // If response is direct binary stream / attachment
  const blob = await response.blob();
  const contentDisposition = response.headers.get('content-disposition');
  let resolvedFilename = filename;
  if (contentDisposition && contentDisposition.includes('filename=')) {
    const match = contentDisposition.match(
      /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
    );
    if (match && match[1]) {
      resolvedFilename = match[1].replace(/['"]/g, '').trim();
    }
  } else {
    const mimeExt = contentType
      .split('/')[1]
      ?.split(';')[0]
      ?.replace('jpeg', 'jpg');
    if (mimeExt && !resolvedFilename.includes('.')) {
      resolvedFilename = `${resolvedFilename}.${mimeExt}`;
    }
  }

  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = resolvedFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);

  return { success: true };
};
