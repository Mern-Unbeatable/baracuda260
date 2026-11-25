/**
 * Build gallery/competition story slides from media or images payloads.
 * Labels always come from strip position (Aries→Pisces), never from a
 * duplicated album/media zodiacSign (common upload bug: every file = LEO).
 */

import { SIX_BLUE_STORY_SLIDES } from '@/shared/data/gallerySixStoryBlue';
import { SIX_STORY_SLIDES } from '@/shared/data/gallerySixStory';
import { TWELVE_STORY_SLIDES } from '@/shared/data/galleryTwelveStory';

/**
 * @param {unknown} media
 * @param {unknown} images
 * @returns {object[]}
 */
export const collectStoryImageMedia = (media, images) => {
  if (Array.isArray(media) && media.length > 0) {
    return media
      .filter((m) => m && String(m.kind || 'IMAGE').toUpperCase() !== 'VIDEO')
      .slice()
      .sort((a, b) => (a.slotIndex ?? 0) - (b.slotIndex ?? 0));
  }

  if (!images || typeof images !== 'object') return [];

  const list = Array.isArray(images) ? images : Object.values(images);
  const seen = new Set();
  return list
    .filter(Boolean)
    .filter((img) => {
      const key = img.id || `${img.slotIndex ?? ''}:${img.url || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice()
    .sort((a, b) => (a.slotIndex ?? 0) - (b.slotIndex ?? 0));
};

/**
 * @param {object[]} imageMedia
 * @param {string} kind
 * @param {string} [theme]
 * @returns {object[]}
 */
export const buildZodiacStorySlides = (imageMedia, kind, theme) => {
  if (!Array.isArray(imageMedia) || imageMedia.length === 0) return [];

  const normalizedKind = String(kind || '').toUpperCase();
  const normalizedTheme = String(theme || '').toUpperCase();

  let catalog = null;
  if (normalizedKind === 'TWELVE') {
    catalog = TWELVE_STORY_SLIDES;
  } else if (normalizedKind === 'SIX') {
    catalog =
      normalizedTheme === 'BLUE' ? SIX_BLUE_STORY_SLIDES : SIX_STORY_SLIDES;
  }

  if (catalog) {
    return imageMedia.map((med, idx) => {
      const slide = catalog[idx] || catalog[0];
      return {
        id: med.id || slide.id || `media-${idx}`,
        number: slide.number,
        sign: slide.sign,
        name: slide.sign,
        thumb: med.thumbnailUrl || med.url,
        hero: med.url,
        theme: slide.theme || (idx % 2 === 0 ? 'red' : 'blue'),
        icon: slide.icon,
        iconBoxed: Boolean(slide.iconBoxed),
      };
    });
  }

  return imageMedia.map((med, idx) => ({
    id: med.id || `media-${idx}`,
    number: idx + 1,
    sign: med.zodiacSign
      ? String(med.zodiacSign).charAt(0).toUpperCase() +
        String(med.zodiacSign).slice(1).toLowerCase()
      : `Photo ${idx + 1}`,
    name: med.zodiacSign
      ? String(med.zodiacSign).charAt(0).toUpperCase() +
        String(med.zodiacSign).slice(1).toLowerCase()
      : `Photo ${idx + 1}`,
    thumb: med.thumbnailUrl || med.url,
    hero: med.url,
    theme: 'red',
    icon: null,
    iconBoxed: false,
  }));
};
