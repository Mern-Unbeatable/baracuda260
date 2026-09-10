/** Public promo-join onboarding — opened via /join/promo/:code */

import {
  ARTISTIC_CATEGORIES,
  DEFAULT_CATEGORY,
  DEFAULT_THEME_ID,
  SIX_PHOTO_ASSETS,
  THEMES,
  getSlotsForTheme,
  getThemeById,
} from '@/portals/member/data/sixPhotoAssets';
import {
  ALL_SLOTS,
  BLUE_SLOTS,
  RED_SLOTS,
  ZODIAC12_ASSETS,
} from '@/portals/member/data/zodiac12Assets';
import { ZODIAC_SIGNS } from '@/portals/member/data/singlePhotoAssets';
import { getPromoLinksStore } from '@/portals/admin/data/adminPromoLinksData';

export {
  ARTISTIC_CATEGORIES,
  DEFAULT_CATEGORY,
  DEFAULT_THEME_ID,
  SIX_PHOTO_ASSETS,
  THEMES,
  getSlotsForTheme,
  getThemeById,
  ALL_SLOTS,
  BLUE_SLOTS,
  RED_SLOTS,
  ZODIAC12_ASSETS,
  ZODIAC_SIGNS,
};

export const FIELD_BG = 'bg-[#ecedfa]';
export const PANEL_BG = 'bg-[#f3f4ff]';

export const EMPTY_ACCOUNT = {
  fullName: '',
  username: '',
  email: '',
  phone: '',
  country: '',
  paypal: '',
  about: '',
  password: '',
};

export const EMPTY_STORY = {
  title: '',
  category: DEFAULT_CATEGORY,
  subCategory: '',
  story: '',
  resolution: '6000*6000',
  fileSize: '125 KB',
  quality: '4K',
};

export const findPromoLinkByCode = (code) => {
  if (!code) return null;
  const normalized = String(code).trim().toUpperCase();
  return (
    getPromoLinksStore().find((link) => String(link.code).toUpperCase() === normalized) || null
  );
};

export const ABOUT_MAX_WORDS = 150;

export const countWords = (value) =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
