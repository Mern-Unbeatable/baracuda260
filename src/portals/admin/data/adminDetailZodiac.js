/** Shared zodiac slide helpers for admin detail pages (gallery / competitions / premium). */

import { SIX_STORY_SLIDES } from '@/shared/data/gallerySixStory';
import { SIX_BLUE_STORY_SLIDES } from '@/shared/data/gallerySixStoryBlue';
import { TWELVE_STORY_SLIDES } from '@/shared/data/galleryTwelveStory';

export const ZODIAC_ICONS = {
  ARIES: '/assets/home/icon-aries.svg',
  TAURUS: '/assets/home/icon-taurus.svg',
  GEMINI: '/assets/home/icon-gemini.svg',
  CANCER: '/assets/home/icon-cancer.svg',
  LEO: '/assets/home/icon-leo.svg',
  VIRGO: '/assets/home/icon-virgo.svg',
  LIBRA: '/assets/home/icon-libra.svg',
  SCORPIO: '/assets/home/icon-scorpio.svg',
  SAGITTARIUS: '/assets/home/icon-sagittarius.svg',
  CAPRICORN: '/assets/home/icon-capricorn.svg',
  AQUARIUS: '/assets/home/icon-aquarius.svg',
  PISCES: '/assets/home/icon-pisces.svg',
};

/** @param {string | null | undefined} sign */
export const getZodiacIcon = (sign) => {
  if (!sign) return null;
  return ZODIAC_ICONS[String(sign).toUpperCase()] || null;
};

/** @param {string | null | undefined} sign */
export const formatZodiacName = (sign) => {
  if (!sign) return '';
  const s = String(sign);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

/**
 * Per-slot zodiac for multi-photo stories.
 *
 * For TWELVE/SIX, catalog position is authoritative. Do NOT trust media.zodiacSign
 * or a duplicated slotIndex — uploads sometimes stamp every file with the same
 * sign (e.g. Leo / #5), which would label the whole strip identically.
 *
 * @param {{ zodiacSign?: string | null, slotIndex?: number | null } | null | undefined} med
 * @param {number} idx Sorted image index (0-based) after slotIndex sort
 * @param {string} kind
 */
export const resolveSlideMeta = (med, idx, kind) => {
  const normalizedKind = String(kind || '').toUpperCase();
  const rawSlot =
    med?.slotIndex != null && Number.isFinite(Number(med.slotIndex))
      ? Number(med.slotIndex)
      : null;

  let catalog = null;
  let slot = idx;

  if (normalizedKind === 'TWELVE') {
    // Sorted position maps 1:1 onto the 12-sign strip.
    catalog = TWELVE_STORY_SLIDES;
    slot = idx;
  } else if (normalizedKind === 'SIX') {
    // SIX red uses slots 0–5; SIX blue uses 6–11 (or blue catalog 0–5).
    if (rawSlot != null && rawSlot >= 6 && rawSlot <= 11) {
      catalog = TWELVE_STORY_SLIDES;
      slot = rawSlot;
    } else if (rawSlot != null && rawSlot >= 0 && rawSlot <= 5) {
      catalog = SIX_STORY_SLIDES;
      slot = rawSlot;
    } else {
      catalog = SIX_STORY_SLIDES;
      slot = idx;
    }
  }

  const fromSlot = catalog?.[slot] || null;

  // Single-photo (or unknown): allow media/album sign; multi never collapses to one sign.
  if (!fromSlot && normalizedKind !== 'TWELVE' && normalizedKind !== 'SIX') {
    const signKey = med?.zodiacSign
      ? String(med.zodiacSign).toUpperCase()
      : null;
    return {
      slot: rawSlot ?? idx,
      signKey,
      name: signKey ? formatZodiacName(signKey) : null,
      theme: 'red',
      icon: getZodiacIcon(signKey),
      iconBoxed: false,
      number: (rawSlot ?? idx) + 1,
    };
  }

  return {
    slot,
    signKey: fromSlot?.id ? String(fromSlot.id).toUpperCase() : null,
    name: fromSlot?.sign || `Photo ${slot + 1}`,
    theme: fromSlot?.theme || (slot % 2 === 0 ? 'red' : 'blue'),
    icon: fromSlot?.icon || getZodiacIcon(fromSlot?.id),
    iconBoxed: Boolean(fromSlot?.iconBoxed),
    number: fromSlot?.number ?? slot + 1,
  };
};

// Re-export blue six for callers that need the full set.
export { SIX_BLUE_STORY_SLIDES };
