import { API_CONFIG } from '@/shared/config';

/**
 * Backend returns uploaded files as root-relative paths, e.g. `/uploads/x.jpeg`.
 * @param {string | null | undefined} path
 */
export const resolveMediaUrl = (path) => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const cleaned = String(path).replace(/^\/+/, '');
  // Encode path segments so filenames with spaces/special chars load as absolute URLs
  const encoded = cleaned
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${API_CONFIG.ORIGIN}/${encoded}`;
};

/**
 * Optimizes image URLs by capping display width.
 * Prevents full-resolution uploads from being decoded into huge bitmaps
 * (main cause of laggy scrolling on favourite-photos / gallery grids).
 *
 * - Unsplash: native w=/q= query params
 * - /uploads: backend sharp resize via ?w=
 *
 * @param {string | null | undefined} url
 * @param {number} width
 */
export const optimizeImageUrl = (url, width = 800) => {
  if (!url || typeof url !== 'string') return '';
  const resolved = resolveMediaUrl(url);
  if (!resolved) return '';

  const safeWidth = Math.min(Math.max(Number(width) || 800, 32), 1600);

  if (resolved.includes('images.unsplash.com')) {
    try {
      const u = new URL(resolved);
      if (!u.searchParams.has('w')) u.searchParams.set('w', String(safeWidth));
      if (!u.searchParams.has('q')) u.searchParams.set('q', '80');
      if (!u.searchParams.has('auto')) u.searchParams.set('auto', 'format');
      return u.toString();
    } catch {
      return resolved.includes('?')
        ? `${resolved}&w=${safeWidth}&q=80`
        : `${resolved}?w=${safeWidth}&q=80`;
    }
  }

  // Local / CDN upload originals — request a card-sized derivative.
  if (resolved.includes('/uploads/')) {
    try {
      const u = new URL(resolved);
      u.searchParams.set('w', String(safeWidth));
      return u.toString();
    } catch {
      const join = resolved.includes('?') ? '&' : '?';
      return `${resolved}${join}w=${safeWidth}`;
    }
  }

  return resolved;
};
