import { API_CONFIG } from '@/shared/config';

/**
 * Backend returns uploaded files as root-relative paths, e.g. `/uploads/x.jpeg`.
 * @param {string | null | undefined} path
 */
export const resolveMediaUrl = (path) => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${API_CONFIG.ORIGIN}/${path.replace(/^\/+/, '')}`;
};

/**
 * Optimizes image URLs (e.g. Unsplash or CDN) by capping width and quality
 * to prevent massive uncompressed bitmaps from stalling GPU/CPU rasterization.
 * @param {string | null | undefined} url
 * @param {number} width
 */
export const optimizeImageUrl = (url, width = 800) => {
  if (!url || typeof url !== 'string') return '';
  const resolved = resolveMediaUrl(url);
  if (resolved.includes('images.unsplash.com')) {
    if (!resolved.includes('?')) {
      return `${resolved}?auto=format&fit=crop&w=${width}&q=80`;
    }
    if (!resolved.includes('w=')) {
      return `${resolved}&w=${width}&q=80`;
    }
  }
  return resolved;
};
