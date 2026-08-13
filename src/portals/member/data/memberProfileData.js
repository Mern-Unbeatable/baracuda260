import {
  PHOTOGRAPHER_ARTWORK,
  PHOTOGRAPHER_ASSETS,
  PHOTOGRAPHER_FEATURED,
  PHOTOGRAPHER_MESSAGES,
  PHOTOGRAPHER_PREMIUM,
  PHOTOGRAPHER_PROFILE,
} from '@/portals/public/photographer/data/photographerProfileData';

const A = '/assets/home';

export const MEMBER_PROFILE_ASSETS = {
  ...PHOTOGRAPHER_ASSETS,
  cover: `${A}/photo-morning.jpg`,
};

export const MEMBER_PROFILE = {
  ...PHOTOGRAPHER_PROFILE,
  cover: MEMBER_PROFILE_ASSETS.cover,
  stats: {
    ...PHOTOGRAPHER_PROFILE.stats,
    premiumPhotos: 320,
  },
};

export const MEMBER_FEATURED = PHOTOGRAPHER_FEATURED;
export const MEMBER_ARTWORK = PHOTOGRAPHER_ARTWORK;
export const MEMBER_PREMIUM = PHOTOGRAPHER_PREMIUM;
export const MEMBER_MESSAGES = PHOTOGRAPHER_MESSAGES;
