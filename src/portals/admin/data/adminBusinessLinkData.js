/** Admin Business Link Photos + Details — Figma 345:679 / 345:1130. */

import { TWELVE_STORY_SLIDES } from '@/shared/data/galleryTwelveStory';
import { resolveMediaUrl } from '@/shared/utils/media';

const A = '/assets/admin-business-link';

export const ADMIN_BUSINESS_LINK_ASSETS = {
  eye: `${A}/icon-eye.svg`,
  arrow: `${A}/icon-arrow.svg`,
  copy: `${A}/icon-copy.svg`,
  ariesWhite: `${A}/icon-aries-white.svg`,
  curve: `${A}/curve.svg`,
  divider: `${A}/divider.svg`,
};

export const EYE_ICON_SIZE = 24;
export const ARROW_ICON_SIZE = 16;
export const COPY_ICON_SIZE = 20;
export const BUSINESS_LINK_PAGE_SIZE = 10;
export const BUSINESS_LINK_SLIDE_MS = 6000;

/** Zodiac sign (API `zodiacSign`, e.g. "ARIES") → number, label, theme, icon. */
const ZODIAC_SLIDE_META = Object.fromEntries(
  TWELVE_STORY_SLIDES.map((slide) => [
    slide.id.toUpperCase(),
    {
      number: slide.number,
      sign: slide.sign,
      theme: slide.theme,
      icon: slide.icon,
      iconBoxed: Boolean(slide.iconBoxed),
    },
  ]),
);

const capitalize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';

/**
 * API `images` is keyed by zodiac sign (or slot); order slides by `slotIndex`.
 * @param {Record<string, object> | object[] | null | undefined} images
 */
export const buildBusinessAlbumSlides = (images) => {
  const list = Array.isArray(images) ? images : Object.values(images ?? {});

  return list
    .filter((image) => image?.url)
    .sort((a, b) => (a.slotIndex ?? 0) - (b.slotIndex ?? 0))
    .map((image, index) => {
      const zodiacSign = image.zodiacSign?.toUpperCase();
      const meta = ZODIAC_SLIDE_META[zodiacSign];
      const slotNumber = (image.slotIndex ?? index) + 1;
      return {
        id: image.id ?? `${zodiacSign}-${slotNumber}`,
        number: meta?.number ?? slotNumber,
        sign: meta?.sign ?? (capitalize(zodiacSign) || String(slotNumber)),
        theme: meta?.theme ?? (slotNumber > 6 ? 'blue' : 'red'),
        icon: meta?.icon ?? null,
        iconBoxed: meta?.iconBoxed ?? false,
        hero: resolveMediaUrl(image.url),
        thumb: resolveMediaUrl(image.thumbnailUrl || image.url),
      };
    });
};

/** @param {string | null | undefined} name */
export const getInitials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';

/**
 * @param {string | null | undefined} isoDate
 * @param {string} [locale]
 * @param {Intl.DateTimeFormatOptions} [options]
 */
export const formatBusinessLinkDate = (
  isoDate,
  locale,
  options = { year: 'numeric', month: 'numeric', day: 'numeric' },
) => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(locale, options);
};

/**
 * Detail path for a table row.
 * @param {string} id
 * @param {string} template
 */
export const getBusinessLinkDetailPath = (
  id,
  template = '/admin/business-link-photos/:id',
) => template.replace(':id', id);
