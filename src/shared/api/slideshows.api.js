import { apiClient } from '@/shared/api/client';
import {
  SLIDESHOW_MAX_PHOTOS,
  SLIDESHOW_MIN_PHOTOS,
  SLIDESHOW_TITLE_MAX,
} from '@/shared/data/slideshows';
import { resolveMediaUrl } from '@/shared/utils/media';

/**
 * Profile slideshows API integration.
 *
 * Slideshow shape returned to the UI:
 * `{ id, title, name, photoIds: string[], photos: Photo[], coverImage, itemsCount, createdAt, updatedAt }`
 * where `photos` is in play order and `Photo` is `{ id, mediaId, title, image, url, sourceType?, sortOrder? }`.
 */

export const SLIDESHOWS_QUERY_KEY = ['slideshows'];

const photoById = new Map();

/**
 * Normalizes a raw slideshow object from the backend.
 * @param {object} raw
 * @returns {object}
 */
export const normalizeSlideshow = (raw = {}) => {
  if (!raw) return null;

  const sortedItems = [...(raw.items || [])].sort(
    (a, b) => (a.sortOrder ?? a.order ?? 0) - (b.sortOrder ?? b.order ?? 0),
  );

  const photos = sortedItems.map((item) => {
    const id = String(item.mediaId || item.id || '');
    const resolvedUrl = resolveMediaUrl(item.url);
    const photo = {
      id,
      mediaId: item.mediaId || item.id,
      title: item.title || 'Untitled Image',
      image: resolvedUrl,
      url: resolvedUrl,
      sourceType: item.sourceType,
      sortOrder: item.sortOrder ?? item.order,
    };
    if (id) {
      photoById.set(id, photo);
    }
    return photo;
  });

  const photoIds = photos.map((p) => p.id);
  const title = raw.name || raw.title || 'Untitled Slideshow';
  const user = raw.user
    ? {
        ...raw.user,
        avatar: resolveMediaUrl(raw.user.avatar),
      }
    : null;

  return {
    ...raw,
    id: String(raw.id || ''),
    title,
    name: title,
    photoIds,
    photos,
    user,
    coverImage: resolveMediaUrl(raw.coverImage) || photos[0]?.image || '',
    itemsCount: raw.itemsCount ?? photos.length,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
};

/**
 * Validates local payload before submitting.
 */
const validatePayload = ({ title, photoIds }) => {
  const details = [];
  const trimmedTitle = typeof title === 'string' ? title.trim() : '';
  const ids = Array.isArray(photoIds) ? photoIds : [];

  if (!trimmedTitle) details.push('"title" is required');
  if (trimmedTitle.length > SLIDESHOW_TITLE_MAX) {
    details.push(
      `"title" must be at most ${SLIDESHOW_TITLE_MAX} characters long`,
    );
  }
  if (ids.length < SLIDESHOW_MIN_PHOTOS || ids.length > SLIDESHOW_MAX_PHOTOS) {
    details.push(
      `"photoIds" must contain between ${SLIDESHOW_MIN_PHOTOS} and ${SLIDESHOW_MAX_PHOTOS} photos`,
    );
  }
  if (new Set(ids).size !== ids.length) {
    details.push('"photoIds" must not contain duplicates');
  }

  return { details, title: trimmedTitle, photoIds: ids };
};

/**
 * Fetch member's own slideshows.
 * Backend: `GET /v1/slideshow/me?page=1&limit=50`
 * @param {{ page?: number, limit?: number, username?: string }} [params]
 * @returns {Promise<{ items: object[], meta?: object, user?: object }>}
 */
export const getSlideshowsApi = async (params = {}) => {
  if (params?.username) {
    return getPhotographerSlideshowsApi(params.username, params);
  }

  const page = typeof params?.page === 'number' ? params.page : 1;
  const limit = typeof params?.limit === 'number' ? params.limit : 50;

  const response = await apiClient.get('/v1/slideshow/me', {
    params: { page, limit },
  });

  const rawList =
    response?.data?.slideshows ||
    response?.slideshows ||
    (Array.isArray(response?.data) ? response.data : []) ||
    [];

  const items = rawList.map(normalizeSlideshow);

  return {
    items,
    meta: response?.data?.meta || response?.meta || {},
  };
};

/**
 * Fetch public slideshows for a photographer by username.
 * Backend: `GET /v1/slideshow/user/:username?page=1&limit=50`
 * @param {string} username
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{ items: object[], user?: object, meta?: object }>}
 */
export const getPhotographerSlideshowsApi = async (username, params = {}) => {
  const page = typeof params?.page === 'number' ? params.page : 1;
  const limit = typeof params?.limit === 'number' ? params.limit : 50;

  const response = await apiClient.get(
    `/v1/slideshow/user/${encodeURIComponent(username)}`,
    {
      params: { page, limit },
    },
  );

  const rawList =
    response?.data?.slideshows ||
    response?.slideshows ||
    (Array.isArray(response?.data) ? response.data : []) ||
    [];

  const items = rawList.map(normalizeSlideshow);
  const rawUser = response?.data?.user || response?.user || null;
  const user = rawUser
    ? {
        ...rawUser,
        avatar: resolveMediaUrl(rawUser.avatar),
      }
    : null;

  return {
    items,
    user,
    meta: response?.data?.meta || response?.meta || {},
  };
};

/**
 * Fetch a single slideshow by ID.
 * Backend: `GET /v1/slideshow/:id`
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getSlideshowApi = async (id) => {
  try {
    const response = await apiClient.get(`/v1/slideshow/${id}`);
    const raw =
      response?.data?.slideshow ||
      response?.data ||
      response?.slideshow ||
      response;
    return normalizeSlideshow(raw);
  } catch (error) {
    const list = await getSlideshowsApi();
    const match = list.items.find((item) => item.id === id);
    if (match) return match;
    throw error;
  }
};

/**
 * Photos the user may add to a slideshow: their own uploaded images.
 * Backend: `GET /api/v1/slideshow/my-images?page=1&limit=15`
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{ items: object[], meta?: object }>}
 */
export const getSlideshowSourcePhotosApi = async (params = {}) => {
  const page = typeof params?.page === 'number' ? params.page : 1;
  const limit = typeof params?.limit === 'number' ? params.limit : 15;

  const response = await apiClient.get('/v1/slideshow/my-images', {
    params: { page, limit },
  });

  const rawList =
    response?.data?.images ||
    response?.images ||
    (Array.isArray(response?.data) ? response.data : []) ||
    [];

  const items = rawList.map((img) => {
    const id = String(img.mediaId || img.id || '');
    const resolvedUrl = resolveMediaUrl(img.url);
    const photo = {
      id,
      mediaId: id,
      title: img.title || 'Untitled Image',
      image: resolvedUrl,
      url: resolvedUrl,
      source: img.source,
    };
    if (id) {
      photoById.set(id, photo);
    }
    return photo;
  });

  return {
    items,
    meta: response?.data?.meta || response?.meta || {},
  };
};

/**
 * Create a new slideshow.
 * Backend: `POST /v1/slideshow`
 * Body: `{ name: string, items: [{ mediaId: string, order: number }] }`
 * @param {{ title: string, photoIds: string[] }} payload
 */
export const createSlideshowApi = async (payload) => {
  const { details, title, photoIds } = validatePayload(payload);
  if (details.length) {
    const error = new Error('Validation error');
    error.response = { status: 400, data: { details } };
    throw error;
  }

  const body = {
    name: title,
    items: photoIds.map((mediaId, index) => ({
      mediaId,
      order: index + 1,
    })),
  };

  const response = await apiClient.post('/v1/slideshow', body);
  const raw =
    response?.data?.slideshow ||
    response?.data ||
    response?.slideshow ||
    response;

  return normalizeSlideshow(raw);
};

/**
 * Update an existing slideshow.
 * Backend: `PUT /v1/slideshow/:id` (with fallback to PATCH)
 * @param {{ id: string, payload: { title: string, photoIds: string[] } }} args
 */
export const updateSlideshowApi = async ({ id, payload }) => {
  const { details, title, photoIds } = validatePayload(payload);
  if (details.length) {
    const error = new Error('Validation error');
    error.response = { status: 400, data: { details } };
    throw error;
  }

  const body = {
    name: title,
    items: photoIds.map((mediaId, index) => ({
      mediaId,
      order: index + 1,
    })),
  };

  let response;
  try {
    response = await apiClient.put(`/v1/slideshow/${id}`, body);
  } catch {
    response = await apiClient.patch(`/v1/slideshow/${id}`, body);
  }

  const raw =
    response?.data?.slideshow ||
    response?.data ||
    response?.slideshow ||
    response;

  return normalizeSlideshow(raw);
};

/**
 * Delete a slideshow.
 * Backend: `DELETE /v1/slideshow/:id`
 * @param {string} id
 */
export const deleteSlideshowApi = async (id) => {
  const response = await apiClient.delete(`/v1/slideshow/${id}`);
  return response?.data || { id };
};
