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
