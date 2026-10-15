import { apiClient } from './client';

export const ARTWORKS_QUERY_KEY = ['artworks'];

const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Fetches single artwork / competition submission details by ID.
 * @param {string} submissionId
 */
export const getArtworkDetailsApi = async (submissionId) => {
  if (!submissionId) return null;
  const response = await apiClient.get(`/v1/artworks/${submissionId}`);
  const data = response?.data || response;
  if (!data) return null;

  const rawImages = data.images;
  let normalizedImages = {};
  if (rawImages && typeof rawImages === 'object') {
    Object.entries(rawImages).forEach(([key, img]) => {
      if (img && typeof img === 'object') {
        normalizedImages[key] = {
          ...img,
          url: resolveMediaUrl(img.url),
          thumbnailUrl: resolveMediaUrl(img.thumbnailUrl || img.url),
        };
      }
    });
  }

  return {
    ...data,
    featuredImage: resolveMediaUrl(data.featuredImage),
    images: normalizedImages,
    user: data.user
      ? {
          ...data.user,
          avatar: resolveMediaUrl(data.user.avatar),
        }
      : null,
    video: data.video
      ? {
          ...data.video,
          url: resolveMediaUrl(data.video.url),
          thumbnailUrl: resolveMediaUrl(data.video.thumbnailUrl),
        }
      : null,
  };
};
