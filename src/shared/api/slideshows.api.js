import {
  MOCK_SINGLE_PHOTOS,
  MOCK_SLIDESHOWS_SEED,
} from '@/shared/data/slideshowMockData';
import {
  SLIDESHOW_MAX_PHOTOS,
  SLIDESHOW_MIN_PHOTOS,
  SLIDESHOW_TITLE_MAX,
} from '@/shared/data/slideshows';

/**
 * Profile slideshows — MOCK implementation.
 *
 * The backend doesn't exist yet, so every function below resolves against an
 * in-browser store (persisted to localStorage so created slideshows survive a
 * reload). Each function documents the endpoint it should call; when the API
 * is ready, replace the body with the `apiClient` call and keep the return
 * shape, and nothing else in the app has to change.
 *
 * Slideshow shape returned to the UI:
 * `{ id, title, photoIds: string[], photos: Photo[], createdAt, updatedAt }`
 * where `photos` is in play order and `Photo` is `{ id, title, image, isAiGenerated? }`.
 */

export const SLIDESHOWS_QUERY_KEY = ['slideshows'];

const STORAGE_KEY = 'my12photos.mock.slideshows';
const MOCK_LATENCY_MS = 350;

const photoById = new Map(MOCK_SINGLE_PHOTOS.map((photo) => [photo.id, photo]));

const respond = (value) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(value)), MOCK_LATENCY_MS);
  });

/** Rejects with the same shape axios gives us, so `getApiErrorMessage` works unchanged. */
const reject = (status, error, details = []) =>
  new Promise((_, rejectPromise) => {
    setTimeout(() => {
      rejectPromise({
        message: error,
        response: { status, data: { success: false, error, details } },
      });
    }, MOCK_LATENCY_MS);
  });

const readStore = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {
    // Corrupt or unavailable storage: fall back to the seed data.
  }
  return structuredClone(MOCK_SLIDESHOWS_SEED);
};

const writeStore = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Storage full or blocked: changes last until the page reloads.
  }
};

let store = readStore();

const toSlideshow = (record) => ({
  ...record,
  photos: record.photoIds.map((id) => photoById.get(id)).filter(Boolean),
});

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
  if (ids.some((id) => !photoById.has(id))) {
    details.push('"photoIds" may only contain your own single photos');
  }

  return { details, title: trimmedTitle, photoIds: ids };
};

/**
 * Backend: `GET /v1/users/:userId/slideshows` (or `GET /v1/slideshows?userId=`).
 * @param {{ userId?: string }} [_params]
 * @returns {Promise<{ items: object[] }>}
 */
export const getSlideshowsApi = (_params = {}) =>
  respond({
    items: [...store]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(toSlideshow),
  });

/**
 * Backend: `GET /v1/slideshows/:id`
 * @param {string} id
 */
export const getSlideshowApi = (id) => {
  const record = store.find((item) => item.id === id);
  return record
    ? respond(toSlideshow(record))
    : reject(404, 'Slideshow not found');
};

/**
 * Photos the user may add to a slideshow: their own approved single photos.
 * Backend: `GET /v1/users/me/photos?albumType=SINGLE&status=approved`
 * @returns {Promise<{ items: object[] }>}
 */
export const getSlideshowSourcePhotosApi = () =>
  respond({ items: MOCK_SINGLE_PHOTOS });

/**
 * Backend: `POST /v1/slideshows` with `{ title, photoIds }` (array order = play order).
 * @param {{ title: string, photoIds: string[] }} payload
 */
export const createSlideshowApi = (payload) => {
  const { details, title, photoIds } = validatePayload(payload);
  if (details.length) return reject(400, 'Validation error', details);

  const now = new Date().toISOString();
  const record = {
    id: `slideshow-${Date.now().toString(36)}`,
    title,
    photoIds,
    createdAt: now,
    updatedAt: now,
  };
  store = [record, ...store];
  writeStore(store);
  return respond(toSlideshow(record));
};

/**
 * Backend: `PATCH /v1/slideshows/:id` with `{ title, photoIds }`.
 * @param {{ id: string, payload: { title: string, photoIds: string[] } }} args
 */
export const updateSlideshowApi = ({ id, payload }) => {
  const index = store.findIndex((item) => item.id === id);
  if (index === -1) return reject(404, 'Slideshow not found');

  const { details, title, photoIds } = validatePayload(payload);
  if (details.length) return reject(400, 'Validation error', details);

  const record = {
    ...store[index],
    title,
    photoIds,
    updatedAt: new Date().toISOString(),
  };
  store = store.map((item, i) => (i === index ? record : item));
  writeStore(store);
  return respond(toSlideshow(record));
};

/**
 * Backend: `DELETE /v1/slideshows/:id` (deletes the album only, never the photos).
 * @param {string} id
 */
export const deleteSlideshowApi = (id) => {
  if (!store.some((item) => item.id === id)) {
    return reject(404, 'Slideshow not found');
  }
  store = store.filter((item) => item.id !== id);
  writeStore(store);
  return respond({ id });
};
